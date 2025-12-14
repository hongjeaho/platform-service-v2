/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { RadioGroup } from './RadioGroup'
import { FormRadioGroup } from './FormRadioGroup'

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

const options = [
  { label: '옵션 1', value: '1' },
  { label: '옵션 2', value: '2' },
  { label: '옵션 3', value: '3' },
]

const optionsWithDescription = [
  { label: '옵션 1', value: '1', description: '첫 번째 옵션의 설명' },
  { label: '옵션 2', value: '2', description: '두 번째 옵션의 설명' },
  { label: '옵션 3', value: '3', description: '세 번째 옵션의 설명' },
]

/**
 * 기본 RadioGroup (수직 레이아웃)
 */
export const Default: Story = {
  args: {
    options,
    label: '라디오 그룹',
    name: 'radio-default',
  },
}

/**
 * 수평 레이아웃
 */
export const Horizontal: Story = {
  args: {
    options,
    label: '라디오 그룹',
    orientation: 'horizontal',
    name: 'radio-horizontal',
  },
}

/**
 * 설명이 있는 옵션
 */
export const WithDescription: Story = {
  args: {
    options: optionsWithDescription,
    label: '라디오 그룹',
    name: 'radio-description',
  },
}

/**
 * 값이 선택된 상태
 */
export const WithValue: Story = {
  args: {
    options,
    value: '2',
    label: '라디오 그룹',
    name: 'radio-value',
  },
}

/**
 * 비활성화된 옵션이 있는 경우
 */
export const WithDisabledOption: Story = {
  args: {
    options: [
      { label: '활성화된 옵션 1', value: '1' },
      { label: '비활성화된 옵션 2', value: '2', disabled: true },
      { label: '활성화된 옵션 3', value: '3' },
    ],
    label: '라디오 그룹',
    name: 'radio-disabled-option',
  },
}

/**
 * 전체 비활성화 상태
 */
export const Disabled: Story = {
  args: {
    options,
    label: '라디오 그룹',
    disabled: true,
    name: 'radio-disabled',
  },
}

/**
 * 에러 상태
 */
export const WithError: Story = {
  args: {
    options,
    label: '라디오 그룹',
    error: '이 필드는 필수입니다',
    name: 'radio-error',
  },
}

/**
 * 라벨이 없는 경우
 */
export const WithoutLabel: Story = {
  args: {
    options,
    name: 'radio-no-label',
  },
}

/**
 * 대화형 RadioGroup (상태 관리)
 */
export const Interactive: Story = {
  render: args => {
    const [value, setValue] = useState<string>('')

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <RadioGroup {...args} value={value} onChange={val => setValue(val)} />
        {value && <p>선택된 값: {value}</p>}
      </div>
    )
  },
  args: {
    options,
    label: '라디오 그룹',
    name: 'radio-interactive',
  },
}

/**
 * 대화형 RadioGroup (설명 포함)
 */
export const InteractiveWithDescription: Story = {
  render: args => {
    const [value, setValue] = useState<string>('')

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <RadioGroup {...args} value={value} onChange={val => setValue(val)} />
        {value && <p>선택된 값: {value}</p>}
      </div>
    )
  },
  args: {
    options: optionsWithDescription,
    label: '라디오 그룹',
    name: 'radio-interactive-desc',
  },
}

/**
 * 숫자 값을 가진 RadioGroup
 */
export const WithNumberValues: Story = {
  render: args => {
    const [value, setValue] = useState<number>()

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <RadioGroup
          {...args}
          value={value}
          onChange={val => setValue(val)}
          options={[
            { label: '10개', value: 10 as any },
            { label: '20개', value: 20 as any },
            { label: '50개', value: 50 as any },
          ]}
        />
        {value && <p>선택된 값: {value}</p>}
      </div>
    )
  },
  args: {
    label: '페이지당 항목 수',
    name: 'radio-number',
  },
}

// ===== FormRadioGroup Stories =====

/**
 * FormRadioGroup 기본 사용 예시
 */
export const FormRadioGroupBasic: Story = {
  render: () => {
    const { control, handleSubmit, watch } = useForm<{
      gender: string
    }>({
      defaultValues: {
        gender: '',
      },
    })

    const onSubmit = (data: { gender: string }) => {
      alert(`선택된 성별: ${data.gender}`)
    }

    const gender = watch('gender')

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <FormRadioGroup
          name='gender'
          control={control}
          label='성별'
          options={[
            { label: '남성', value: 'male' },
            { label: '여성', value: 'female' },
          ]}
        />
        <button
          type='submit'
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}
        >
          제출
        </button>
        {gender && <p style={{ fontSize: '0.875rem', color: '#666' }}>선택된 값: {gender}</p>}
      </form>
    )
  },
}

/**
 * FormRadioGroup 유효성 검증 예시
 */
export const FormRadioGroupValidation: Story = {
  render: () => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<{
      gender: string
      ageGroup: string
    }>({
      defaultValues: {
        gender: '',
        ageGroup: '',
      },
      mode: 'onChange',
    })

    const onSubmit = (data: { gender: string; ageGroup: string }) => {
      alert(`성별: ${data.gender}, 연령대: ${data.ageGroup}`)
    }

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <FormRadioGroup
          name='gender'
          control={control}
          label='성별'
          required
          rules={{ required: '성별을 선택해주세요' }}
          options={[
            { label: '남성', value: 'male' },
            { label: '여성', value: 'female' },
          ]}
        />
        <FormRadioGroup
          name='ageGroup'
          control={control}
          label='연령대'
          required
          rules={{ required: '연령대를 선택해주세요' }}
          options={[
            { label: '20대', value: '20s' },
            { label: '30대', value: '30s' },
            { label: '40대', value: '40s' },
            { label: '50대 이상', value: '50plus' },
          ]}
        />
        <button
          type='submit'
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}
        >
          제출
        </button>
        <div style={{ fontSize: '0.875rem', color: '#ef4444' }}>
          {errors.gender && <p>• {errors.gender.message}</p>}
          {errors.ageGroup && <p>• {errors.ageGroup.message}</p>}
        </div>
      </form>
    )
  },
}

/**
 * FormRadioGroup 수평 레이아웃 예시
 */
export const FormRadioGroupHorizontal: Story = {
  render: () => {
    const { control, watch } = useForm<{
      priority: string
    }>({
      defaultValues: {
        priority: '',
      },
    })

    const priority = watch('priority')

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FormRadioGroup
          name='priority'
          control={control}
          label='우선순위'
          orientation='horizontal'
          options={[
            { label: '낮음', value: 'low' },
            { label: '보통', value: 'medium' },
            { label: '높음', value: 'high' },
          ]}
        />
        {priority && (
          <p style={{ fontSize: '0.875rem', color: '#666' }}>선택된 우선순위: {priority}</p>
        )}
      </div>
    )
  },
}

/**
 * FormRadioGroup 숫자 값 예시
 */
export const FormRadioGroupNumberValues: Story = {
  render: () => {
    const { control, watch } = useForm<{
      pageSize: number
    }>({
      defaultValues: {
        pageSize: 10,
      },
    })

    const pageSize = watch('pageSize')

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FormRadioGroup<{ pageSize: number }, number>
          name='pageSize'
          control={control}
          label='페이지당 항목 수'
          options={[
            { label: '10개', value: 10 },
            { label: '20개', value: 20 },
            { label: '50개', value: 50 },
          ]}
        />
        {pageSize && (
          <p style={{ fontSize: '0.875rem', color: '#666' }}>선택된 페이지 크기: {pageSize}개</p>
        )}
      </div>
    )
  },
}
