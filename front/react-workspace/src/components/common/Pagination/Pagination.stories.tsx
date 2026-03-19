import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'

import { Pagination } from './Pagination'

const Render: Story['render'] = args => {
  const [{ currentPage }, updateArgs] = useArgs()

  return (
    <Pagination
      {...args}
      currentPage={currentPage}
      onPageChange={page => updateArgs({ currentPage: page })}
    />
  )
}

const meta: Meta<typeof Pagination> = {
  title: 'Common/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: '비활성 버튼 variant',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: '현재 페이지 버튼 color',
    },
    showFirstButton: { control: 'boolean', description: '처음 버튼 노출 여부' },
    showLastButton: { control: 'boolean', description: '마지막 버튼 노출 여부' },
    pageGroupSize: { control: 'number', description: '페이지 그룹 크기' },
    showPageNumbersOnly: { control: 'boolean', description: '페이지 번호만 노출' },
    currentPage: { control: 'number', description: '현재 페이지 (1-based)' },
    totalPages: { control: 'number', description: '전체 페이지 수' },
    onPageChange: { action: 'pageChange' },
  },
  render: Render,
}

export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = {
  args: {
    variant: 'primary',
    color: 'primary',
    showFirstButton: false,
    showLastButton: false,
    pageGroupSize: 5,
    showPageNumbersOnly: false,
    currentPage: 9,
    totalPages: 15,
    onPageChange: () => {},
  },
}

export const FirstLastEnabled: Story = {
  args: {
    ...Default.args,
    showFirstButton: true,
    showLastButton: true,
    currentPage: 4,
  },
}

export const PageNumbersOnly: Story = {
  args: {
    ...Default.args,
    showPageNumbersOnly: true,
  },
}
