# 설정 이슈 목록

이 폴더에는 프로젝트 설정을 위해 생성해야 할 GitHub 이슈들이 포함되어 있습니다.

## 이슈 생성 방법

### 방법 1: GitHub CLI 사용 (권장)

```bash
# 모든 이슈 일괄 생성
for file in .github/ISSUES/0*.md; do
  title=$(grep "^title:" "$file" | sed 's/title: "\(.*\)"/\1/')
  labels=$(grep "^labels:" "$file" | sed 's/labels: //')
  body=$(sed '1,/^---$/d' "$file" | sed '1,/^---$/d')
  gh issue create --title "$title" --body "$body" --label "$labels"
done
```

### 방법 2: 수동 생성

1. GitHub 저장소 페이지에서 **Issues** 탭 클릭
2. **New issue** 버튼 클릭
3. 각 파일의 내용을 복사하여 붙여넣기
4. 적절한 레이블 추가

## 이슈 목록

| 우선순위 | 파일 | 제목 | 레이블 |
|----------|------|------|--------|
| **High** | 001-supabase-setup.md | Supabase 프로젝트 설정 | setup, database |
| **High** | 002-google-oauth-setup.md | Google OAuth 설정 | setup, auth |
| **High** | 007-security-keys-setup.md | 프로덕션 보안 키 설정 | setup, security |
| Medium | 003-ai-services-api-keys.md | AI 서비스 API 키 설정 | setup, ai |
| Medium | 004-n8n-credentials-setup.md | n8n Credentials 설정 | setup, automation |
| Low | 005-payment-system-setup.md | 결제 시스템 설정 | setup, payment |
| Low | 006-production-deployment.md | 프로덕션 배포 환경 | setup, infrastructure |

## 최소 요구 설정 (로컬 개발)

로컬에서 프로젝트를 실행하기 위한 최소 설정:

1. ✅ **001-supabase-setup.md** - Supabase 프로젝트 필수
2. ⬜ 002-google-oauth-setup.md - 소셜 로그인 기능 사용 시
3. ⬜ 003-ai-services-api-keys.md - AI 기능 사용 시

나머지는 프로덕션 배포 또는 특정 기능 사용 시 필요합니다.
