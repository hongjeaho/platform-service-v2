import { createContext } from 'react'

import type { ComboboxContextValue } from './Combobox.type'

export const ComboboxContext = createContext<ComboboxContextValue | null>(null)
