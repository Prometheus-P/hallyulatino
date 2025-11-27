---
title: "[Setup] Supabase 프로젝트 설정"
labels: setup, priority:high, database
---

## 개요
HallyuLatino 프로젝트의 핵심 데이터베이스 및 인증을 담당하는 Supabase 설정이 필요합니다.

## 필요한 작업

### 1. Supabase 프로젝트 생성
- [ ] https://supabase.com 에서 프로젝트 생성
- [ ] 프로젝트 이름: `hallyulatino` (권장)
- [ ] 리전: 라틴 아메리카 사용자를 위해 `South America (São Paulo)` 권장

### 2. API 키 확보
- [ ] Settings > API 에서 다음 정보 복사:
  - `Project URL` → SUPABASE_URL
  - `anon public` → SUPABASE_ANON_KEY
  - `service_role` → SUPABASE_SERVICE_KEY (비밀로 유지)

### 3. .env 파일 설정
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_KEY=<your-supabase-service-key>

# 프론트엔드용
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

### 4. 데이터베이스 테이블 생성
- [ ] `users` 테이블 생성 (스키마는 docs/specs/ARCHITECTURE.md 참조)
- [ ] `contents` 테이블 생성
- [ ] Row Level Security (RLS) 정책 설정

## 참고 문서
- ENVIRONMENT.md
- docs/specs/ARCHITECTURE.md
