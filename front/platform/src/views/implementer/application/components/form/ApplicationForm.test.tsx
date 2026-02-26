import { APPLICATION_FORM_DEFAULT_VALUES } from '@components/implementer/application/defaultValues'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import { ApplicationForm } from './ApplicationForm'

function renderForm(
  mode: 'write' | 'edit' = 'write',
  defaultValues?: typeof APPLICATION_FORM_DEFAULT_VALUES,
) {
  return render(
    <MemoryRouter>
      <ApplicationForm mode={mode} defaultValues={defaultValues} />
    </MemoryRouter>,
  )
}

describe('ApplicationForm', () => {
  it('폼이 렌더된다', () => {
    renderForm()
    expect(screen.getByText('사업 정보')).toBeInTheDocument()
    expect(document.querySelector('form')).toBeInTheDocument()
  })

  it('사업 정보 섹션이 있다', () => {
    renderForm()
    expect(screen.getByText('사업 정보')).toBeInTheDocument()
  })

  it('협의 내역 섹션이 있다', () => {
    renderForm()
    expect(screen.getByText('협의 내역')).toBeInTheDocument()
  })

  it('재결신청사유 섹션이 있다', () => {
    renderForm()
    expect(screen.getByRole('heading', { name: /재결신청사유/ })).toBeInTheDocument()
  })

  it('제출 버튼이 있다', () => {
    renderForm()
    expect(screen.getByRole('button', { name: /재결신청 제출/ })).toBeInTheDocument()
  })

  it('취소 버튼이 있다', () => {
    renderForm()
    expect(screen.getByRole('button', { name: /취소/ })).toBeInTheDocument()
  })

  it('필수값 없이 제출 시 검증 메시지를 보여준다', async () => {
    const user = userEvent.setup()
    renderForm()
    const submitButton = screen.getByRole('button', { name: /재결신청 제출/ })
    await user.click(submitButton)
    const validationMessages = screen.getAllByText(/입력해주세요/)
    expect(validationMessages.length).toBeGreaterThan(0)
  })

  it(
    '필수값 입력 후 제출 시 onSubmit이 호출된다',
    async () => {
      const user = userEvent.setup()
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const defaultValues = {
        ...APPLICATION_FORM_DEFAULT_VALUES,
        evaluation: {
          ...APPLICATION_FORM_DEFAULT_VALUES.evaluation,
          selectedCheck: true,
        },
      }
      renderForm('write', defaultValues)
      const scaleInput = screen.getByPlaceholderText(/예\) 1.234㎡/)
      const periodInput = screen.getByPlaceholderText(/예\) 2014/)
      const agreementContentInput = screen.getByPlaceholderText(/손실보상협의요청 제1차/)
      const decisionReasonInput = screen.getByLabelText(/재결신청사유/)
      const businessRecognitionInput = screen.getByLabelText(/사업시행인가고시일/)

      await user.type(scaleInput, '100')
      await user.type(periodInput, '2020.1.1 ~ 2023.1.1')

      const datePickerButton = screen.getByRole('button', { name: '날짜 선택' })
      await user.click(datePickerButton)
      await waitFor(() => {
        expect(screen.getByRole('button', { name: '이전 달' })).toBeInTheDocument()
      })
      const maxClicks = 48
      let dateCell = screen.queryByRole('button', { name: /2023년 10월 23일/ })
      for (let i = 0; i < maxClicks && !dateCell; i++) {
        const prevMonthButton = screen.getByRole('button', { name: '이전 달' })
        await user.click(prevMonthButton)
        dateCell = screen.queryByRole('button', { name: /2023년 10월 23일/ })
      }
      expect(dateCell).toBeTruthy()
      await user.click(dateCell!)

      await user.type(agreementContentInput, '손실보상협의요청 제1차')
      await user.type(decisionReasonInput, '보상금 조정 요청')
      await user.type(businessRecognitionInput, '서울특별시 중구 고시 제 2018-2000호(2018. 12. 25.)')

      const submitButton = screen.getByRole('button', { name: /재결신청 제출/ })
      await user.click(submitButton)

      await waitFor(() => {
        expect(logSpy).toHaveBeenCalledWith(
          'ApplicationForm submit:',
          expect.objectContaining({
            business: expect.objectContaining({
              scale: '100',
              businessPeriod: '2020.1.1 ~ 2023.1.1',
            }),
          }),
        )
      })
      logSpy.mockRestore()
    },
    15000,
  )

  it('edit 모드일 때 수정 완료 버튼이 노출된다', () => {
    renderForm('edit')
    expect(screen.getByRole('button', { name: /수정 완료/ })).toBeInTheDocument()
  })
})
