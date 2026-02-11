import type { Control, Path, RegisterOptions } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'

import type { UploadProps } from './Upload.types'

/**
 * React Hook Form용 Upload 컴포넌트 Props
 * Controller를 내부에 감추고 간결한 API를 제공합니다.
 */
export interface FormUploadProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<UploadProps, 'value' | 'onChange' | 'error'> {
  /** 필드 이름 (필수) */
  name: Path<TFieldValues>

  /** RHF 컨트롤러 (필수) */
  control: Control<TFieldValues>

  /** 유효성 검증 규칙 */
  rules?: Omit<RegisterOptions<TFieldValues>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>

  /** 컴포넌트 언등록 여부 */
  shouldUnregister?: boolean
}


