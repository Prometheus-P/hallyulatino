"""Domain Repositories - 리포지토리 인터페이스."""

from app.domain.repositories.user_repository import UserRepository
from app.domain.repositories.content_repository import ContentRepository

__all__ = ["UserRepository", "ContentRepository"]
