/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Checkbox } from './Checkbox'
import { FormCheckbox } from './index'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 기본 체크박스 (라벨 없음)
 */
export const Default: Story = {
  args: {
    checked: false,
  },
}

/**
 * 라벨이 있는 체크박스
 */
export const WithLabel: Story = {
  args: {
    label: '동의합니다',
    checked: false,
  },
}

/**
 * 라벨과 설명이 있는 체크박스
 */
export const WithDescription: Story = {
  args: {
    label: '마케팅 수신 동의',
    description: '프로모션과 특별 오퍼에 대한 이메일을 받으시겠습니까?',
    checked: false,
  },
}

/**
 * 체크된 상태
 */
export const Checked: Story = {
  args: {
    label: '동의합니다',
    checked: true,
  },
}

/**
 * 부분 선택 상태 (Indeterminate)
 */
export const Indeterminate: Story = {
  args: {
    label: '모두 선택',
    indeterminate: true,
  },
}

/**
 * 비활성화 상태 (체크되지 않음)
 */
export const DisabledUnchecked: Story = {
  args: {
    label: '비활성화된 체크박스',
    disabled: true,
    checked: false,
  },
}

/**
 * 비활성화 상태 (체크됨)
 */
export const DisabledChecked: Story = {
  args: {
    label: '비활성화된 체크박스',
    disabled: true,
    checked: true,
  },
}

/**
 * 에러 상태
 */
export const WithError: Story = {
  args: {
    label: '약관에 동의',
    error: '약관에 동의해야 합니다',
    checked: false,
  },
}

/**
 * 대화형 체크박스 (상태 관리)
 */
export const Interactive: Story = {
  render: args => {
    const [checked, setChecked] = useState(false)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox {...args} checked={checked} onChange={val => setChecked(val)} />
        <p>상태: {checked ? '체크됨' : '체크 안 됨'}</p>
      </div>
    )
  },
  args: {
    label: '동의합니다',
  },
}

/**
 * 체크박스 목록 (상태 관리)
 */
export const CheckboxList: Story = {
  render: () => {
    const [checked, setChecked] = useState<Record<string, boolean>>({
      item1: false,
      item2: false,
      item3: false,
    })

    const handleChange = (item: string, value: boolean) => {
      setChecked(prev => ({
        ...prev,
        [item]: value,
      }))
    }

    const allChecked = Object.values(checked).every(v => v)
    const someChecked = Object.values(checked).some(v => v)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox
          label='모두 선택'
          checked={allChecked}
          indeterminate={someChecked && !allChecked}
          onChange={value => {
            const newState = {
              item1: value,
              item2: value,
              item3: value,
            }
            setChecked(newState)
          }}
        />
        <div
          style={{ marginLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <Checkbox
            label='항목 1'
            checked={checked.item1}
            onChange={value => handleChange('item1', value)}
          />
          <Checkbox
            label='항목 2'
            checked={checked.item2}
            onChange={value => handleChange('item2', value)}
          />
          <Checkbox
            label='항목 3'
            checked={checked.item3}
            onChange={value => handleChange('item3', value)}
          />
        </div>
      </div>
    )
  },
}

/**
 * 설명이 있는 체크박스 목록
 */
export const CheckboxListWithDescription: Story = {
  render: () => {
    const [checked, setChecked] = useState<Record<string, boolean>>({
      notifications: false,
      marketing: false,
      analytics: false,
    })

    const handleChange = (item: string, value: boolean) => {
      setChecked(prev => ({
        ...prev,
        [item]: value,
      }))
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox
          label='알림'
          description='중요한 업데이트 및 공지사항'
          checked={checked.notifications}
          onChange={value => handleChange('notifications', value)}
        />
        <Checkbox
          label='마케팅'
          description='프로모션과 특별 오퍼'
          checked={checked.marketing}
          onChange={value => handleChange('marketing', value)}
        />
        <Checkbox
          label='분석'
          description='사용 통계 및 피드백'
          checked={checked.analytics}
          onChange={value => handleChange('analytics', value)}
        />
      </div>
    )
  },
}

// ===== FormCheckbox Stories =====

/**
 * FormCheckbox 기본 사용 예시
 */
export const FormCheckboxBasic: Story = {
  render: () => {
    const { control, handleSubmit, watch } = useForm<{
      agree: boolean
    }>()

    const onSubmit = (data: { agree: boolean }) => {
      console.log('Form submitted:', data)
    }

    const agree = watch('agree')

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FormCheckbox name='agree' control={control} label='약관에 동의합니다' />
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={!agree}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: agree ? '#3b82f6' : '#e5e7eb',
            color: agree ? 'white' : '#9ca3af',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: agree ? 'pointer' : 'not-allowed',
          }}
        >
          제출
        </button>
      </div>
    )
  },
}

