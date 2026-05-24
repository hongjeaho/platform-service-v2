# Design System — Components

> 구현: `src/components/common/` — 각 컴포넌트 폴더 내 `.prompt.md` 참고
> 신규 컴포넌트 생성: `/ds-gen ComponentName` 커맨드 사용

---

## 버튼 의미 구분

| variant | 색상 | 언제 사용 |
|---|---|---|
| `primary` | Rich Navy | **확정 액션**: 제출, 확인, 저장, 승인 |
| `accent` | Sky Blue | **일반 액션**: 수정, 조회, 검색, 다운로드 |
| `outline` | 투명 + border | **취소** (비최종) |
| `destructive` | Red | **최종 삭제/반려**: 삭제, 반려, 최종취소 |
| `ghost` | 투명 | **맥락 내 보조** 액션 |

```tsx
import { buttonVariants } from '@/styles'

// 한 폼에 primary는 반드시 하나만
<button className={buttonVariants.primary}>저장</button>
<button className={buttonVariants.outline}>취소</button>
```

---

## 상태 칩 (Status Chip)

```tsx
import { statusChipVariants } from '@/styles'

// border-radius: 9999px 고정 (pill 형태만 허용)
<span className={statusChipVariants['접수']}>접수</span>
<span className={statusChipVariants['검토중']}>검토중</span>
<span className={statusChipVariants['완료']}>완료</span>
<span className={statusChipVariants['반려']}>반려</span>
<span className={statusChipVariants['보류']}>보류</span>
```

---

## 카드

- 배경: `var(--card)` (흰색)
- 테두리: `1px solid var(--border)`
- 반경: `var(--radius)` (8px)
- 섀도우: `var(--shadow-card)` (가장 옅은 것)

---

## 입력 필드

- 반경: `var(--radius)` (8px)
- 포커스 링: 2px, `var(--ring)` (Sky Blue)
- 에러 테두리: `var(--destructive)`
- RHF `register()` 스프레드 호환 필수

---

## 데이터 테이블

- 헤더 배경: `var(--surface-container-highest)` 또는 `var(--background)`
- 셀 텍스트: `textCombinationsV2.bodySm`
- 테두리: `1px solid var(--border)` (최소화)

---

## Do / Don't

### Do
- 한 폼에 `primary` 버튼 **하나**만
- 아이콘 전용 버튼에 `aria-label` 필수
- 카드 섀도우는 `var(--shadow-card)` 사용
- 상태 칩은 pill 형태(`border-radius: 9999px`)만

### Don't
- Primary 버튼을 한 화면에 2개 이상 사용 금지
- 상태 칩에 pill 이외의 반경 사용 금지
- 카드에 `--shadow-2xl` 사용 금지 (모달 전용)
- 공통 컴포넌트에 `className` prop 전달 금지 (인터페이스에서 제외됨)
