/**
 * 인스턴스 정체성 — 브랜드명은 `.env`의 `VITE_APP_NAME` 한 곳에서 온다(ADR-0006).
 * 컴포넌트에 브랜드 문자열을 하드코딩하지 말고 이 config를 소비할 것.
 * `index.html`의 `<title>`은 Vite의 `%VITE_APP_NAME%` 치환으로 같은 값을 쓴다.
 */
const label: string = import.meta.env.VITE_APP_NAME ?? 'React Workspace'

export const brand = {
  label,
  /** 사각 배지에 쓰는 한 글자 마크 — Sidebar의 파생 규칙과 동일 */
  mark: label.slice(0, 1),
} as const
