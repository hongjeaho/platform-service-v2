import { createContext } from 'react'

import type { RadioGroupContextValue } from './RadioGroup.type'

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)