/**
 * FormCheckbox 유효성 검증 예시
 */
export const FormCheckboxValidation: Story = {
  render: () => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<{
      terms: boolean
      privacy: boolean
    }>({
      mode: 'onChange',
    })

    const onSubmit = (data: { terms: boolean; privacy: boolean }) => {
      console.log('Form submitted:', data)
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FormCheckbox
          name='terms'
          control={control}
          rules={{ required: '이용약관에 동의해야 합니다' }}
          label='이용약관 동의'
        />
        <FormCheckbox
          name='privacy'
          control={control}
          rules={{ required: '개인정보 처리방침에 동의해야 합니다' }}
          label='개인정보 수집 동의'
          description='마케팅, 프로모션 정보 수집에 동의합니다'
        />
        <button
          onClick={handleSubmit(onSubmit)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}
        >
          제출
        </button>
        <div style={{ fontSize: '0.875rem', color: '#ef4444' }}>
          {errors.terms && <p>• {errors.terms.message}</p>}
          {errors.privacy && <p>• {errors.privacy.message}</p>}
        </div>
      </div>
    )
  },
}

/**
 * FormCheckbox 초기값 설정 예시
 */
export const FormCheckboxInitialValues: Story = {
  render: () => {
    const { control, watch } = useForm<{
      newsletter: boolean
      marketing: boolean
    }>({
      defaultValues: {
        newsletter: true,
        marketing: false,
      },
    })

    const values = watch()

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FormCheckbox
          name='newsletter'
          control={control}
          label='뉴스레터 구독'
          description='중요 업데이트 및 공지사항'
        />
        <FormCheckbox
          name='marketing'
          control={control}
          label='마케팅 정보 수신'
          description='프로모션과 특별 오퍼'
        />
        <div
          style={{
            fontSize: '0.875rem',
            color: '#666',
            backgroundColor: '#f9fafb',
            padding: '0.5rem',
            borderRadius: '0.25rem',
          }}
        >
          현재 상태: 뉴스레터: {values.newsletter ? '구독함' : '구독안함'}, 마케팅:{' '}
          {values.marketing ? '수신함' : '수신안함'}
        </div>
      </div>
    )
  },
}

/**
 * 실용적인 시나리오: 회원가입 폼
 */
export const SignupFormExample: Story = {
  render: () => {
    const {
      control,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<{
      terms: boolean
      privacy: boolean
      marketing: boolean
      ageConfirm: boolean
    }>({
      mode: 'onChange',
    })

    const onSubmit = (data: any) => {
      console.log('회원가입 폼 제출:', data)
    }

    const values = watch()

    const allRequired = values.terms && values.privacy && values.ageConfirm
    const anyOptional = values.marketing

    return (
      <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600' }}>회원가입</h2>

        <FormCheckbox
          name='ageConfirm'
          control={control}
          rules={{ required: '만 14세 이상만 가입 가능합니다' }}
          label='만 14세 이상입니다'
        />

        <FormCheckbox
          name='terms'
          control={control}
          rules={{ required: '이용약관에 동의해야 합니다' }}
          label='이용약관 동의'
        />

        <FormCheckbox
          name='privacy'
          control={control}
          rules={{ required: '개인정보 처리방침에 동의해야 합니다' }}
          label='개인정보 수집 및 이용 동의'
          description='서비스 제공을 위한 최소한의 개인정보 수집에 동의합니다'
        />

        <FormCheckbox
          name='marketing'
          control={control}
          label='마케팅 정보 수신 동의 (선택)'
          description='할인, 프로모션, 이벤트 정보를 이메일로 받아보세요'
        />

        <div style={{ fontSize: '0.875rem', color: '#ef4444' }}>
          {errors.ageConfirm && <p>• {errors.ageConfirm.message}</p>}
          {errors.terms && <p>• {errors.terms.message}</p>}
          {errors.privacy && <p>• {errors.privacy.message}</p>}
        </div>

        <button
          onClick={handleSubmit(onSubmit)}
          disabled={!allRequired}
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: allRequired ? '#10b981' : '#e5e7eb',
            color: allRequired ? 'white' : '#9ca3af',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: allRequired ? 'pointer' : 'not-allowed',
            fontSize: '1rem',
            fontWeight: '500',
          }}
        >
          가입하기
        </button>

        <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
          필수항목: {allRequired ? '✅ 모두 동의함' : '❌ 일부 미동의'} | 선택항목:{' '}
          {anyOptional ? '✅ 마케팅 동의함' : '❌ 마케팅 미동의'}
        </div>
      </div>
    )
  },
}
