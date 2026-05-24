# Design System — Typography

> 구현 파일: `src/styles/typography.ts` · `src/styles/globals.css`
> TypeScript import: `import { displayScale, textCombinationsV2, fontWeights } from '@/styles'`

---

## 폰트 패밀리

| 변수 | 폰트 스택 | 용도 |
|---|---|---|
| `--font-family-display` | Public Sans → Pretendard → Noto Sans KR | h1–h5 헤딩 |
| `--font-family-body` / `--font-family-base` | Inter → Pretendard → Noto Sans KR | 본문/레이블/UI |
| `--font-family-korean` | Pretendard Variable → Noto Sans KR | 한국어 전용 |

> 한국어 폴백(`Pretendard Variable`, `Noto Sans KR`)은 **항상** 폰트 스택에 포함해야 합니다.

---

## 타입 스케일

| 역할 | 변수 | 크기 | 굵기 | 행간 | Tailwind 클래스 |
|---|---|---|---|---|---|
| Display LG | `--font-size-display-lg` | 48px | 700 | 1.2 | `textCombinationsV2.displayLg` |
| Headline LG | `--font-size-headline-lg` | 32px | 700 | 1.3 | `textCombinationsV2.headlineLg` |
| Headline MD | `--font-size-headline-md` | 24px | 600 | 1.4 | `textCombinationsV2.headlineMd` |
| Headline SM | `--font-size-headline-sm` | 20px | 600 | 1.4 | `textCombinationsV2.headlineSm` |
| Body LG | `--font-size-body-lg` | 18px | 400 | 1.6 | `textCombinationsV2.bodyLg` |
| Body MD | `--font-size-body-md` | 16px | 400 | 1.6 | `textCombinationsV2.bodyMd` |
| Body SM | `--font-size-body-sm` | 14px | 400 | 1.5 | `textCombinationsV2.bodySm` |
| Label LG | `--font-size-label-lg` | 14px | 600 | 1.2 | `textCombinationsV2.labelLg` |
| Label MD | `--font-size-label-md` | 12px | 500 | 1.2 | `textCombinationsV2.labelMd` |

---

## 사용 예시

```tsx
import { textCombinationsV2 } from '@/styles'

<h1 className={textCombinationsV2.headlineLg}>페이지 제목</h1>
<h2 className={textCombinationsV2.headlineMd}>섹션 제목</h2>
<p className={textCombinationsV2.bodyMd}>본문 내용</p>
<span className={textCombinationsV2.labelMd}>레이블</span>

// 테이블 셀 텍스트
<td className={textCombinationsV2.bodySm}>데이터</td>
```

---

## Do / Don't

### Do
- 헤딩(h1–h5)에 `--font-family-display` 적용
- 본문/레이블에 `--font-family-body` 적용
- 모든 `font-family` 선언에 Pretendard Variable, Noto Sans KR 폴백 포함

### Don't
- Public Sans를 테이블 바디 데이터에 사용 금지 (헤딩 전용)
- 한국어 글자에 `letter-spacing` 적용 금지
- 폰트 선언 시 한국어 폴백 생략 금지
- 하드코딩 `fontSize: '16px'` 금지 — CSS 변수 또는 토큰 사용
