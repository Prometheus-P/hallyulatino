---
title: "[Setup] AI 서비스 API 키 설정 (DeepL, OpenAI, Replicate)"
labels: setup, priority:medium, ai
---

## 개요
번역, 챗봇, 음성 인식 기능을 위한 AI 서비스 API 키 설정이 필요합니다.

## 필요한 서비스

### 1. DeepL (번역)
- [ ] https://www.deepl.com/pro-api 에서 계정 생성
- [ ] API 키 발급 (Free 티어 50만 자/월)
```env
DEEPL_API_KEY=xxx
```

### 2. OpenAI (GPT-4 챗봇)
- [ ] https://platform.openai.com 에서 계정 생성
- [ ] API 키 생성
```env
OPENAI_API_KEY=sk-xxx
```

### 3. Replicate (Whisper 음성 인식)
- [ ] https://replicate.com 에서 계정 생성
- [ ] API 토큰 생성
```env
REPLICATE_API_TOKEN=r8_xxx
```

### 4. ElevenLabs (AI 더빙 - Phase 3)
- [ ] https://elevenlabs.io 에서 계정 생성
- [ ] API 키 생성
```env
ELEVENLABS_API_KEY=xxx
```

## 참고
- 모든 서비스는 무료 티어 또는 체험판 제공
- 프로덕션에서는 사용량에 따라 유료 플랜 필요
