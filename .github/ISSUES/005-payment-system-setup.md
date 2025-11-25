---
title: "[Setup] 결제 시스템 설정 (Stripe, MercadoPago)"
labels: setup, priority:low, payment, future
---

## 개요
구독/결제 기능 구현 시 필요한 결제 서비스 설정입니다.
(현재 구현되지 않음 - 향후 Phase)

## 필요한 서비스

### 1. Stripe (글로벌)
- [ ] https://stripe.com 계정 생성
- [ ] API 키 발급 (테스트/라이브)
```env
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### 2. MercadoPago (라틴 아메리카)
- [ ] https://www.mercadopago.com.br/developers 계정 생성
- [ ] 국가별 계정 설정 (브라질, 아르헨티나, 멕시코 등)
```env
MERCADOPAGO_ACCESS_TOKEN=xxx
MERCADOPAGO_PUBLIC_KEY=xxx
```

## 참고
- 결제 기능은 Phase 5 이후 구현 예정
- 테스트 모드에서 개발 후 프로덕션 전환
