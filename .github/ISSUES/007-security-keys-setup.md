---
title: "[Security] 프로덕션 보안 키 설정"
labels: setup, priority:high, security
---

## 개요
프로덕션 환경에서 반드시 변경해야 하는 보안 관련 설정입니다.

## 필수 변경 항목

### 1. SECRET_KEY
현재 .env.example에 있는 기본값을 안전한 랜덤 값으로 변경해야 합니다.

```bash
# Python으로 생성
python -c "import secrets; print(secrets.token_urlsafe(64))"
```

### 2. JWT 설정
```env
JWT_SECRET_KEY=<안전한 랜덤 값>
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7
```

### 3. n8n 관리자 계정
기본 admin/admin을 안전한 자격증명으로 변경:
```env
N8N_BASIC_AUTH_USER=<안전한 사용자명>
N8N_BASIC_AUTH_PASSWORD=<안전한 비밀번호>
```

### 4. 데이터베이스
로컬 개발용 기본값 대신 프로덕션 자격증명 사용:
```env
POSTGRES_PASSWORD=<안전한 비밀번호>
```

## 체크리스트
- [ ] 모든 기본 비밀번호 변경
- [ ] .env 파일이 .gitignore에 포함되어 있는지 확인
- [ ] 프로덕션 환경변수는 CI/CD 시크릿으로 관리
