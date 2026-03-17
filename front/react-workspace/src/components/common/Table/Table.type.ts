import type { ReactNode } from 'react'

export type TableCellAlign = 'center' | 'right' | 'left'

/**
 * Table 컴포넌트 Props
 *
 * @example
 * ```tsx
 * <Table striped hoverable>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead align="left">이름</TableHead>
 *       <TableHead align="right">금액</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell align="left">딸기</TableCell>
 *       <TableCell align="right">10,000</TableCell>
 *     </TableRow>
 *   </TableBody>
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
 * thead 컴포넌트 Props
 *
 * @example
 * ```tsx
 * <TableHeader>
 *   <TableRow>
 *     <TableHead>컬럼</TableHead>
 *   </TableRow>
 * </TableHeader>
 * ```
 */
export interface TableHeaderProps {
  children: ReactNode
}

/**
 * tbody 컴포넌트 Props
 *
 * @example
 * ```tsx
 * <TableBody>
 *   <TableRow>
 *     <TableCell>값</TableCell>
 *   </TableRow>
 * </TableBody>
 * ```
 */
export interface TableBodyProps {
  children: ReactNode
}

/**
 * tfoot 컴포넌트 Props
 *
 * @example
 * ```tsx
 * <TableFooter>
 *   <TableRow>
 *     <TableCell colSpan={2}>합계</TableCell>
 *   </TableRow>
 * </TableFooter>
 * ```
 */
export interface TableFooterProps {
  children: ReactNode
}

/**
 * tr 컴포넌트 Props
 *
 * @example
 * ```tsx
 * <TableRow>
 *   <TableCell>값</TableCell>
 * </TableRow>
 * ```
 */
export interface TableRowProps {
  children: ReactNode
}

/**
 * th 컴포넌트 Props
 *
 * @example
 * ```tsx
 * <TableHead align="left">제목</TableHead>
 * ```
 */
export interface TableHeadProps {
  /**
   * 정렬
   * @default 'center'
   */
  align?: TableCellAlign
  colSpan?: number
  children: ReactNode
}

/**
 * td 컴포넌트 Props
 *
 * @example
 * ```tsx
 * <TableCell align="right">10,000</TableCell>
 * ```
 */
export interface TableCellProps {
  /**
   * 정렬
   * @default 'center'
   */
  align?: TableCellAlign
  colSpan?: number
  children: ReactNode
}

