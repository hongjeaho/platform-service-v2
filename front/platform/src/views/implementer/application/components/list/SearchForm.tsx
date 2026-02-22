import { subMonths } from 'date-fns'
import * as React from 'react'

import type { DateRange } from '@/common/components/ui'
import { Box, Button, Checkbox, DateRangePicker, Input } from '@/common/components/ui'
import { buttonVariants } from '@/constants/design/color'
import { icons, iconSizes } from '@/constants/design/icons'
import { borderRadius, padding } from '@/constants/design/spacing'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './SearchForm.module.css'

export interface SearchValues {
  keyword: string
  dateRange: DateRange
  location: string
  implementerName: string
  progressStatuses: number[]
}

interface SearchFormProps {
  onSearch: (values: SearchValues) => void
}

const PROGRESS_STATUS_OPTIONS = [
  { label: '입력정보확인', value: 1 },
  { label: '재결접수', value: 2 },
  { label: '열람공고', value: 3 },
  { label: '열람공고 반려', value: 7 },
  { label: '재결신청 의견제출', value: 4 },
  { label: '재결관검토', value: 5 },
  { label: '재결관검토 반려', value: 11 },
  { label: '심의', value: 6 },
] as const

const SearchIcon = icons.search

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [keyword, setKeyword] = React.useState('')
  const [dateRange, setDateRange] = React.useState<DateRange>({ startDate: null, endDate: null })
  const [location, setLocation] = React.useState('')
  const [implementerName, setImplementerName] = React.useState('')
  const [progressStatuses, setProgressStatuses] = React.useState<number[]>([])

  const handleQuickDate = (months: number) => {
    const endDate = new Date()
    const startDate = subMonths(endDate, months)
    setDateRange({ startDate, endDate })
  }

  const handleStatusToggle = (value: number, checked: boolean) => {
    setProgressStatuses(prev => (checked ? [...prev, value] : prev.filter(v => v !== value)))
  }

  const handleSearch = () => {
    onSearch({ keyword, dateRange, location, implementerName, progressStatuses })
  }

  const handleReset = () => {
    setKeyword('')
    setDateRange({ startDate: null, endDate: null })
    setLocation('')
    setImplementerName('')
    setProgressStatuses([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  const hasDateSelection = dateRange.startDate != null || dateRange.endDate != null

  return (
    <Box as="div" display="block" className={styles.wrapper}>
      <form
        className={styles.form}
        onSubmit={e => {
          e.preventDefault()
          handleSearch()
        }}
        aria-label='LTIS입력정보 검색'
      >
        {/* 키워드 검색 */}
        <Box align="center" gap="tight" wrap className={styles.fieldRow}>
          <span className={cn(styles.fieldLabel, textCombinations.label)}>검색</span>
          <Input
            value={keyword}
            onChange={setKeyword}
            placeholder='사건번호 혹은 사업명 입력'
            className={styles.keywordInput}
            onKeyDown={handleKeyDown}
            aria-label='검색어 입력'
          />
        </Box>

        {/* 접수일 */}
        <Box align="center" gap="tight" wrap className={styles.fieldRow}>
          <span className={cn(styles.fieldLabel, textCombinations.label)}>접수일</span>
          <Box
            as="div"
            className={cn(
              styles.dateRangeWrap,
              hasDateSelection && styles.dateRangeWrapFilled,
            )}
          >
            <Box align="center" gap="tight" wrap>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder='시작일 ~ 종료일'
              />
              <Box gap="tight">
                {[1, 3, 6].map(m => (
                  <button
                    key={m}
                    type='button'
                    className={cn(
                      buttonVariants.outline,
                      padding.buttonSm,
                      borderRadius.md,
                      textCombinations.buttonSm,
                      styles.quickDateBtn,
                    )}
                    onClick={() => handleQuickDate(m)}
                  >
                    {m}개월
                  </button>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* 소재지 / 시행자명 */}
        <Box align="center" gap="default" wrap className={cn(styles.fieldRow, styles.fieldRowDouble)}>
          <Box align="center" gap="tight" className={styles.fieldHalf}>
            <span className={cn(styles.fieldLabel, textCombinations.label)}>소재지</span>
            <Input
              value={location}
              onChange={setLocation}
              className={styles.halfInput}
              aria-label='소재지 입력'
            />
          </Box>
          <Box align="center" gap="tight" className={styles.fieldHalf}>
            <span className={cn(styles.fieldLabel, textCombinations.label)}>시행자명</span>
            <Input
              value={implementerName}
              onChange={setImplementerName}
              className={styles.halfInput}
              aria-label='시행자명 입력'
            />
          </Box>
        </Box>

        {/* 심의 진행현황 */}
        <Box align="center" gap="tight" wrap className={styles.fieldRow}>
          <span className={cn(styles.fieldLabel, textCombinations.label)}>심의 진행현황</span>
          <Box gap="tight" wrap>
            {PROGRESS_STATUS_OPTIONS.map(option => (
              <Checkbox
                key={option.value}
                label={option.label}
                checked={progressStatuses.includes(option.value)}
                onChange={checked => handleStatusToggle(option.value, checked)}
              />
            ))}
          </Box>
        </Box>

        {/* 검색 / 초기화 버튼 */}
        <Box justify="center" gap="tight" className={styles.buttonRow}>
          <Button
            type='submit'
            size='sm'
            variant='primary'
            className={cn(padding.buttonSm)}
            aria-label='검색 실행'
          >
            <SearchIcon className={iconSizes.sm} aria-hidden='true' />
            검색
          </Button>
          <Button
            type='button'
            size='sm'
            variant='outline'
            className={cn(
              buttonVariants.outline,
              padding.buttonSm,
              borderRadius.md,
              textCombinations.buttonSm,
            )}
            onClick={handleReset}
            aria-label='검색 조건 초기화'
          >
            초기화
          </Button>
        </Box>
      </form>
    </Box>
  )
}
