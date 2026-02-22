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

// Radio (form)
export type { RadioGroupProps, RadioOption } from './form/radio/Radio.types'
export { RadioGroup } from './form/radio/RadioGroup'

// Select (form)
export { FormSelect } from './form/select/FormSelect'
export type { FormSelectProps } from './form/select/FormSelect.types'
export { Select } from './form/select/Select'
export type { SelectOption, SelectProps } from './form/select/Select.types'

// Upload (form)
export { Upload } from './form/upload/Upload'
export type { UploadMultiProps, UploadProps } from './form/upload/Upload.types'
export { UploadMulti } from './form/upload/UploadMulti'

// DatePicker (form)
export { DatePicker } from './form/datePicker/DatePicker'
export type { DatePickerProps } from './form/datePicker/DatePicker.types'

// DateRangePicker (form)
export { DateRangePicker } from './form/dateRangePicker/DateRangePicker'
export type { DateRange, DateRangePickerProps } from './form/dateRangePicker/DateRangePicker.types'

// Table (data-display)
export { Table } from './data-display/table/Table'
export type { TableColumn, TableProps, TableSortConfig } from './data-display/table/Table.types'

// Pagination (navigation) — 테이블 포함 모든 목록 페이지네이션에 사용
export { Pagination } from './navigation/pagination'
export type { PaginationProps } from './navigation/pagination/Pagination.types'

// Box (layout)
export { Box } from './layout/box/Box'
export type {
  BoxProps,
  BoxAs,
  BoxDisplay,
  BoxDirection,
  BoxAlign,
  BoxJustify,
  BoxGap,
} from './layout/box/Box.types'

// Container (layout)
export { Container } from './layout/container/Container'
export type { ContainerProps, ContainerSize, ContainerAs } from './layout/container/Container.types'

// PageSubTitle (layout)
export { PageSubTitle } from './layout/page-subtitle/PageSubTitle'
export type { PageSubTitleProps } from './layout/page-subtitle/PageSubTitle'

// Card (layout)
export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from './layout/card/Card'
export type {
  CardProps,
  CardSize,
  CardVariant,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
  CardTitleProps,
  CardDescriptionProps,
} from './layout/card/Card.types'

// Modal (overlay)
export {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from './overlay/modal/Modal'
export type {
  ModalProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
} from './overlay/modal/Modal.types'
