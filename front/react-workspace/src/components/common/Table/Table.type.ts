import type { ReactNode } from 'react'

export type TableCellAlign = 'center' | 'right' | 'left'

export type CellAs = 'td' | 'th'

export type ThScope = 'col' | 'row' | 'colgroup' | 'rowgroup'

/**
 * Table 컴포넌트 Props
 *
 * @example
 * ```tsx
 * <Table striped hoverable>
 *   <thead>
 *     <TableRow>
 *       <TableCell as="th" scope="col" align="left">이름</TableCell>
 *       <TableCell as="th" scope="col" align="right">금액</TableCell>
 *     </TableRow>
 *   </thead>
 *   <tbody>
 *     <TableRow>
 *       <TableCell align="left">딸기</TableCell>
 *       <TableCell align="right">10,000</TableCell>
 *     </TableRow>
 *   </tbody>
 * </Table>
 * ```
 */
export interface TableProps {
  /**
   * 짝수/홀수 줄 배경을 구분합니다.
   * @default false
   */
  striped?: boolean

  /**
   * 행 hover 스타일을 적용합니다.
   * @default true
   */
  hoverable?: boolean

  /**
   * 컬럼 구분선을 표시합니다. rowSpan/colSpan이 있는 복합 테이블에 권장.
   * @default false
   */
  bordered?: boolean

  /**
   * 아래쪽 모서리를 둥글게 표시합니다. 페이지네이션 등 하단에 이어지는
   * 요소와 시각적으로 하나의 카드처럼 붙여야 할 때 false로 설정합니다.
   * @default true
   */
  roundedBottom?: boolean

  /**
   * 접근성: table에 부여할 aria-label
   */
  ariaLabel?: string

  /**
   * 접근성: table에 부여할 aria-describedby
   */
  ariaDescribedBy?: string

  children: ReactNode
}

/**
 * tr 컴포넌트 Props
 *
 * @example
 * ```tsx
 * <TableRow groupEnd={true}>
 *   <TableCell>그룹 마지막 행</TableCell>
 * </TableRow>
 * ```
 */
export interface TableRowProps {
  /**
   * rowSpan 그룹의 마지막 행에 표시합니다. 그룹 간 경계선(2px)을 강조합니다.
   * @default false
   */
  groupEnd?: boolean
  children: ReactNode
}

/**
 * TableCell 컴포넌트 Props (td/th 통합)
 *
 * @example
 * ```tsx
 * // td (기본값)
 * <TableCell align="right">값</TableCell>
 *
 * // th (헤더 셀)
 * <TableCell as="th" scope="col" align="left">제목</TableCell>
 * ```
 */
export interface TableCellProps {
  /**
   * 렌더링할 HTML 요소
   * @default 'td'
   */
  as?: CellAs

  /**
   * 정렬
   * @default 'center'
   */
  align?: TableCellAlign

  /**
   * th 요소의 scope 속성 (as='th'일 때만 사용)
   */
  scope?: ThScope

  colSpan?: number
  rowSpan?: number
  children: ReactNode
}
