import { use } from "react"
import { ApiClientContext } from "./context"

export function useApi() {
  const client = use(ApiClientContext)

  if (!client) {
    throw new Error('useApi() must be used within a <ApiClientProvider />.')
  }

  return client
}
