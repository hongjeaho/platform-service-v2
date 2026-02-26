/**
 * 공통 UI 컴포넌트 export
 * 디자인 시스템 기반 공통 컴포넌트 라이브러리
 */

// Button (action)
export { Button } from './action/button/Button'
export type { ButtonProps } from './action/button/Button.types'

// Checkbox (form)
export { Checkbox } from './form/checkbox/Checkbox'
export type { CheckboxProps } from './form/checkbox/Checkbox.types'

// FormCheckbox (form)
export { FormCheckbox } from './form/checkbox/FormCheckbox'
export type { FormCheckboxProps } from './form/checkbox/FormCheckbox.types'

// Input (form)
export { FormInput } from './form/input/FormInput'
export type { FormInputProps } from './form/input/FormInput.types'
export { Input } from './form/input/Input'
export type { InputProps } from './form/input/Input.types'

// Textarea (form)
export { FormTextarea } from './form/textarea/FormTextarea'
export type { FormTextareaProps } from './form/textarea/FormTextarea.types'
export { Textarea } from './form/textarea/Textarea'
export type { TextareaProps } from './form/textarea/Textarea.types'

// Radio (form)
export { FormRadioGroup } from './form/radio/FormRadioGroup'
export type { FormRadioGroupProps } from './form/radio/FormRadioGroup.types'
export type { RadioGroupProps, RadioOption } from './form/radio/Radio.types'
export { RadioGroup } from './form/radio/RadioGroup'

// Select (form)
export { FormSelect } from './form/select/FormSelect'
export type { FormSelectProps } from './form/select/FormSelect.types'
export { Select } from './form/select/Select'
export type { SelectOption, SelectProps } from './form/select/Select.types'

// Upload (form)
export { FormUploadMulti } from './form/upload/FormUploadMulti'
export type { FormUploadMultiProps } from './form/upload/FormUploadMulti.types'
export { Upload } from './form/upload/Upload'
export type { UploadMultiProps, UploadProps } from './form/upload/Upload.types'
export { UploadMulti } from './form/upload/UploadMulti'

// DatePicker (form)
export { DatePicker } from './form/datePicker/DatePicker'
export type { DatePickerProps } from './form/datePicker/DatePicker.types'

// DateRangePicker (form)
export { DateRangePicker } from './form/dateRangePicker/DateRangePicker'
export type { DateRange, DateRangePickerProps } from './form/dateRangePicker/DateRangePicker.types'

// DataTable (data-display)
export { DataTable } from './data-display/data-table/DataTable'
export type {
  DataTableColumn,
  DataTableProps,
  DataTableSortConfig,
} from './data-display/data-table/DataTable.types'

// Table (layout) — 섹션/폼·조회용 테이블 레이아웃
export type { TableProps } from './layout/table'
export { Table, tableStyles } from './layout/table'

// Pagination (navigation) — 테이블 포함 모든 목록 페이지네이션에 사용
export { Pagination } from './navigation/pagination'
export type { PaginationProps } from './navigation/pagination/Pagination.types'

// Box (layout)
export { Box } from './layout/box/Box'
export type {
  BoxAlign,
  BoxAs,
  BoxDirection,
  BoxDisplay,
  BoxGap,
  BoxJustify,
  BoxProps,
} from './layout/box/Box.types'

// Container (layout)
export { Container } from './layout/container/Container'
export type { ContainerAs, ContainerProps, ContainerSize } from './layout/container/Container.types'

// PageSubTitle (layout)
export type { PageSubTitleProps } from './layout/page-subtitle/PageSubTitle'
export { PageSubTitle } from './layout/page-subtitle/PageSubTitle'

// Card (layout)
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './layout/card/Card'
export type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardSize,
  CardTitleProps,
  CardVariant,
} from './layout/card/Card.types'

// Modal (overlay)
export { Modal, ModalBody, ModalCloseButton, ModalFooter, ModalHeader } from './overlay/modal/Modal'
export type {
  ModalBodyProps,
  ModalFooterProps,
  ModalHeaderProps,
  ModalProps,
} from './overlay/modal/Modal.types'
