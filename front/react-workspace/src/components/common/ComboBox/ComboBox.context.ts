import { createContext } from 'react'

import type { ComboBoxContextValue } from './ComboBox.type'

export const ComboBoxContext = createContext<ComboBoxContextValue | null>(null)
