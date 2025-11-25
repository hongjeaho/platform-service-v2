/// <reference types="vite/client" />

/**
 * CSS 파일 import에 대한 타입 선언입니다.
 * CSS 파일을 모듈로 import할 때 타입 안전성을 제공합니다.
 */
declare module '*.css' {
  const css: Record<string, string>
  export default css
}

/**
 * CSS Module 파일 import에 대한 타입 선언입니다.
 * .module.css 파일의 클래스명을 타입 안전하게 접근할 수 있게 합니다.
 */
declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}
