# src/styles CLAUDE.md

디자인 토큰 구현 레이어. 상세 스펙은 `docs/design/` 참조.

## 파일 역할 (SSOT 흐름)

```
tokens.ts → color.ts / typography.ts / spacing.ts / icons.ts → globals.css → index.ts
```

| 파일            | 역할                                                                 |
| --------------- | -------------------------------------------------------------------- |
| `tokens.ts`     | 원시 토큰값 — Single Source of Truth. OKLCH 색상값, 다크 모드 색상   |
| `color.ts`      | 의미론적 색상 (buttonVariants, statusChipVariants, surfaceColors 등) |
| `typography.ts` | 타입 스케일, 폰트 굵기, 트랜지션                                     |
| `spacing.ts`    | 스페이싱, 보더 반경, z-index, 레이아웃                               |
| `icons.ts`      | 아이콘 이름 상수, 크기, variant 조합                                 |
| `globals.css`   | CSS 변수 선언 + Tailwind v4 @theme 설정                              |
| `index.ts`      | 중앙 export — 모든 토큰의 진입점                                     |

## 불변 규칙

- `tokens.ts` 수정 시 → `globals.css` CSS 변수 동기화 필수
- 신규 토큰 추가 전 `/ds all` 커맨드로 중복 확인
- `index.ts` 미등록 토큰은 외부에서 접근 불가 — 반드시 export 추가

## 신규 토큰 추가 4-step

1. `tokens.ts`에 원시값 추가 (OKLCH 형식)
2. `globals.css` `:root`에 CSS 변수 추가 + `@theme inline`에 Tailwind 등록
3. 해당 카테고리 파일(`color.ts` 등)에 TypeScript export 추가
4. `index.ts`에 중앙 export 추가 + `docs/design/` 해당 파일 업데이트
