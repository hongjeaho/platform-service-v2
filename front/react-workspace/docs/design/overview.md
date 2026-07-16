# Design System — Overview

**Friendly Trust × Enterprise Dashboard** 디자인 시스템. 밝고 친근한 블루 팔레트에 사이드바 기반 엔터프라이즈 대시보드 구조를 결합한 시각 언어.

> 모든 토큰은 `src/styles/`에서 CSS 변수 또는 TypeScript export로 제공됩니다.
> 컴포넌트 스타일 작업 시 반드시 `/ds [domain]` 커맨드로 관련 토큰을 먼저 로드하세요.

---

## 브랜드 정체성

| 가치   | 시각 언어                                                                     |
| ------ | ----------------------------------------------------------------------------- |
| 신뢰감 | Bright Blue Primary(`--primary`) — 친근하지만 또렷한 확정 액션                |
| 접근성 | 큰 radius(버튼 14px·카드 20px)와 컬러 틴트 소프트 섀도우 — 딱딱하지 않은 인상 |
| 생산성 | 사이드바 내비게이션 + 브레드크럼 톱바 기반 엔터프라이즈 대시보드 구조         |

---

## 디자인 원칙

1. **위계 명확성**: Primary(확정) → Secondary/Outline(일반) → Ghost(보조) 버튼 순서 준수
2. **대시보드 구조 우선**: 실제 화면은 AppShell(Sidebar+Topbar) 안에서 KPI 카드·필터바·테이블·위젯을 조합해 구성
3. **일관된 상태 표현**: 접수/검토중/완료/반려/보류 상태 칩은 `statusChipVariants`만 사용
4. **컬러 틴트 소프트 섀도우**: 순수 블랙 그림자 대신 브랜드/시맨틱 컬러가 옅게 섞인 섀도우만 사용 (`shadowValues` 참조)

---

## 접근성 기준

- 색상 대비: WCAG 2.1 AA 기준 (본문 4.5:1, 대형 텍스트 3:1)
- 포커스 링: 2px Primary Blue(`var(--ring)`) — 키보드 내비게이션 필수. 전역 `*:focus-visible` 규칙(`globals.css`)이 이미 적용되어 있어 별도 CSS 없이도 동작함
- 아이콘 전용 버튼: `aria-label` 필수 (`Button`은 dev 모드에서 누락 시 콘솔 경고)
- 한국어 폴백: 모든 `font-family` 선언에 Pretendard Variable, Noto Sans KR 포함. 헤딩/본문 모두 **Pretendard Variable을 최우선** 폰트로 사용(라틴 폴백: 헤딩 Public Sans, 본문 Inter)

---

## 다크 모드 — 현재 미지원

다크 모드는 지원하지 않습니다. 이전 디자인 방향(Civic Authority)의 팔레트 값이 남아 있던 `.dark` 블록은 도달 경로(테마 토글)가 없고 현재 브랜드와 불일치하여 삭제했습니다([ADR-0007](../../../docs/adr/0007-css-variables-single-theme-source.md)). 다크 모드가 요구사항이 되면 현재 브랜드 기준으로 팔레트를 새로 설계합니다(이전 값은 git 히스토리 참조).

---

## 반응형 브레이크포인트

| 접두사 | 크기   |
| ------ | ------ |
| `sm:`  | 640px  |
| `md:`  | 768px  |
| `lg:`  | 1024px |
| `xl:`  | 1280px |
| `2xl:` | 1536px |
