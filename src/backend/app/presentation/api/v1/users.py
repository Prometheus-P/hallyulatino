"""Users API - 사용자 관련 엔드포인트."""

from fastapi import APIRouter, Depends, HTTPException, status

from app.application.dto.user import UserResponse, UserUpdateRequest
from app.domain.exceptions.auth import UserNotFoundError
from app.presentation.api.dependencies import (
    get_current_user,
    get_user_repository,
)

router = APIRouter()


@router.get(
    "/me",
    response_model=UserResponse,
    summary="내 프로필 조회",
    description="현재 로그인한 사용자의 프로필을 조회합니다.",
)
async def get_me(
    current_user=Depends(get_current_user),
) -> UserResponse:
    """내 프로필 조회 엔드포인트.

    Returns:
        UserResponse: 사용자 프로필
    """
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email.value,
        nickname=current_user.nickname,
        country=current_user.country,
        preferred_language=current_user.preferred_language,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        role=current_user.role,
        avatar_url=current_user.avatar_url,
        created_at=current_user.created_at,
    )


@router.patch(
    "/me",
    response_model=UserResponse,
    summary="내 프로필 수정",
    description="현재 로그인한 사용자의 프로필을 수정합니다.",
)
async def update_me(
    request: UserUpdateRequest,
    current_user=Depends(get_current_user),
    user_repository=Depends(get_user_repository),
) -> UserResponse:
    """내 프로필 수정 엔드포인트.

    Args:
        request: 수정할 정보

    Returns:
        UserResponse: 수정된 사용자 프로필
    """
    # 변경할 필드만 업데이트
    if request.nickname is not None:
        current_user.nickname = request.nickname
    if request.country is not None:
        current_user.country = request.country
    if request.preferred_language is not None:
        current_user.preferred_language = request.preferred_language
    if request.avatar_url is not None:
        current_user.avatar_url = request.avatar_url

    updated_user = await user_repository.update(current_user)

    return UserResponse(
        id=str(updated_user.id),
        email=updated_user.email.value,
        nickname=updated_user.nickname,
        country=updated_user.country,
        preferred_language=updated_user.preferred_language,
        is_active=updated_user.is_active,
        is_verified=updated_user.is_verified,
        role=updated_user.role,
        avatar_url=updated_user.avatar_url,
        created_at=updated_user.created_at,
    )
