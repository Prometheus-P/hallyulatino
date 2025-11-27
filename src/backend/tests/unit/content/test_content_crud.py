"""콘텐츠 CRUD 단위 테스트.

TDD RED 단계: 실패하는 테스트를 먼저 작성합니다.
"""

import pytest
from unittest.mock import AsyncMock, MagicMock
from uuid import UUID, uuid4

from app.domain.entities.content import Content
from app.application.dto.content import (
    ContentResponse,
    ContentListResponse,
    CreateContentRequest,
    UpdateContentRequest,
)
from app.application.use_cases.content import (
    GetContentUseCase,
    ListContentsUseCase,
    CreateContentUseCase,
    UpdateContentUseCase,
    DeleteContentUseCase,
)
from app.domain.exceptions.content import ContentNotFoundError


class TestContentEntity:
    """콘텐츠 엔티티 테스트."""

    def test_should_create_content_with_default_values(self):
        """기본값으로 콘텐츠를 생성할 수 있다."""
        content = Content(title="Test Drama")

        assert content.title == "Test Drama"
        assert content.content_type == "drama"
        assert content.is_published is True
        assert content.view_count == 0
        assert content.rating == 0.0

    def test_should_get_localized_title(self):
        """언어에 맞는 제목을 반환해야 한다."""
        content = Content(
            title="사랑의 불시착",
            title_es="Aterrizaje de Emergencia en Tu Corazon",
            title_pt="Pousando no Amor",
        )

        assert content.get_title("es") == "Aterrizaje de Emergencia en Tu Corazon"
        assert content.get_title("pt") == "Pousando no Amor"
        assert content.get_title("ko") == "사랑의 불시착"

    def test_should_increment_view_count(self):
        """조회수를 증가시킬 수 있다."""
        content = Content(title="Test", view_count=100)

        content.increment_view_count()

        assert content.view_count == 101

    def test_should_update_rating(self):
        """평점을 업데이트할 수 있다."""
        content = Content(title="Test", rating=3.0)

        content.update_rating(4.5)

        assert content.rating == 4.5

    def test_should_not_update_invalid_rating(self):
        """유효하지 않은 평점은 업데이트되지 않아야 한다."""
        content = Content(title="Test", rating=3.0)

        content.update_rating(6.0)  # 유효하지 않은 값

        assert content.rating == 3.0  # 변경되지 않음

    def test_should_check_if_content_is_viewable(self):
        """콘텐츠가 조회 가능한지 확인할 수 있다."""
        published_content = Content(
            title="Test",
            is_published=True,
            video_url="https://example.com/video.m3u8"
        )
        unpublished_content = Content(
            title="Test",
            is_published=False,
            video_url="https://example.com/video.m3u8"
        )
        no_video_content = Content(
            title="Test",
            is_published=True,
            video_url=""
        )

        assert published_content.is_viewable() is True
        assert unpublished_content.is_viewable() is False
        assert no_video_content.is_viewable() is False

    def test_should_get_localized_description(self):
        """언어에 맞는 설명을 반환해야 한다."""
        content = Content(
            title="Test",
            description="한글 설명",
            description_es="Descripcion en espanol",
            description_pt="Descricao em portugues",
        )

        assert content.get_description("es") == "Descripcion en espanol"
        assert content.get_description("pt") == "Descricao em portugues"
        assert content.get_description("ko") == "한글 설명"

    def test_should_fallback_description_when_localized_not_set(self):
        """로컬라이즈된 설명이 없으면 기본 설명을 반환해야 한다."""
        content = Content(
            title="Test",
            description="Default description",
        )

        assert content.get_description("es") == "Default description"
        assert content.get_description("pt") == "Default description"

    def test_should_publish_and_unpublish_content(self):
        """콘텐츠를 게시/비게시 처리할 수 있다."""
        content = Content(title="Test", is_published=False)
        original_updated_at = content.updated_at

        content.publish()

        assert content.is_published is True
        assert content.updated_at >= original_updated_at

        content.unpublish()

        assert content.is_published is False

    def test_should_check_if_content_is_series(self):
        """콘텐츠가 시리즈인지 확인할 수 있다."""
        series_content = Content(
            title="Drama Episode 1",
            series_id=uuid4(),
        )
        standalone_content = Content(title="Movie")

        assert series_content.is_series() is True
        assert standalone_content.is_series() is False


