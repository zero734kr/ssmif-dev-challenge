import { ReactNode, createContext, useState } from 'react';
import { ApiClient } from './index';

export const ApiClientContext = createContext<ApiClient | undefined>(undefined);

interface ApiClientProviderProps {
  children: ReactNode
}

export function ApiClientProvider({ children, }: ApiClientProviderProps) {
  const [client] = useState(() => new ApiClient())

  return (
    <ApiClientContext.Provider value={client}>
      {children}
    </ApiClientContext.Provider>
  )
}
