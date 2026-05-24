# Design System — Spacing

> 구현 파일: `src/styles/spacing.ts` · `src/styles/globals.css`
> TypeScript import: `import { spacingScaleV2, borderRadiusValues, layouts, zIndex } from '@/styles'`

---

## 스페이싱 (8px 기반)

| 이름 | 변수 | 값 | 용도 |
|---|---|---|---|
| xs | `--spacing-xs` | 4px | 아이콘-텍스트 간격 |
| base | `--spacing-base` | 8px | 기본 단위 |
| sm | `--spacing-sm` | 12px | 폼 필드 내부 |
| md | `--spacing-md` | 24px | 카드 패딩 / 컬럼 gap |
| lg | `--spacing-lg` | 48px | 섹션 간 분리 |
| xl | `--spacing-xl` | 80px | 페이지 레벨 섹션 |
| gutter | `--spacing-gutter` | 24px | 그리드 컬럼 간격 |
| margin | `--spacing-margin` | 32px | 페이지 아우터 마진 |

기존 Tailwind 호환 스케일(`--spacing-1` ~ `--spacing-20`)도 유지됩니다.

```tsx
import { spacingScaleV2 } from '@/styles'

// 인라인 스타일이 꼭 필요한 경우
<div style={{ padding: spacingScaleV2.md }}>카드</div>
<span style={{ gap: spacingScaleV2.xs }}>아이콘 + 텍스트</span>
```

---

## 보더 반경

| 변수 | 값 | 용도 |
|---|---|---|
| `--radius-sm` | 4px | 배지, 태그 |
| `--radius` | 8px | 버튼, 입력 필드, 카드 (기본) |
| `--radius-md` | 12px | 중형 카드 |
| `--radius-lg` | 16px | 대형 카드, 모달 |
| `--radius-xl` | 24px | 페이지 레벨 컨테이너 |
| `--radius-full` | 9999px | 상태 칩(pill), 페이지네이션 버튼 |

---

## z-index

| 레이어 | 값 | 용도 |
|---|---|---|
| `zIndex.dropdown` | 1000 | 드롭다운, 셀렉트 |
| `zIndex.sticky` | 1020 | 스티키 헤더 |
| `zIndex.modal` | 1050 | 모달 오버레이 |
| `zIndex.tooltip` | 1070 | 툴팁 |

---

## Do / Don't

### Do
- 4px 그리드(xs=4, base=8, sm=12...) 준수
- 컴포넌트 내부 간격: `--spacing-1`~`--spacing-4` 범위
- 섹션 간 분리: `--spacing-lg` 이상

### Don't
- 홀수 픽셀(5px, 7px, 11px 등) 사용 금지
- `--spacing-lg`(48px)를 컴포넌트 내부 gap으로 사용 금지 (섹션 레벨 전용)
- `--spacing-xl`(80px)를 카드 패딩으로 사용 금지
- 카드에 `--shadow-2xl` 사용 금지 (모달 전용)
