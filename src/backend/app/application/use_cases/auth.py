"""Auth Use Cases - 인증 관련 유스케이스."""

from app.application.dto.auth import (
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    LoginResponse,
    TokenResponse,
    UserBasicInfo,
)
from app.application.interfaces.jwt_service import JWTService
from app.domain.entities.user import User
from app.domain.exceptions.auth import (
    EmailAlreadyExistsError,
    InvalidCredentialsError,
)
from app.domain.repositories.user_repository import UserRepository
from app.domain.value_objects.email import Email
from app.domain.value_objects.password import Password


class RegisterUserUseCase:
    """사용자 등록 유스케이스.

    새로운 사용자를 등록하고 인증 이메일을 발송합니다.
    """

    def __init__(self, user_repository: UserRepository) -> None:
        self._user_repository = user_repository

    async def execute(self, request: RegisterRequest) -> RegisterResponse:
        """사용자를 등록합니다.

        Args:
            request: 회원가입 요청 DTO

        Returns:
            RegisterResponse: 회원가입 응답 DTO

        Raises:
            EmailAlreadyExistsError: 이메일이 이미 존재하는 경우
            InvalidEmailError: 이메일 형식이 잘못된 경우
            WeakPasswordError: 비밀번호가 약한 경우
        """
        # 이메일 값 객체 생성 (유효성 검증 포함)
        email = Email(request.email)

        # 이메일 중복 확인
        if await self._user_repository.exists_by_email(email):
            raise EmailAlreadyExistsError()

        # 비밀번호 값 객체 생성 (강도 검증 포함)
        password = Password(request.password)

        # 사용자 엔티티 생성
        user = User(
            email=email,
            nickname=request.nickname,
            country=request.country,
            preferred_language=request.preferred_language,
        )
        user.set_password(password)

        # 저장
        created_user = await self._user_repository.create(user)

        return RegisterResponse(
            id=str(created_user.id),
            email=created_user.email.value,
            nickname=created_user.nickname,
        )


class LoginUserUseCase:
    """사용자 로그인 유스케이스.

    이메일/비밀번호로 사용자를 인증하고 토큰을 발급합니다.
    """

    def __init__(
        self,
        user_repository: UserRepository,
        jwt_service: JWTService,
    ) -> None:
        self._user_repository = user_repository
        self._jwt_service = jwt_service

    async def execute(self, request: LoginRequest) -> LoginResponse:
        """사용자를 로그인합니다.

        Args:
            request: 로그인 요청 DTO

        Returns:
            LoginResponse: 로그인 응답 DTO

        Raises:
            InvalidCredentialsError: 이메일 또는 비밀번호가 틀린 경우
        """
        # 이메일로 사용자 조회
        email = Email(request.email)
        user = await self._user_repository.find_by_email(email)

        if not user:
            raise InvalidCredentialsError()

        # 로그인 가능 여부 확인
        if not user.can_login():
            raise InvalidCredentialsError("계정이 비활성화되었습니다.")

        # 비밀번호 검증
        if not Password.verify_hash(request.password, user.password_hash):
            raise InvalidCredentialsError()

        # 토큰 생성
        access_token = self._jwt_service.create_access_token(
            user_id=str(user.id),
            email=user.email.value,
            role=user.role,
        )
        refresh_token = self._jwt_service.create_refresh_token(
            user_id=str(user.id),
        )

        return LoginResponse(
            user=UserBasicInfo(
                id=str(user.id),
                email=user.email.value,
                nickname=user.nickname,
                preferred_language=user.preferred_language,
            ),
            tokens=TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                expires_in=self._jwt_service.access_token_expire_seconds,
            ),
        )


class RefreshTokenUseCase:
    """토큰 갱신 유스케이스.

    유효한 리프레시 토큰으로 새 액세스 토큰을 발급합니다.
    """

    def __init__(
        self,
        user_repository: UserRepository,
        jwt_service: JWTService,
    ) -> None:
        self._user_repository = user_repository
        self._jwt_service = jwt_service

    async def execute(self, refresh_token: str) -> TokenResponse:
        """토큰을 갱신합니다.

        Args:
            refresh_token: 리프레시 토큰

        Returns:
            TokenResponse: 새 토큰 응답 DTO

        Raises:
            TokenExpiredError: 토큰이 만료된 경우
            InvalidCredentialsError: 토큰이 유효하지 않은 경우
        """
        # 리프레시 토큰 검증 및 사용자 ID 추출
        payload = self._jwt_service.verify_refresh_token(refresh_token)
        user_id = payload.get("sub")

        if not user_id:
            raise InvalidCredentialsError("유효하지 않은 토큰입니다.")

        # 사용자 조회
        from uuid import UUID
        user = await self._user_repository.find_by_id(UUID(user_id))

        if not user or not user.can_login():
            raise InvalidCredentialsError("사용자를 찾을 수 없습니다.")

        # 새 토큰 생성
        access_token = self._jwt_service.create_access_token(
            user_id=str(user.id),
            email=user.email.value,
            role=user.role,
        )
        new_refresh_token = self._jwt_service.create_refresh_token(
            user_id=str(user.id),
        )

        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            expires_in=self._jwt_service.access_token_expire_seconds,
        )
