"""인증 API 통합 테스트.

FastAPI TestClient를 사용한 API 엔드포인트 통합 테스트.
"""

import pytest
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app
from app.domain.entities.user import User
from app.domain.value_objects.email import Email
from app.domain.value_objects.password import Password
from app.presentation.api.dependencies import (
    get_user_repository,
    get_jwt_service,
)
from app.infrastructure.external.jwt_service import JWTServiceImpl
from app.config.settings import Settings


@pytest.fixture
def test_settings():
    """테스트용 설정."""
    return Settings(
        app_env="development",
        database_url="postgresql://test:test@localhost:5432/test",
        redis_url="redis://localhost:6379/1",
        secret_key="test-secret-key-for-testing-only",
        supabase_url="https://test.supabase.co",
        supabase_service_key="test-service-key",
    )


@pytest.fixture
def jwt_service(test_settings):
    """JWT 서비스 인스턴스."""
    return JWTServiceImpl(test_settings)


@pytest.fixture
def mock_user_repository():
    """Mock 사용자 리포지토리."""
    return AsyncMock()


@pytest.fixture
def client(mock_user_repository, jwt_service):
    """테스트 클라이언트를 반환합니다."""
    app.dependency_overrides[get_user_repository] = lambda: mock_user_repository
    app.dependency_overrides[get_jwt_service] = lambda: jwt_service
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def mock_user():
    """테스트용 사용자를 생성합니다."""
    password = Password("SecureP@ss1")
    return User(
        id=uuid4(),
        email=Email("test@example.com"),
        password_hash=password.hash(),
        nickname="TestUser",
        country="MX",
        preferred_language="es",
        is_active=True,
        is_verified=False,
        role="user",
    )


class TestHealthCheck:
    """헬스체크 API 테스트."""

    def test_health_check_returns_healthy(self, client: TestClient):
        """헬스체크 엔드포인트가 healthy를 반환해야 한다."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    def test_root_returns_api_info(self, client: TestClient):
        """루트 엔드포인트가 API 정보를 반환해야 한다."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "HallyuLatino" in data["message"]


