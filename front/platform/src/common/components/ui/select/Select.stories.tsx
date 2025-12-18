import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../button/Button'
import { FormSelect } from './FormSelect'
import { Select } from './Select'

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const options = [
  { label: '선택 옵션 1', value: '1' },
  { label: '선택 옵션 2', value: '2' },
  { label: '선택 옵션 3', value: '3' },
  { label: '선택 옵션 4', value: '4' },
]

const longOptions = [
  { label: '서울특별시', value: 'seoul' },
  { label: '부산광역시', value: 'busan' },
  { label: '대구광역시', value: 'daegu' },
  { label: '인천광역시', value: 'incheon' },
  { label: '광주광역시', value: 'gwangju' },
  { label: '대전광역시', value: 'daejeon' },
  { label: '울산광역시', value: 'ulsan' },
  { label: '세종특별자치시', value: 'sejong' },
  { label: '경기도', value: 'gyeonggi' },
  { label: '강원도', value: 'gangwon' },
  { label: '충청북도', value: 'chungbuk' },
  { label: '충청남도', value: 'chungnam' },
  { label: '전라북도', value: 'jeonbuk' },
  { label: '전라남도', value: 'jeonnam' },
  { label: '경상북도', value: 'gyeongbuk' },
  { label: '경상남도', value: 'gyeongnam' },
  { label: '제주특별자치도', value: 'jeju' },
]

/**
 * 기본 Select 컴포넌트
 */
export const Basic: Story = {
  render: args => {
    const [value, setValue] = useState<string>()

    return (
      <div style={{ width: '300px' }}>
        <Select {...args} value={value} onChange={setValue} />
      </div>
    )
  },
  args: {
    options,
    placeholder: '선택해주세요',
    label: '선택 항목',
    name: 'select-basic',
  },
}

/**
 * 검색 가능한 Select
 */
export const Searchable: Story = {
  render: args => {
    const [value, setValue] = useState<string>()

    return (
      <div style={{ width: '300px' }}>
        <Select {...args} value={value} onChange={setValue} />
      </div>
    )
  },
  args: {
    options: longOptions,
    placeholder: '지역을 선택해주세요',
    label: '지역 선택',
    name: 'select-searchable',
    searchable: true,
    searchPlaceholder: '지역명을 입력하세요',
  },
}

/**
 * 라벨이 없는 Select
 */
export const WithoutLabel: Story = {
  render: args => {
    const [value, setValue] = useState<string>()

    return (
      <div style={{ width: '300px' }}>
        <Select {...args} value={value} onChange={setValue} />
      </div>
    )
  },
  args: {
    options,
    placeholder: '선택해주세요',
    name: 'select-no-label',
  },
}

/**
 * 필수 필드 표시
 */
export const Required: Story = {
  render: args => {
    const [value, setValue] = useState<string>()

    return (
      <div style={{ width: '300px' }}>
        <Select {...args} value={value} onChange={setValue} />
      </div>
    )
  },
  args: {
    options,
    label: '필수 항목',
    required: true,
    placeholder: '선택해주세요',
    name: 'select-required',
  },
}

/**
 * 에러 상태
 */
export const WithError: Story = {
  render: args => {
    const [value, setValue] = useState<string>()

    return (
      <div style={{ width: '300px' }}>
        <Select {...args} value={value} onChange={setValue} />
      </div>
    )
  },
  args: {
    options,
    label: '선택 항목',
    error: '이 필드는 필수입니다',
    placeholder: '선택해주세요',
    name: 'select-error',
  },
}

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
  render: args => {
    const [value, setValue] = useState<string>()

    return (
      <div style={{ width: '300px' }}>
        <Select {...args} value={value} onChange={setValue} />
      </div>
    )
  },
  args: {
    options,
    label: '비활성화된 Select',
    disabled: true,
    placeholder: '선택해주세요',
    name: 'select-disabled',
  },
}

/**
 * 비활성화된 옵션이 있는 Select
 */
export const WithDisabledOptions: Story = {
  render: args => {
    const [value, setValue] = useState<string>()

    return (
      <div style={{ width: '300px' }}>
        <Select {...args} value={value} onChange={setValue} />
      </div>
    )
  },
  args: {
    options: [
      { label: '활성화된 옵션 1', value: '1' },
      { label: '비활성화된 옵션 2', value: '2', disabled: true },
      { label: '활성화된 옵션 3', value: '3' },
      { label: '비활성화된 옵션 4', value: '4', disabled: true },
    ],
    label: '선택 항목',
    placeholder: '선택해주세요',
    name: 'select-disabled-options',
  },
}

