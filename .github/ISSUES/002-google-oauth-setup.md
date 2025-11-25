---
title: "[Setup] Google OAuth 설정"
labels: setup, priority:high, auth
---

## 개요
소셜 로그인을 위한 Google OAuth 2.0 설정이 필요합니다.

## 필요한 작업

### 1. Google Cloud Console 설정
- [ ] https://console.cloud.google.com 접속
- [ ] 프로젝트 생성 또는 선택
- [ ] APIs & Services > OAuth consent screen 설정
  - User Type: External
  - App name: HallyuLatino
  - Support email 설정
  - 범위: email, profile, openid

### 2. OAuth 자격증명 생성
- [ ] APIs & Services > Credentials
- [ ] Create Credentials > OAuth client ID
- [ ] Application type: Web application
- [ ] Authorized redirect URIs:
  - 로컬: `http://localhost:3000/auth/callback/google`
  - 프로덕션: `https://your-domain.com/auth/callback/google`

### 3. .env 파일 설정
```env
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback/google
```

## 참고
- OAuth 클라이언트 ID/시크릿은 절대 public 저장소에 커밋하지 마세요
- 프로덕션 배포 시 리디렉션 URI 업데이트 필요