class TestGetContent:
    """콘텐츠 조회 테스트."""

    @pytest.fixture
    def mock_content_repository(self):
        """콘텐츠 리포지토리 목."""
        return MagicMock()

    @pytest.mark.asyncio
    async def test_should_return_content_by_id(self, mock_content_repository):
        """ID로 콘텐츠를 조회할 수 있다."""
        # Given
        content_id = uuid4()
        content = Content(
            id=content_id,
            title="Goblin",
            title_es="Goblin: El Guardian Solitario",
            content_type="drama",
            genre=["fantasy", "romance"],
            release_year=2016,
        )
        mock_content_repository.find_by_id = AsyncMock(return_value=content)

        use_case = GetContentUseCase(mock_content_repository)

        # When
        result = await use_case.execute(content_id)

        # Then
        assert isinstance(result, ContentResponse)
        assert result.id == str(content_id)
        assert result.title == "Goblin"
        mock_content_repository.find_by_id.assert_called_once_with(content_id)

    @pytest.mark.asyncio
    async def test_should_return_404_for_nonexistent_content(
        self, mock_content_repository
    ):
        """존재하지 않는 콘텐츠 조회 시 에러를 발생시켜야 한다."""
        # Given
        content_id = uuid4()
        mock_content_repository.find_by_id = AsyncMock(return_value=None)

        use_case = GetContentUseCase(mock_content_repository)

        # When & Then
        with pytest.raises(ContentNotFoundError):
            await use_case.execute(content_id)


class TestListContents:
    """콘텐츠 목록 조회 테스트."""

    @pytest.fixture
    def mock_content_repository(self):
        """콘텐츠 리포지토리 목."""
        return MagicMock()

    @pytest.mark.asyncio
    async def test_should_list_contents_with_pagination(
        self, mock_content_repository
    ):
        """콘텐츠 목록을 페이지네이션으로 조회할 수 있다."""
        # Given
        contents = [
            Content(title="Drama 1", content_type="drama"),
            Content(title="Drama 2", content_type="drama"),
        ]
        mock_content_repository.find_all = AsyncMock(return_value=contents)
        mock_content_repository.count = AsyncMock(return_value=10)

        use_case = ListContentsUseCase(mock_content_repository)

        # When
        result = await use_case.execute(page=1, per_page=10)

        # Then
        assert isinstance(result, ContentListResponse)
        assert len(result.items) == 2
        assert result.total == 10
        assert result.page == 1

    @pytest.mark.asyncio
    async def test_should_filter_contents_by_content_type(
        self, mock_content_repository
    ):
        """콘텐츠 유형으로 필터링할 수 있다."""
        # Given
        contents = [Content(title="Drama 1", content_type="drama")]
        mock_content_repository.find_by_type = AsyncMock(return_value=contents)
        mock_content_repository.count_by_type = AsyncMock(return_value=5)

        use_case = ListContentsUseCase(mock_content_repository)

        # When
        result = await use_case.execute(page=1, per_page=10, content_type="drama")

        # Then
        assert len(result.items) == 1
        mock_content_repository.find_by_type.assert_called_once()

    @pytest.mark.asyncio
    async def test_should_filter_contents_by_genre(self, mock_content_repository):
        """장르로 콘텐츠를 필터링할 수 있다."""
        # Given
        contents = [
            Content(title="Romance Drama", genre=["romance", "drama"]),
        ]
        mock_content_repository.find_by_genre = AsyncMock(return_value=contents)
        mock_content_repository.count_by_genre = AsyncMock(return_value=3)

        use_case = ListContentsUseCase(mock_content_repository)

        # When
        result = await use_case.execute(page=1, per_page=10, genre="romance")

        # Then
        assert len(result.items) == 1
        mock_content_repository.find_by_genre.assert_called_once()

    @pytest.mark.asyncio
    async def test_should_calculate_total_pages_correctly(
        self, mock_content_repository
    ):
        """total_pages를 올바르게 계산해야 한다."""
        # Given: total이 per_page의 배수가 아닌 경우
        contents = [Content(title=f"Content {i}") for i in range(10)]
        mock_content_repository.find_all = AsyncMock(return_value=contents)
        mock_content_repository.count = AsyncMock(return_value=25)  # total=25, per_page=10 → 3 pages

        use_case = ListContentsUseCase(mock_content_repository)

        # When
        result = await use_case.execute(page=1, per_page=10)

        # Then
        assert result.total == 25
        assert result.total_pages == 3  # ceil(25/10) = 3

    @pytest.mark.asyncio
    async def test_should_prioritize_content_type_over_genre(
        self, mock_content_repository
    ):
        """content_type과 genre가 모두 제공되면 content_type이 우선된다."""
        # Given
        contents = [Content(title="Drama", content_type="drama")]
        mock_content_repository.find_by_type = AsyncMock(return_value=contents)
        mock_content_repository.count_by_type = AsyncMock(return_value=5)
        mock_content_repository.find_by_genre = AsyncMock()  # 호출되지 않아야 함

        use_case = ListContentsUseCase(mock_content_repository)

        # When
        result = await use_case.execute(
            page=1, per_page=10, content_type="drama", genre="romance"
        )

        # Then
        mock_content_repository.find_by_type.assert_called_once()
        mock_content_repository.find_by_genre.assert_not_called()