/**
 * 긴 옵션 리스트 (스크롤 테스트)
 */
export const LongList: Story = {
  render: args => {
    const [value, setValue] = useState<string>()

    return (
      <div style={{ width: '300px' }}>
        <Select {...args} value={value} onChange={setValue} />
      </div>
    )
  },
  args: {
    options: longOptions,
    label: '지역 선택',
    placeholder: '지역을 선택해주세요',
    name: 'select-long-list',
    maxHeight: '200px',
  },
}

/**
 * 검색 가능한 긴 리스트
 */
export const SearchableLongList: Story = {
  render: args => {
    const [value, setValue] = useState<string>()

    return (
      <div style={{ width: '300px' }}>
        <Select {...args} value={value} onChange={setValue} />
      </div>
    )
  },
  args: {
    options: longOptions,
    label: '지역 선택',
    placeholder: '지역을 선택해주세요',
    name: 'select-searchable-long',
    searchable: true,
    searchPlaceholder: '지역명 검색...',
    maxHeight: '250px',
  },
}

/**
 * 검색 결과 없음 상태 테스트
 */
export const EmptySearchResult: Story = {
  render: args => {
    const [value, setValue] = useState<string>()

    return (
      <div style={{ width: '300px' }}>
        <Select {...args} value={value} onChange={setValue} />
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
          힌트: 'xyz'를 검색해보세요
        </p>
      </div>
    )
  },
  args: {
    options,
    label: '선택 항목',
    placeholder: '선택해주세요',
    name: 'select-empty-search',
    searchable: true,
    searchPlaceholder: '검색...',
    emptyMessage: '검색 결과가 없습니다',
  },
}

/**
 * 숫자 값을 가진 Select
 */
export const WithNumberValues: Story = {
  render: () => {
    const [value, setValue] = useState<string>()

    return (
      <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Select
          value={value}
          onChange={setValue}
          options={[
            { label: '10개', value: '10' },
            { label: '20개', value: '20' },
            { label: '50개', value: '50' },
            { label: '100개', value: '100' },
          ]}
          label='페이지당 항목 수'
          placeholder='선택해주세요'
          name='select-number'
        />
        {value && <p style={{ fontSize: '0.875rem' }}>선택된 값: {value}</p>}
      </div>
    )
  },
  args: {
    options: [],
  },
}

/**
 * React Hook Form 통합 예제 (FormSelect 사용 - 권장)
 */
export const ReactHookFormIntegration: Story = {
  render: () => {
    interface FormData {
      region: string
      category: string
      priority: string
    }

    const { control, handleSubmit, watch } = useForm<FormData>({
      defaultValues: {
        region: '',
        category: '',
        priority: '',
      },
    })

    const formValues = watch()

    const onSubmit = (data: FormData) => {
      alert(`폼 제출 성공!\n${JSON.stringify(data, null, 2)}`)
    }

    return (
      <div style={{ width: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <FormSelect
            name='region'
            control={control}
            options={longOptions}
            label='지역'
            placeholder='지역을 선택해주세요'
            required
            searchable
            searchPlaceholder='지역명 검색...'
            rules={{ required: '지역을 선택해주세요' }}
          />

          <FormSelect
            name='category'
            control={control}
            options={options}
            label='카테고리'
            placeholder='카테고리를 선택해주세요'
            required
            rules={{ required: '카테고리를 선택해주세요' }}
          />

          <FormSelect
            name='priority'
            control={control}
            options={[
              { label: '낮음', value: 'low' },
              { label: '보통', value: 'medium' },
              { label: '높음', value: 'high' },
            ]}
            label='우선순위'
            placeholder='우선순위를 선택해주세요'
            required
            rules={{ required: '우선순위를 선택해주세요' }}
          />

          <Button type='submit' variant='primary' size='lg'>
            제출
          </Button>
        </form>

        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f5f5f5',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            현재 폼 값:
          </div>
          <pre style={{ fontSize: '0.75rem', margin: 0 }}>
            {JSON.stringify(formValues, null, 2)}
          </pre>
        </div>

        <div
          style={{
            padding: '1rem',
            backgroundColor: '#d1f4e0',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
          }}
        >
          <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
            ✅ 권장: FormSelect 사용법 (간결함)
          </div>
          <pre
            style={{
              backgroundColor: 'white',
              padding: '0.5rem',
              borderRadius: '4px',
              margin: 0,
              overflow: 'auto',
            }}
          >
            {`<FormSelect
  name="fieldName"
  control={control}
  options={options}
  rules={{ required: '필수' }}
/>`}
          </pre>
        </div>
      </div>
    )
  },
  args: {
    options: [],
  },
}
