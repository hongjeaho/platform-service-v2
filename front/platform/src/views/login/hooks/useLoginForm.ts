import { useForm } from 'react-hook-form'

export interface LoginFormValues {
  id: string
  password: string
}

const defaultValues: LoginFormValues = {
  id: '',
  password: '',
}

export function useLoginForm() {
  return useForm<LoginFormValues>({
    defaultValues,
  })
}