class TestCreateContent:
    """콘텐츠 생성 테스트."""

    @pytest.fixture
    def mock_content_repository(self):
        """콘텐츠 리포지토리 목."""
        return MagicMock()

    @pytest.mark.asyncio
    async def test_should_create_content_with_valid_data(
        self, mock_content_repository
    ):
        """유효한 데이터로 콘텐츠를 생성할 수 있다."""
        # Given
        content_id = uuid4()
        mock_content_repository.create = AsyncMock(
            return_value=Content(
                id=content_id,
                title="New Drama",
                content_type="drama",
                genre=["romance"],
            )
        )

        use_case = CreateContentUseCase(mock_content_repository)
        request = CreateContentRequest(
            title="New Drama",
            content_type="drama",
            genre=["romance"],
        )

        # When
        result = await use_case.execute(request)

        # Then
        assert result.title == "New Drama"
        mock_content_repository.create.assert_called_once()

    @pytest.mark.asyncio
    async def test_should_apply_title_fallback_for_localized_fields(
        self, mock_content_repository
    ):
        """title_es, title_pt가 없으면 title로 fallback되어야 한다."""
        # Given
        content_id = uuid4()

        async def capture_create(content: Content) -> Content:
            # 생성 시 전달된 Content의 필드 검증
            assert content.title_es == "Original Title"  # fallback
            assert content.title_pt == "Original Title"  # fallback
            return Content(
                id=content_id,
                title=content.title,
                title_es=content.title_es,
                title_pt=content.title_pt,
            )

        mock_content_repository.create = AsyncMock(side_effect=capture_create)

        use_case = CreateContentUseCase(mock_content_repository)
        request = CreateContentRequest(
            title="Original Title",
            content_type="drama",
            # title_es, title_pt 미설정
        )

        # When
        result = await use_case.execute(request)

        # Then
        assert result.title_es == "Original Title"
        assert result.title_pt == "Original Title"

    @pytest.mark.asyncio
    async def test_should_apply_default_values(self, mock_content_repository):
        """기본값이 올바르게 적용되어야 한다."""
        # Given
        content_id = uuid4()
        mock_content_repository.create = AsyncMock(
            return_value=Content(
                id=content_id,
                title="Test",
                genre=[],
                cast=[],
                release_year=2024,
            )
        )

        use_case = CreateContentUseCase(mock_content_repository)
        request = CreateContentRequest(
            title="Test",
            content_type="drama",
            # genre, cast, release_year 미설정
        )

        # When
        result = await use_case.execute(request)

        # Then
        assert result.genre == []
        assert result.cast == []


