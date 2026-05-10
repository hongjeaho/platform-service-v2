export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 허용 타입 — CLAUDE.md 규칙 기준
    'type-enum': [2, 'always', ['feat', 'fix', 'refactor', 'chore', 'docs', 'test', 'style']],
    // 한글 subject는 case 규칙 비활성화
    'subject-case': [0],
    // 50자 이내
    'subject-max-length': [2, 'always', 50],
    // subject 빈 값 금지
    'subject-empty': [2, 'never'],
  },
}
