module.exports = {
  // 문자열은 홑따옴표로 포맷팅
  singleQuote: true,

  // JSX에서도 홑따옴표 사용
  jsxSingleQuote: true,

  // 코드 마지막에 세미콜론 없음
  semi: false,

  // 탭 사용 금지, 스페이스 사용
  useTabs: false,

  // 들여쓰기 너비는 2칸
  tabWidth: 2,

  // 객체나 배열 키:값 뒤에 항상 콤마 붙이기
  trailingComma: 'all',

  // 코드 한 줄 최대 길이는 100칸
  printWidth: 100,

  // 화살표 함수가 하나의 매개변수를 받을 때 괄호 생략
  arrowParens: 'avoid',

  // JSX의 마지막 `>`를 다음 줄로 내림
  bracketSameLine: false,

  // 라인 끝 자동 설정 (Windows의 'Delete cr' 에러 해결)
  endOfLine: 'auto',
}
