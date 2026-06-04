---
description: 디자인 토큰 기반 공통 컴포넌트 스켈레톤 생성. 신규 공통 컴포넌트는 반드시 이 커맨드로 시작.
argument-hint: ComponentName (PascalCase, e.g. Badge, StatusChip, Tag)
---

디자인 토큰을 로드한 뒤, `src/components/common/` 하위에 6파일 컴포넌트 스켈레톤을 생성한다.
하드코딩 hex/rgb/px 없이 CSS 변수와 토큰 import만 사용한다.

## 실행 절차

### 1. 컨텍스트 로드

다음 파일들을 읽는다:
- `front/react-workspace/docs/design/components.md` — 컴포넌트 규칙
- `front/react-workspace/docs/design/color.md` — 색상 토큰
- `front/react-workspace/docs/design/tokens.md` — import 레퍼런스
- `front/react-workspace/src/styles/color.ts` — 실제 토큰 값
- `front/react-workspace/src/components/common/Button/` — 패턴 참조 (구조 확인)

### 2. 컴포넌트 분석

`$ARGUMENTS`(ComponentName)를 받아:
- 컴포넌트의 역할과 필요한 variant를 추론한다
- 사용할 디자인 토큰을 결정한다 (색상·타이포·스페이싱)
- Button 패턴 기준 6파일 구조를 확인한다

### 3. 파일 생성

`front/react-workspace/src/components/common/{ComponentName}/` 하위에 6개 파일 생성:

| 파일 | 내용 |
|---|---|
| `{Name}.tsx` | 컴포넌트 본체 — CSS 변수·token import만 사용, forwardRef 금지 (React 19), className prop 금지 |
| `{Name}.type.ts` | Props 타입 정의 |
| `{Name}.module.css` | CSS Module — `var(--*)` CSS 변수만 사용, 하드코딩 금지 |
| `{Name}.stories.tsx` | Storybook 스토리 — 모든 variant 표시 |
| `{Name}.test.tsx` | 기본 렌더링 + 주요 동작 테스트 |
| `index.ts` | named export |

### 4. 완료 확인

생성된 파일 목록과 사용된 토큰 목록을 출력한다.

## 사용 예시

```
/ds-gen Badge       → Badge 컴포넌트 스켈레톤 생성
/ds-gen StatusChip  → StatusChip 컴포넌트 스켈레톤 생성
/ds-gen Tag         → Tag 컴포넌트 스켈레톤 생성
```

## 주의사항

- `className` prop을 외부에 노출하지 않는다 — CSS Module 내 CSS 변수로만 스타일링
- `forwardRef` 사용 금지 — ref를 일반 prop으로 받는다 (React 19)
- 파생 값은 `useState+useEffect` 대신 인라인 계산으로 처리
- `useMemo`/`useCallback` 직접 작성 금지 — React Compiler가 자동 최적화
