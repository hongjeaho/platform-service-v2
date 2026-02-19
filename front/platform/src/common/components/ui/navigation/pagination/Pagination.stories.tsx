import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { Pagination } from './Pagination'
import type { PaginationProps } from './Pagination.types'

const meta = {
  title: 'UI/Navigation/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

function PaginationWrapper(props: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(props.currentPage)
  return <Pagination {...props} currentPage={currentPage} onPageChange={setCurrentPage} />
}

/** 기본 페이지네이션 (10개씩, 50개 항목) */
export const Default: Story = {
  render: () => (
    <PaginationWrapper currentPage={1} totalItems={50} pageSize={10} onPageChange={() => {}} />
  ),
}

/** 많은 페이지 (100개 항목, 10개씩 = 10페이지) */
export const ManyPages: Story = {
  render: () => (
    <PaginationWrapper currentPage={5} totalItems={100} pageSize={10} onPageChange={() => {}} />
  ),
}

/** 적은 페이지 (15개 항목, 5개씩 = 3페이지) */
export const FewPages: Story = {
  render: () => (
    <PaginationWrapper currentPage={1} totalItems={15} pageSize={5} onPageChange={() => {}} />
  ),
}

/** 컴팩트 모드 (처음/마지막 버튼 숨김) */
export const Compact: Story = {
  render: () => (
    <PaginationWrapper
      currentPage={3}
      totalItems={50}
      pageSize={10}
      onPageChange={() => {}}
      compact
    />
  ),
}

/** 표시 페이지 개수 5개 (visiblePageCount=5) */
export const CustomVisibleCount: Story = {
  render: () => (
    <PaginationWrapper
      currentPage={10}
      totalItems={200}
      pageSize={10}
      onPageChange={() => {}}
      visiblePageCount={5}
    />
  ),
}
