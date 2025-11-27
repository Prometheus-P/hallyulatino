---
title: "[Setup] 프로덕션 배포 환경 설정"
labels: setup, priority:low, deployment, infrastructure
---

## 개요
프로덕션 환경 배포를 위한 인프라 설정입니다.

## 필요한 서비스

### 1. 프론트엔드 (Vercel)
- [ ] https://vercel.com 계정 생성
- [ ] GitHub 저장소 연결
- [ ] 환경변수 설정 (NEXT_PUBLIC_*)
- [ ] 커스텀 도메인 연결

### 2. 백엔드 (Railway)
- [ ] https://railway.app 계정 생성
- [ ] GitHub 저장소 연결
- [ ] 환경변수 설정
- [ ] 커스텀 도메인 연결

### 3. Redis (Upstash)
- [ ] https://upstash.com 계정 생성
- [ ] Redis 인스턴스 생성
```env
UPSTASH_REDIS_REST_URL=xxx
UPSTASH_REDIS_REST_TOKEN=xxx
```

### 4. 스토리지 (Cloudflare R2)
- [ ] Cloudflare 계정 생성
- [ ] R2 버킷 생성: `hallyulatino`
```env
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com
```

### 5. 모니터링 (선택)
- [ ] Sentry 설정 (에러 트래킹)
- [ ] BetterStack 설정 (업타임 모니터링)

## 체크리스트
- [ ] 모든 환경변수 프로덕션 값으로 설정
- [ ] SECRET_KEY 안전한 값으로 변경
- [ ] CORS_ORIGINS 프로덕션 도메인 설정
- [ ] SSL/HTTPS 확인
