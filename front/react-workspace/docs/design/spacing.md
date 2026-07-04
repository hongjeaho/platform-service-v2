# Design System — Spacing

> 구현 파일: `src/styles/spacing.ts` · `src/styles/globals.css`
> TypeScript import: `import { spacingScale, borderRadiusValues, layouts, zIndex } from '@/styles'`

---

## 스페이싱 (8px 기반) — `spacingScale`

과거 존재하던 4px 단위 `spacingScale`(v1, 미사용)과 8px 단위 `spacingScaleV2`가 중복이었습니다. v1은 삭제했고, v2를 `spacingScale`이라는 이름으로 단일화했습니다.

| 이름   | 변수               | 값   | 용도                 |
| ------ | ------------------ | ---- | -------------------- |
| xs     | `--spacing-xs`     | 4px  | 아이콘-텍스트 간격   |
| base   | `--spacing-base`   | 8px  | 기본 단위            |
| sm     | `--spacing-sm`     | 12px | 폼 필드 내부         |
| md     | `--spacing-md`     | 24px | 카드 패딩 / 컬럼 gap |
| lg     | `--spacing-lg`     | 48px | 섹션 간 분리         |
| xl     | `--spacing-xl`     | 80px | 페이지 레벨 섹션     |
| gutter | `--spacing-gutter` | 24px | 그리드 컬럼 간격     |
| margin | `--spacing-margin` | 32px | 페이지 아우터 마진   |

기존 Tailwind 호환 스케일(`--spacing-1` ~ `--spacing-20`)도 유지됩니다.

```tsx
import { spacingScale } from '@/styles'

// 인라인 스타일이 꼭 필요한 경우
<div style={{ padding: spacingScale.md }}>카드</div>
<span style={{ gap: spacingScale.xs }}>아이콘 + 텍스트</span>
```

---

## 보더 반경

이번 재설계에서 전체적으로 커졌습니다 — Friendly Trust 방향의 둥근 인상을 위해 기존 대비 한 단계씩 상향했습니다.

| 변수            | 값     | 용도                             |
| --------------- | ------ | -------------------------------- |
| `--radius-sm`   | 8px    | 배지, 태그                       |
| `--radius`      | 14px   | 버튼, 입력 필드 (기본)           |
| `--radius-md`   | 16px   | 중형 카드                        |
| `--radius-lg`   | 20px   | 대형 카드, **모달**(AlertDialog) |
| `--radius-xl`   | 24px   | 페이지 레벨 컨테이너             |
| `--radius-full` | 9999px | 상태 칩(pill), 페이지네이션 버튼 |

> `Card`와 대시보드 위젯(`KpiCard`/`MiniBarChart`/`ActivityFeed`)은 `--radius-lg`(20px)를, `Button`/`Input` 등은 `--radius`(14px)를 사용합니다 — 카드류가 버튼류보다 한 단계 더 둥글게 설계되어 있습니다.

---

## z-index

| 레이어            | 값   | 용도             |
| ----------------- | ---- | ---------------- |
| `zIndex.dropdown` | 1000 | 드롭다운, 셀렉트 |
| `zIndex.sticky`   | 1020 | 스티키 헤더      |
| `zIndex.modal`    | 1050 | 모달 오버레이    |
| `zIndex.tooltip`  | 1070 | 툴팁             |

---

## Do / Don't

### Do

- 4px 그리드(xs=4, base=8, sm=12...) 준수
- 컴포넌트 내부 간격: `--spacing-1`~`--spacing-4` 범위
- 섹션 간 분리: `--spacing-lg` 이상
- 카드/모달류는 `--radius-lg`, 버튼/입력류는 `--radius` 사용 (혼용 금지)

### Don't

- 홀수 픽셀(5px, 7px, 11px 등) 사용 금지
- `--spacing-lg`(48px)를 컴포넌트 내부 gap으로 사용 금지 (섹션 레벨 전용)
- `--spacing-xl`(80px)를 카드 패딩으로 사용 금지
- 삭제된 `spacingScaleV2` 재도입 금지 — `spacingScale` 하나로 유지
