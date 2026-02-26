import type { ApplicationFormData, QuantityRow } from './types'

const EMPTY_QUANTITY_ROW: QuantityRow = {
  totalCnt: '',
  totalPrice: '',
  conferCnt: '',
  conferPrice: '',
  decisionCnt: '',
  decisionPrice: '',
}

export const APPLICATION_FORM_DEFAULT_VALUES: ApplicationFormData = {
  business: {
    caseNo: '',
    caseTitle: '',
    address: '',
    scale: '',
    businessPeriod: '',
  },
  agreementDetails: [{ consultationDate: null, consultationDateText: '' }],
  evaluation: {
    selectedCheck: null,
    notReqReason: '',
    announcementFiles: [],
    recCategory: 0,
    corporations: {
      businessOperator: '',
      landowner: '',
    },
    amounts: {
      amountA: 0,
      amountC: 0,
      amountAverage: 0,
    },
    requestLetterFiles: [],
    responseLetterFiles: [],
  },
  totalQuantity: {
    mode: 'auto',
    land: { ...EMPTY_QUANTITY_ROW, totalArea: '', conferArea: '', decisionArea: '' },
    object: EMPTY_QUANTITY_ROW,
    goodwill: EMPTY_QUANTITY_ROW,
    etc: {
      ...EMPTY_QUANTITY_ROW,
      totalArea: '',
      conferArea: '',
      decisionArea: '',
    },
  },
  cityPlanning: [],
  targetBuilding: [],
  decisionReason: '',
  businessRecognitionDate: '',
  decisionAttachments: [],
}
