/**
 * Implementer Application Form - 공통 타입 정의
 * JSP → React 마이그레이션 계획 기반
 */

// ----- Business -----
export interface BusinessFormData {
  caseNo: string
  caseTitle: string
  address: string
  scale: string
  businessPeriod: string
}

// ----- Agreement Details -----
export interface AgreementDetail {
  /** FormDatePicker 사용 시 Date | null, 제출/표시 시 문자열(yyyy.MM.dd)로 변환 */
  consultationDate: string | Date | null
  consultationDateText: string
}

// ----- City Planning -----
export interface CityPlanningRow {
  title: string
  content: string
}

// ----- Target Building -----
export interface TargetBuildingRow {
  locationOwner: string
  lotNumber: string
  landCategory: string
  areaBeforeInclusion: string
  areaIncluded: string
  remarks: string
}

// ----- Evaluation Corporation -----
export interface EvaluationCorporations {
  businessOperator: string
  governor?: string
  landowner: string
}

export interface EvaluationAmounts {
  amountA: number
  amountB?: number
  amountC: number
  amountAverage: number
}

export interface EvaluationFormData {
  selectedCheck: boolean | null
  notReqReason?: string
  announcementFiles: File[]
  recCategory: 0 | 1
  corporations: EvaluationCorporations
  amounts: EvaluationAmounts
  requestLetterFiles: File[]
  responseLetterFiles: File[]
}

// ----- Total Quantity Statement -----
/** 셀 값은 입력 시 문자열, 계산/제출 시 숫자로 처리 가능 */
export interface QuantityRow {
  totalCnt: string
  totalArea?: string
  totalPrice: string
  conferCnt: string
  conferArea?: string
  conferPrice: string
  decisionCnt: string
  decisionArea?: string
  decisionPrice: string
}

export interface TotalQuantityFormData {
  mode: 'auto' | 'manual'
  land: QuantityRow
  object: QuantityRow
  goodwill: QuantityRow
  etc: QuantityRow
}

// ----- Application Form (Root) -----
export interface ApplicationFormData {
  business: BusinessFormData
  agreementDetails: AgreementDetail[]
  evaluation: EvaluationFormData
  totalQuantity: TotalQuantityFormData
  cityPlanning: CityPlanningRow[]
  targetBuilding: TargetBuildingRow[]
  decisionReason: string
  businessRecognitionDate: string
  decisionAttachments: File[]
}
