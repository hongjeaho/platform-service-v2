/**
 * EvaluationCorporationInput 서브 컴포넌트
 * Phase 2.1: 컴포넌트 분할 (성능 최적화 및 유지보수성 향상)
 */
import { memo } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormInput,
  FormRadioGroup,
  FormTextarea,
  FormUploadMulti,
  Input,
} from '@/common/components/ui'
import { icons, iconSizes, textCombinations } from '@/constants/design'
import { cn } from '@/lib/utils'

import type { ApplicationFormData } from '../types'
import styles from './EvaluationCorporationInput.module.css'

const HelpIcon = icons.info

const GOVERNOR_TOOLTIP =
  '시도지사(서울특별시장)에게 감정평가법인 추천요청 하였는지 체크합니다.(토지보상법상 의무사항, 법 제15조 법시행령 제28조)'

// ----- Governor Request Card -----
interface GovernorRequestCardProps {
  showNotRequestedReasonSection: boolean
}

export const GovernorRequestCard = memo(function GovernorRequestCard({
  showNotRequestedReasonSection,
}: GovernorRequestCardProps) {
  const { control } = useFormContext<ApplicationFormData>()

  return (
    <Card>
      <CardHeader>
        <div className={styles.headerRow}>
          <CardTitle>시도지사 추천 요청</CardTitle>
          <button
            type='button'
            className={styles.helpButton}
            aria-label='도움말'
            title={GOVERNOR_TOOLTIP}
          >
            <HelpIcon className={cn(iconSizes.md)} aria-hidden />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className={styles.infoBox}>
          <p className={styles.infoBoxText}>
            「공사업을 위한 토지등의 취득 및 보상에 관한 법률」 제15조 및 같은 법시행령 제28조에
            따라 보상계획 공고시 토지소유자 · 시도지사의 감정평가업자 추천내용을 기입하여
            공고하였습니까?
          </p>
        </div>

        <FormRadioGroup<ApplicationFormData, boolean>
          name='evaluation.selectedCheck'
          control={control}
          label='시도지사 추천요청 여부'
          required
          orientation='horizontal'
          options={[
            { label: '네', value: true },
            { label: '아니오', value: false },
          ]}
          rules={{ required: '시도지사 추천요청 여부를 선택해주세요.' }}
        />

        {showNotRequestedReasonSection && (
          <div className={styles.mtSection}>
            <FormTextarea
              name='evaluation.notReqReason'
              control={control}
              label='시도지사 추천요청을 하지 않은 이유'
              placeholder='추천요청을 하지 않은 구체적인 사유를 입력해주세요.'
              maxLength={200}
              rows={3}
              required
              rules={{ required: '사유를 입력해주세요.' }}
            />
            <p className={styles.warningText} role='alert'>
              &quot;아니오&quot;의 경우 법령상 절차하자로 인하여 협의절차가 무효 또는 취소될 수
              있습니다. 다시 확인바랍니다.
            </p>
          </div>
        )}

        <div className={styles.mtSection}>
          <FormUploadMulti<ApplicationFormData>
            name='evaluation.announcementFiles'
            control={control}
            label='공고문 첨부 파일'
            displayMode='list'
          />
        </div>
      </CardContent>
    </Card>
  )
})

// ----- Evaluation Corporation Card -----
interface EvaluationCorporationCardProps {
  hasGovernorRecommendation: boolean
}

export const EvaluationCorporationCard = memo(function EvaluationCorporationCard({
  hasGovernorRecommendation,
}: EvaluationCorporationCardProps) {
  const { control } = useFormContext<ApplicationFormData>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>감정평가법인 및 협의 감정평가액</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>사업시행자 추천</th>
                {hasGovernorRecommendation && <th className={styles.th}>시도지사 추천</th>}
                <th className={styles.th}>토지소유자 추천</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.td}>
                  <FormInput<ApplicationFormData>
                    name='evaluation.corporations.businessOperator'
                    control={control}
                    className={styles.rowInput}
                    placeholder='예) 00감정평가법인'
                    maxLength={25}
                    aria-label='사업시행자 추천 감정평가법인'
                  />
                </td>
                {hasGovernorRecommendation && (
                  <td className={styles.td}>
                    <FormInput<ApplicationFormData>
                      name='evaluation.corporations.governor'
                      control={control}
                      className={styles.rowInput}
                      placeholder='예) 00감정평가법인'
                      maxLength={25}
                      aria-label='시도지사 추천 감정평가법인'
                    />
                  </td>
                )}
                <td className={styles.td}>
                  <FormInput<ApplicationFormData>
                    name='evaluation.corporations.landowner'
                    control={control}
                    className={styles.rowInput}
                    placeholder='예) 00감정평가법인'
                    maxLength={25}
                    aria-label='토지소유자 추천 감정평가법인'
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
})

// ----- Evaluation Amounts Card -----
interface EvaluationAmountsCardProps {
  hasGovernorRecommendation: boolean
  averageAmount: number
}

export const EvaluationAmountsCard = memo(function EvaluationAmountsCard({
  hasGovernorRecommendation,
  averageAmount,
}: EvaluationAmountsCardProps) {
  const { control } = useFormContext<ApplicationFormData>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>협의 감정평가액</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn(styles.caption, textCombinations.bodySm, 'text-muted-foreground')}>
          협의 감정평가액 (단위: 원)
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>사업시행자 추천</th>
                {hasGovernorRecommendation && <th className={styles.th}>시도지사 추천</th>}
                <th className={styles.th}>토지소유자 추천</th>
                <th className={cn(styles.th, styles.thHighlight)}>합계 평균</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.td}>
                  <FormInput<ApplicationFormData>
                    name='evaluation.amounts.amountA'
                    control={control}
                    type='number'
                    className={cn(styles.rowInput, styles.rowInputRight)}
                    placeholder='0'
                    aria-label='사업시행자 추천 감정평가액'
                  />
                </td>
                {hasGovernorRecommendation && (
                  <td className={styles.td}>
                    <FormInput<ApplicationFormData>
                      name='evaluation.amounts.amountB'
                      control={control}
                      type='number'
                      className={cn(styles.rowInput, styles.rowInputRight)}
                      placeholder='0'
                      aria-label='시도지사 추천 감정평가액'
                    />
                  </td>
                )}
                <td className={styles.td}>
                  <FormInput<ApplicationFormData>
                    name='evaluation.amounts.amountC'
                    control={control}
                    type='number'
                    className={cn(styles.rowInput, styles.rowInputRight)}
                    placeholder='0'
                    aria-label='토지소유자 추천 감정평가액'
                  />
                </td>
                <td className={styles.td}>
                  <Input
                    type='text'
                    readOnly
                    value={averageAmount.toLocaleString('ko-KR')}
                    onChange={() => {}}
                    className={cn(styles.rowInput, styles.rowInputRight)}
                    aria-label='합계 평균'
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
})

// ----- Letter Files Card -----
export const LetterFilesCard = memo(function LetterFilesCard() {
  const { control } = useFormContext<ApplicationFormData>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>의뢰 공문 및 회신 공문</CardTitle>
      </CardHeader>
      <CardContent>
        <FormUploadMulti<ApplicationFormData>
          name='evaluation.requestLetterFiles'
          control={control}
          label='의뢰 공문 첨부 파일'
          displayMode='list'
        />
        <div className={styles.mtSection}>
          <FormUploadMulti<ApplicationFormData>
            name='evaluation.responseLetterFiles'
            control={control}
            label='회신 공문 첨부 파일'
            displayMode='list'
          />
        </div>
      </CardContent>
    </Card>
  )
})
