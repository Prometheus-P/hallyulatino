---
title: "[Setup] n8n 워크플로우 Credentials 설정"
labels: setup, priority:medium, automation
---

## 개요
n8n 자동화 워크플로우에서 외부 서비스 연동을 위한 Credentials 설정이 필요합니다.

## 필요한 작업

### 1. n8n 접속
- docker-compose 실행 후 http://localhost:5678 접속
- 기본 계정: admin / admin (변경 권장)

### 2. Credentials 설정 (Settings > Credentials)

#### Supabase
- [ ] Type: Supabase
- [ ] Host: `${SUPABASE_URL}`
- [ ] Service Role Key: `${SUPABASE_SERVICE_KEY}`

#### DeepL
- [ ] Type: DeepL
- [ ] API Key: `${DEEPL_API_KEY}`

#### Replicate (Whisper)
- [ ] Type: Header Auth
- [ ] Name: Authorization
- [ ] Value: `Token ${REPLICATE_API_TOKEN}`

### 3. 워크플로우 임포트
- [ ] n8n/workflows/*.json 파일 임포트
- [ ] 각 워크플로우에서 Credentials 연결 확인
- [ ] 워크플로우 활성화

## 포함된 워크플로우
1. 콘텐츠 자막 생성 파이프라인
2. 신규 콘텐츠 알림 시스템