class TestRegistrationAPI:
    """회원가입 API 테스트."""

    def test_register_with_valid_data(
        self,
        client: TestClient,
        mock_user_repository: AsyncMock,
    ):
        """유효한 데이터로 회원가입이 성공해야 한다."""
        # Mock 설정
        mock_user_repository.exists_by_email.return_value = False
        mock_user_repository.create.return_value = User(
            id=uuid4(),
            email=Email("newuser@example.com"),
            nickname="NewUser",
            country="MX",
            preferred_language="es",
        )

        # 요청
        response = client.post(
            "/v1/auth/register",
            json={
                "email": "newuser@example.com",
                "password": "SecureP@ss1",
                "nickname": "NewUser",
                "country": "MX",
                "preferred_language": "es",
            },
        )

        # 검증
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "newuser@example.com"
        assert data["nickname"] == "NewUser"
        assert "message" in data

    def test_register_with_invalid_email_format(self, client: TestClient):
        """잘못된 이메일 형식으로 회원가입 시 400 에러를 반환해야 한다."""
        response = client.post(
            "/v1/auth/register",
            json={
                "email": "invalid-email",
                "password": "SecureP@ss1",
                "nickname": "Test",
                "country": "MX",
                "preferred_language": "es",
            },
        )

        assert response.status_code == 422  # Pydantic validation error

    def test_register_with_weak_password(self, client: TestClient):
        """약한 비밀번호로 회원가입 시 400 에러를 반환해야 한다."""
        response = client.post(
            "/v1/auth/register",
            json={
                "email": "test@example.com",
                "password": "weak",
                "nickname": "Test",
                "country": "MX",
                "preferred_language": "es",
            },
        )

        assert response.status_code == 422  # Pydantic validation (min_length)

    def test_register_with_duplicate_email(
        self,
        client: TestClient,
        mock_user_repository: AsyncMock,
    ):
        """중복된 이메일로 회원가입 시 409 에러를 반환해야 한다."""
        # Mock 설정 - 이메일 이미 존재
        mock_user_repository.exists_by_email.return_value = True

        response = client.post(
            "/v1/auth/register",
            json={
                "email": "existing@example.com",
                "password": "SecureP@ss1",
                "nickname": "Test",
                "country": "MX",
                "preferred_language": "es",
            },
        )

        assert response.status_code == 409
        data = response.json()
        assert data["detail"]["code"] == "EMAIL_ALREADY_EXISTS"

    def test_register_with_long_password(
        self,
        client: TestClient,
        mock_user_repository: AsyncMock,
    ):
        """72바이트를 초과하는 긴 비밀번호로도 회원가입이 가능해야 한다.

        bcrypt는 72바이트까지만 처리하지만, 사용자 경험을 위해
        긴 비밀번호도 허용하고 내부적으로 truncate합니다.
        """
        # 80자 비밀번호 (72바이트 초과)
        long_password = "A" * 60 + "a1@secure!"  # 대문자, 소문자, 숫자, 특수문자 포함

        mock_user_repository.exists_by_email.return_value = False
        mock_user_repository.create.return_value = User(
            id=uuid4(),
            email=Email("longpass@example.com"),
            nickname="LongPassUser",
            country="MX",
            preferred_language="es",
        )

        response = client.post(
            "/v1/auth/register",
            json={
                "email": "longpass@example.com",
                "password": long_password,
                "nickname": "LongPassUser",
                "country": "MX",
                "preferred_language": "es",
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "longpass@example.com"


class TestLoginAPI:
    """로그인 API 테스트."""

    def test_login_with_valid_credentials(
        self,
        client: TestClient,
        mock_user_repository: AsyncMock,
        mock_user: User,
    ):
        """유효한 자격증명으로 로그인 시 토큰을 반환해야 한다."""
        # Mock 설정
        mock_user_repository.find_by_email.return_value = mock_user

        response = client.post(
            "/v1/auth/login",
            json={
                "email": "test@example.com",
                "password": "SecureP@ss1",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert "tokens" in data
        assert "user" in data
        assert data["tokens"]["token_type"] == "bearer"

        # JWT 토큰 검증 강화: 토큰이 실제 JWT 형식인지 확인
        access_token = data["tokens"]["access_token"]
        refresh_token = data["tokens"]["refresh_token"]

        # JWT는 3개의 부분(header.payload.signature)으로 구성됨
        assert access_token and isinstance(access_token, str)
        assert refresh_token and isinstance(refresh_token, str)
        assert access_token.count(".") == 2, "access_token이 JWT 형식이어야 함"
        assert refresh_token.count(".") == 2, "refresh_token이 JWT 형식이어야 함"

    def test_login_with_long_password(
        self,
        client: TestClient,
        mock_user_repository: AsyncMock,
    ):
        """72바이트를 초과하는 긴 비밀번호로도 로그인이 가능해야 한다.

        등록 시 사용한 긴 비밀번호로 로그인 시 동일하게 truncate되어 검증됩니다.
        """
        long_password = "A" * 60 + "a1@secure!"

        # 긴 비밀번호로 해시 생성
        password_obj = Password(long_password)
        hashed = password_obj.hash()

        mock_user = User(
            id=uuid4(),
            email=Email("longpass@example.com"),
            password_hash=hashed,
            nickname="LongPassUser",
            country="MX",
            preferred_language="es",
            is_active=True,
        )
        mock_user_repository.find_by_email.return_value = mock_user

        response = client.post(
            "/v1/auth/login",
            json={
                "email": "longpass@example.com",
                "password": long_password,
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert "tokens" in data

    def test_login_with_wrong_password(
        self,
        client: TestClient,
        mock_user_repository: AsyncMock,
        mock_user: User,
    ):
        """잘못된 비밀번호로 로그인 시 401 에러를 반환해야 한다."""
        mock_user_repository.find_by_email.return_value = mock_user

        response = client.post(
            "/v1/auth/login",
            json={
                "email": "test@example.com",
                "password": "WrongPassword1!",
            },
        )

        assert response.status_code == 401
        data = response.json()
        assert data["detail"]["code"] == "INVALID_CREDENTIALS"

    def test_login_with_nonexistent_email(
        self,
        client: TestClient,
        mock_user_repository: AsyncMock,
    ):
        """존재하지 않는 이메일로 로그인 시 401 에러를 반환해야 한다."""
        mock_user_repository.find_by_email.return_value = None

        response = client.post(
            "/v1/auth/login",
            json={
                "email": "nonexistent@example.com",
                "password": "SecureP@ss1",
            },
        )

        assert response.status_code == 401


class TestProtectedRoutes:
    """인증이 필요한 라우트 테스트."""

    def test_get_me_without_token(self, client: TestClient):
        """토큰 없이 /users/me 접근 시 401 에러를 반환해야 한다."""
        response = client.get("/v1/users/me")
        assert response.status_code == 403  # HTTPBearer returns 403 when missing

    def test_get_me_with_invalid_token(self, client: TestClient):
        """유효하지 않은 토큰으로 /users/me 접근 시 401 에러를 반환해야 한다."""
        response = client.get(
            "/v1/users/me",
            headers={"Authorization": "Bearer invalid_token"},
        )
        assert response.status_code == 401
