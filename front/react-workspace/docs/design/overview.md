# Design System — Overview

지역 토지수용위원회 서비스 디자인 시스템. **신뢰, 공정성, 행정 효율**을 전달하는 시각 언어.

> 모든 토큰은 `src/styles/`에서 CSS 변수 또는 TypeScript export로 제공됩니다.
> 컴포넌트 스타일 작업 시 반드시 `/ds [domain]` 커맨드로 관련 토큰을 먼저 로드하세요.

---

## 브랜드 정체성

| 가치 | 시각 언어 |
|---|---|
| 신뢰 | Rich Navy(`#1a365d`) Primary — 무게감 있는 확정 액션 |
| 공정성 | Sky Blue(`#0061a5`) Accent — 접근 가능하고 중립적인 액션 |
| 행정 효율 | Blue-tinted White 배경 — 깔끔하고 차분한 정보 밀도 |

---

## 디자인 원칙

1. **위계 명확성**: Primary(확정) → Accent(일반) → Ghost(보조) 버튼 순서 준수
2. **정보 밀도**: 공공 서비스 특성상 테이블·폼 중심 — 여백보다 정보 우선
3. **일관된 상태 표현**: 접수/검토중/완료/반려/보류 상태 칩은 `statusChipVariants`만 사용
4. **소프트 섀도우**: 강한 그림자 금지 — 불투명도 14% 이하 소프트 섀도우만 허용

---

## 접근성 기준

- 색상 대비: WCAG 2.1 AA 기준 (본문 4.5:1, 대형 텍스트 3:1)
- 포커스 링: 2px Sky Blue(`var(--ring)`) — 키보드 내비게이션 필수
- 아이콘 전용 버튼: `aria-label` 필수
- 한국어 폴백: 모든 `font-family` 선언에 Pretendard Variable, Noto Sans KR 포함

---

## 다크 모드

`.dark` 클래스로 자동 전환. `tokens.ts`의 `darkModeColors`에서 관리.

```tsx
document.documentElement.classList.toggle('dark', isDark)
```

---

## 반응형 브레이크포인트

| 접두사 | 크기 |
|---|---|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |
| `2xl:` | 1536px |
