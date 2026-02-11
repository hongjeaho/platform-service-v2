import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '@/common/components/ui/action/button'
import { icons } from '@/constants/design/icons'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card'

const meta: Meta<typeof Card> = {
  title: 'UI/Data Display/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined'],
      description: 'Card 스타일 variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Card 크기',
    },
    interactive: {
      control: 'boolean',
      description: 'hover 효과 활성화 여부',
    },
  },
}

export default meta
type Story = StoryObj<typeof Card>

/**
 * 기본 Card 컴포넌트
 */
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    interactive: false,
  },
  render: args => (
    <Card {...args} style={{ width: '400px' }}>
      <CardHeader>
        <CardTitle>Card 제목</CardTitle>
        <CardDescription>Card 설명 텍스트입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card의 본문 내용입니다. 여기에 다양한 컨텐츠를 배치할 수 있습니다.</p>
      </CardContent>
    </Card>
  ),
}

/**
 * Footer가 있는 Card
 */
export const WithFooter: Story = {
  args: {
    variant: 'default',
    size: 'md',
    interactive: false,
  },
  render: args => (
    <Card {...args} style={{ width: '400px' }}>
      <CardHeader>
        <CardTitle>프로젝트 정보</CardTitle>
        <CardDescription>프로젝트 상세 정보를 확인하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>이 프로젝트는 토지보상 재결신청 관리 시스템입니다.</p>
      </CardContent>
      <CardFooter>
        <Button variant='outline' size='sm'>
          취소
        </Button>
        <Button variant='primary' size='sm'>
          확인
        </Button>
      </CardFooter>
    </Card>
  ),
}

/**
 * Elevated 스타일 Card
 */
export const Elevated: Story = {
  args: {
    variant: 'elevated',
    size: 'md',
    interactive: true,
  },
  render: args => (
    <Card {...args} style={{ width: '400px' }}>
      <CardHeader>
        <CardTitle>Elevated Card</CardTitle>
        <CardDescription>그림자 효과가 적용된 Card입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>마우스를 올리면 hover 효과를 확인할 수 있습니다.</p>
      </CardContent>
    </Card>
  ),
}

/**
 * Outlined 스타일 Card
 */
export const Outlined: Story = {
  args: {
    variant: 'outlined',
    size: 'md',
    interactive: true,
  },
  render: args => (
    <Card {...args} style={{ width: '400px' }}>
      <CardHeader>
        <CardTitle>Outlined Card</CardTitle>
        <CardDescription>테두리가 강조된 Card입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>마우스를 올리면 테두리 색상이 변경됩니다.</p>
      </CardContent>
    </Card>
  ),
}

/**
 * 크기별 비교
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
      <Card size='sm' style={{ width: '400px' }}>
        <CardHeader>
          <CardTitle>Small Card</CardTitle>
          <CardDescription>작은 크기의 Card입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>padding이 작게 적용됩니다.</p>
        </CardContent>
      </Card>

      <Card size='md' style={{ width: '400px' }}>
        <CardHeader>
          <CardTitle>Medium Card</CardTitle>
          <CardDescription>기본 크기의 Card입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>기본 padding이 적용됩니다.</p>
        </CardContent>
      </Card>

      <Card size='lg' style={{ width: '400px' }}>
        <CardHeader>
          <CardTitle>Large Card</CardTitle>
          <CardDescription>큰 크기의 Card입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>padding이 크게 적용됩니다.</p>
        </CardContent>
      </Card>
    </div>
  ),
}

/**
 * 아이콘이 포함된 Card
 */
export const WithIcon: Story = {
  render: () => {
    const InfoIcon = icons.info
    const SuccessIcon = icons.success

    return (
      <Card variant='elevated' size='md' style={{ width: '400px' }}>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <InfoIcon style={{ width: '1.5rem', height: '1.5rem' }} />
            <CardTitle>알림</CardTitle>
          </div>
          <CardDescription>중요한 안내사항입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>시스템 점검이 예정되어 있습니다.</p>
        </CardContent>
        <CardFooter>
          <Button variant='primary' size='sm'>
            <SuccessIcon style={{ width: '1rem', height: '1rem' }} />
            확인
          </Button>
        </CardFooter>
      </Card>
    )
  },
}

/**
 * 리스트 형태의 Card
 */
export const List: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', width: '400px' }}>
      {[1, 2, 3].map(index => (
        <Card key={index} variant='default' interactive>
          <CardHeader>
            <CardTitle>항목 {index}</CardTitle>
            <CardDescription>항목 {index}에 대한 설명입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>클릭 가능한 Card 항목입니다.</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
}

/**
 * 그리드 레이아웃
 */
export const Grid: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        width: '600px',
      }}
    >
      {[1, 2, 3, 4].map(index => (
        <Card key={index} variant='elevated' interactive>
          <CardHeader>
            <CardTitle>Card {index}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>그리드 레이아웃에서 사용되는 Card입니다.</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
}