class TestUpdateContent:
    """콘텐츠 수정 테스트."""

    @pytest.fixture
    def mock_content_repository(self):
        """콘텐츠 리포지토리 목."""
        return MagicMock()

    @pytest.mark.asyncio
    async def test_should_update_content(self, mock_content_repository):
        """콘텐츠를 수정할 수 있다."""
        # Given
        content_id = uuid4()
        existing_content = Content(id=content_id, title="Old Title")
        updated_content = Content(id=content_id, title="New Title")

        mock_content_repository.find_by_id = AsyncMock(return_value=existing_content)
        mock_content_repository.update = AsyncMock(return_value=updated_content)

        use_case = UpdateContentUseCase(mock_content_repository)
        request = UpdateContentRequest(title="New Title")

        # When
        result = await use_case.execute(content_id, request)

        # Then
        assert result.title == "New Title"

    @pytest.mark.asyncio
    async def test_should_raise_error_when_content_not_found(
        self, mock_content_repository
    ):
        """존재하지 않는 콘텐츠 수정 시 에러를 발생시켜야 한다."""
        # Given
        content_id = uuid4()
        mock_content_repository.find_by_id = AsyncMock(return_value=None)

        use_case = UpdateContentUseCase(mock_content_repository)
        request = UpdateContentRequest(title="New Title")

        # When & Then
        with pytest.raises(ContentNotFoundError):
            await use_case.execute(content_id, request)

    @pytest.mark.asyncio
    async def test_should_only_update_provided_fields(self, mock_content_repository):
        """제공된 필드만 업데이트하고 나머지는 유지해야 한다."""
        # Given
        content_id = uuid4()
        existing_content = Content(
            id=content_id,
            title="Original Title",
            genre=["romance", "drama"],
            video_url="https://example.com/video.m3u8",
        )

        async def capture_update(content: Content) -> Content:
            # title만 변경되고 genre, video_url은 유지
            assert content.title == "Updated Title"
            assert content.genre == ["romance", "drama"]
            assert content.video_url == "https://example.com/video.m3u8"
            return content

        mock_content_repository.find_by_id = AsyncMock(return_value=existing_content)
        mock_content_repository.update = AsyncMock(side_effect=capture_update)

        use_case = UpdateContentUseCase(mock_content_repository)
        request = UpdateContentRequest(title="Updated Title")  # title만 변경

        # When
        await use_case.execute(content_id, request)

        # Then: capture_update에서 assertion 수행됨

    @pytest.mark.asyncio
    async def test_should_handle_series_id_and_is_published(
        self, mock_content_repository
    ):
        """series_id와 is_published 필드를 올바르게 처리해야 한다."""
        # Given
        content_id = uuid4()
        series_id = uuid4()
        existing_content = Content(id=content_id, title="Test", is_published=True)

        async def capture_update(content: Content) -> Content:
            assert content.series_id == series_id
            assert content.is_published is False
            return content

        mock_content_repository.find_by_id = AsyncMock(return_value=existing_content)
        mock_content_repository.update = AsyncMock(side_effect=capture_update)

        use_case = UpdateContentUseCase(mock_content_repository)
        request = UpdateContentRequest(
            series_id=str(series_id),
            is_published=False,
        )

        # When
        await use_case.execute(content_id, request)


class TestDeleteContent:
    """콘텐츠 삭제 테스트."""

    @pytest.fixture
    def mock_content_repository(self):
        """콘텐츠 리포지토리 목."""
        return MagicMock()

    @pytest.mark.asyncio
    async def test_should_delete_content(self, mock_content_repository):
        """콘텐츠를 삭제할 수 있다."""
        # Given
        content_id = uuid4()
        content = Content(id=content_id, title="To Delete")
        mock_content_repository.find_by_id = AsyncMock(return_value=content)
        mock_content_repository.delete = AsyncMock(return_value=True)

        use_case = DeleteContentUseCase(mock_content_repository)

        # When
        result = await use_case.execute(content_id)

        # Then
        assert result is True
        mock_content_repository.delete.assert_called_once_with(content_id)

    @pytest.mark.asyncio
    async def test_should_raise_error_when_deleting_nonexistent_content(
        self, mock_content_repository
    ):
        """존재하지 않는 콘텐츠 삭제 시 에러를 발생시켜야 한다."""
        # Given
        content_id = uuid4()
        mock_content_repository.find_by_id = AsyncMock(return_value=None)

        use_case = DeleteContentUseCase(mock_content_repository)

        # When & Then
        with pytest.raises(ContentNotFoundError):
            await use_case.execute(content_id)
