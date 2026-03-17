import { createContext } from 'react'

import type { SelectContextValue } from './Select.type'

export const SelectContext = createContext<SelectContextValue | null>(null)
