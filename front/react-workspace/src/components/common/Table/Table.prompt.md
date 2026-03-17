# 요구사항

아래의 조건을 모두 적용하여, 커서 룰을 준수하고 요구사항을 모두 구현할 것.  
작업이 끝나면 해당 rules 적용 결과를 체크리스트로 반환할 것.

# 컴포넌트 경로

`src/components/common/Table`

# 핵심 요구사항

단일 책임 원칙에 따라 다음을 만족하는 구조를 가져야 한다.
다음 조건을 모두 만족하는 variant 시스템을 구현해야 한다.

구조는 다음 같은 구조를 만족해야 한다.

```react
<Table>
  <TableHeader />
  <TableBody />
  <TableFooter />
</Table>
```

## Table

하위 컴포넌트 orchestration
striped와 hoverable가 모두 `true`일 때 가독성이 떨어지면 안된다.

- `striped`: `boolean` (기본값: `false`)
- `hoverable`: `boolean` (기본값: `true`)

## TableHeader

테이블에 header을 추가 한다.

## TableBody

테이블에 body을 추가 한다.

## TableRow

한 줄(row) 단위

## TableCell / TableHead

- `colSpan`: `number`
- `rowSpan`: `number`
- `align`: `center`, `right`, `left` (기본 : `center`)

## TableFooter

테이블에 fotter을 추가 한다.

# 완료 시 산출물

작업 종료 후 공통 컴포넌트 룰(common-component-rule.mdc) 적용 결과를 체크리스트로 반환할 것.
