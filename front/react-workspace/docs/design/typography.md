# Design System — Typography

> 구현 파일: `src/styles/typography.ts` · `src/styles/globals.css`
> TypeScript import: `import { textCombinations, fontWeights } from '@/styles'`

---

## 폰트 패밀리

| 변수                                        | 폰트 스택                                            | 용도           |
| ------------------------------------------- | ---------------------------------------------------- | -------------- |
| `--font-family-display`                     | **Pretendard Variable** → Public Sans → Noto Sans KR | h1–h5 헤딩     |
| `--font-family-body` / `--font-family-base` | **Pretendard Variable** → Inter → Noto Sans KR       | 본문/레이블/UI |
| `--font-family-korean`                      | Pretendard Variable → Noto Sans KR                   | 한국어 전용    |

Pretendard Variable이 헤딩·본문 모두에서 **최우선 폰트**입니다(라틴 폴백만 Public Sans/Inter로 구분). 이미 self-host된 폰트 파일이라 별도 로딩 비용이 없습니다.

> 한국어 폴백(`Pretendard Variable`, `Noto Sans KR`)은 **항상** 폰트 스택에 포함해야 합니다.

---

## 타입 스케일 — `textCombinations`

실제 컴포넌트(Input/CheckBox/ComboBox/Textarea/Select/FileUpload/AttachmentGroup 등)가 공통으로 사용하는 단일 타입 스케일입니다. 과거 존재하던 `textCombinationsV2`(Tailwind 클래스, 다른 키 체계)와 `displayScale`(인라인 스타일 객체)은 중복이라 제거되었습니다.

| 역할      | 키         | Tailwind 클래스 조합                   |
| --------- | ---------- | -------------------------------------- |
| H1        | `h1`       | `text-3xl font-bold leading-tight`     |
| H2        | `h2`       | `text-2xl font-semibold leading-tight` |
| H3        | `h3`       | `text-xl font-semibold leading-tight`  |
| H4        | `h4`       | `text-lg font-semibold leading-normal` |
| Body LG   | `bodyLg`   | `text-base font-normal leading-normal` |
| Body      | `body`     | `text-base font-normal leading-normal` |
| Body SM   | `bodySm`   | `text-sm font-normal leading-normal`   |
| Body XS   | `bodyXs`   | `text-xs font-normal leading-normal`   |
| Button    | `button`   | `text-base font-medium leading-normal` |
| Button SM | `buttonSm` | `text-sm font-medium leading-normal`   |
| Label     | `label`    | `text-sm font-medium leading-normal`   |
| Label SM  | `labelSm`  | `text-xs font-medium leading-normal`   |
| Caption   | `caption`  | `text-xs font-normal leading-normal`   |

---

## 사용 예시

```tsx
import { textCombinations } from '@/styles'

<h1 className={textCombinations.h1}>페이지 제목</h1>
<h2 className={textCombinations.h2}>섹션 제목</h2>
<p className={textCombinations.body}>본문 내용</p>
<span className={textCombinations.label}>레이블</span>

// 테이블 셀 텍스트
<td className={textCombinations.bodySm}>데이터</td>
```

---

## Do / Don't

### Do

- 헤딩(h1–h5)에 `--font-family-display` 적용
- 본문/레이블에 `--font-family-body` 적용
- 모든 `font-family` 선언에 Pretendard Variable, Noto Sans KR 폴백 포함
- 새 컴포넌트는 반드시 `textCombinations`만 참조 (다른 타입 스케일을 새로 만들지 말 것)

### Don't

- 한국어 글자에 `letter-spacing` 적용 금지
- 폰트 선언 시 한국어 폴백 생략 금지
- 하드코딩 `fontSize: '16px'` 금지 — CSS 변수 또는 토큰 사용
- 삭제된 `textCombinationsV2`/`displayScale` 재도입 금지 — `textCombinations` 하나로 유지
