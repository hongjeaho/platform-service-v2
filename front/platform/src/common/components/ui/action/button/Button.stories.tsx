import type { Meta, StoryObj } from '@storybook/react'

import { Button } from './Button'

const meta = {
  title: 'UI/Action/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Click me',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Primary 버튼 - 주요 작업에 사용
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Primary Button',
  },
}

/**
 * Secondary 버튼 - 부가 작업에 사용
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
    children: 'Secondary Button',
  },
}

/**
 * Outline 버튼 - 테두리만 있는 버튼
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'md',
    children: 'Outline Button',
  },
}

/**
 * Ghost 버튼 - 배경 없는 투명한 버튼
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
    children: 'Ghost Button',
  },
}

/**
 * Destructive 버튼 - 삭제, 취소 같은 위험한 작업
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    size: 'md',
    children: 'Delete',
  },
}

/**
 * Link 버튼 - 링크처럼 보이는 버튼
 */
export const Link: Story = {
  args: {
    variant: 'link',
    size: 'md',
    children: 'Link Button',
  },
}

/**
 * Small 크기 버튼
 */
export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Small Button',
  },
}

/**
 * Medium 크기 버튼
 */
export const Medium: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Medium Button',
  },
}

/**
 * Large 크기 버튼
 */
export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Large Button',
  },
}

/**
 * Disabled 상태 버튼
 */
export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: true,
    children: 'Disabled Button',
  },
}

/**
 * Loading 상태 버튼
 */
export const Loading: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    isLoading: true,
    children: 'Loading...',
  },
}

/**
 * 모든 버튼 크기 비교
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
      <Button size='sm' variant='primary'>
        Small
      </Button>
      <Button size='md' variant='primary'>
        Medium
      </Button>
      <Button size='lg' variant='primary'>
        Large
      </Button>
    </div>
  ),
}

/**
 * 모든 버튼 variant 비교
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant='primary'>Primary</Button>
      <Button variant='secondary'>Secondary</Button>
      <Button variant='outline'>Outline</Button>
      <Button variant='ghost'>Ghost</Button>
      <Button variant='destructive'>Destructive</Button>
      <Button variant='link'>Link</Button>
    </div>
  ),
}

/**
 * 대화형 버튼 예제
 */
export const Interactive: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Click me!',
    onClick: () => alert('Button clicked!'),
  },
}

/**
 * V3 디자인 시스템 패턴 - 폼 하단 액션 바
 */
export const V3ActionBar: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem',
        borderTop: '1px solid var(--color-gray-200)',
      }}
    >
      <Button variant='outline' size='md'>
        목록
      </Button>
      <Button variant='outline' size='md'>
        임시저장
      </Button>
      <Button variant='primary' size='md'>
        제출
      </Button>
    </div>
  ),
}

/**
 * 폼 제출 버튼 - 문서 저장, 제출 기능
 */
export const FormSubmission: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: '신청서 제출',
    onClick: () => alert('신청서가 제출되었습니다.'),
  },
}

/**
 * 문서 관리 버튼 - 저장, 임시 저장, 삭제
 */
export const DocumentActions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
      <Button variant='primary' size='md' style={{ marginRight: '0.5rem' }}>
        저장
      </Button>
      <Button variant='secondary' size='md' style={{ marginRight: '0.5rem' }}>
        임시 저장
      </Button>
      <Button variant='outline' size='md'>
        문서 미리보기
      </Button>
      <Button variant='destructive' size='md'>
        삭제
      </Button>
    </div>
  ),
}

/**
 * 마법사 내비게이션 버튼 - 이전, 다음, 완료
 */
export const WizardNavigation: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button variant='outline' size='md'>
        ← 이전
      </Button>
      <span style={{ margin: '0 0.5rem', fontWeight: '500' }}>2 / 3</span>
      <Button variant='primary' size='md' style={{ marginLeft: '0.5rem' }}>
        다음 →
      </Button>
      <Button variant='secondary' size='md'>
        완료
      </Button>
    </div>
  ),
}

/**
 * 로딩 상태 버튼 - 다양한 로딩 표시
 */
export const LoadingStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h4>로딩 상태 버튼</h4>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button variant='primary' isLoading>
          기본 로딩
        </Button>
        <Button variant='secondary' isLoading size='sm'>
          작은 로딩
        </Button>
        <Button variant='outline' isLoading>
          테두리 로딩
        </Button>
      </div>

      <h4>비활성화된 로딩 버튼</h4>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Button variant='primary' disabled>
          <span style={{ marginRight: '0.5rem' }}>⏳</span>
          처리 중...
        </Button>
      </div>
    </div>
  ),
}

/**
 * 반응형 예제 - 다양한 화면 크기에서의 버튼
 */
export const ResponsiveExamples: Story = {
  render: () => (
    <div style={{ width: '100%' }}>
      <h4>모바일 (360px)</h4>
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '1rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          maxWidth: '360px',
        }}
      >
        <Button variant='primary' size='sm' style={{ flex: 1 }}>
          모바일 버튼
        </Button>
      </div>

      <h4>태블릿 (768px)</h4>
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '1rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.5rem',
          maxWidth: '768px',
        }}
      >
        <Button variant='primary' size='md' style={{ flex: 1 }}>
          태블릿 버튼
        </Button>
        <Button variant='secondary' size='md' style={{ flex: 1 }}>
          태블릿 버튼
        </Button>
      </div>

      <h4>데스크톱 (1024px)</h4>
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '1rem',
          border: '1px solid #2563eb',
          borderRadius: '0.5rem',
          maxWidth: '1024px',
        }}
      >
        <Button variant='primary' size='lg' style={{ flex: 1 }}>
          데스크톱 버튼
        </Button>
        <Button variant='secondary' size='lg' style={{ flex: 1 }}>
          데스크톱 버튼
        </Button>
      </div>
    </div>
  ),
}

/**
 * KWCAG 접근성 상세 준수 - 실제 정부 플랫폼 요구사항 반영
 */
export const AccessibilityComprehensive: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: '토지보상 심의 신청서',
    'aria-label': '토지보상 심의 신청서 작성 페이지로 이동',
    'aria-describedby': 'button-help-text',
    disabled: false,
  },
  render: args => (
    <div style={{ padding: '1rem', maxWidth: '400px' }}>
      <p
        id='button-help-text'
        style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          marginBottom: '0.5rem',
        }}
      >
        이 버튼을 클릭하면 토지보상 심의 신청서 작성 페이지로 이동합니다. 키보드 사용자는 Tab 키로
        버튼에 접근할 수 있습니다.
      </p>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button {...args} />
        <Button variant='outline' size='sm'>
          자세히 보기
        </Button>
      </div>
    </div>
  ),
}
