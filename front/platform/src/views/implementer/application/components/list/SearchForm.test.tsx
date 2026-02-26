import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import SearchForm from './SearchForm'

describe('SearchForm', () => {
  it('검색 폼이 렌더된다', () => {
    const onSearch = vi.fn()
    render(<SearchForm onSearch={onSearch} />)
    expect(screen.getByRole('form', { name: 'LTIS입력정보 검색' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('사건번호 혹은 사업명 입력')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '검색 실행' })).toBeInTheDocument()
  })

  it('검색 시 onSearch가 검색 조건과 함께 호출된다', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<SearchForm onSearch={onSearch} />)
    await user.type(screen.getByLabelText('검색어 입력'), '26수용')
    await user.click(screen.getByRole('button', { name: '검색 실행' }))
    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        keyword: '26수용',
        location: '',
        implementerName: '',
        progressStatuses: [],
      }),
    )
  })

  it('초기화 버튼이 있다', () => {
    const onSearch = vi.fn()
    render(<SearchForm onSearch={onSearch} />)
    expect(screen.getByRole('button', { name: '검색 조건 초기화' })).toBeInTheDocument()
  })
})
