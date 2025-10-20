import { useApi } from "@challenge/api";
import { useQuery } from '@tanstack/react-query';

export function useSymbols() {
  const api = useApi()

  return useQuery(
    {
      queryKey: ['symbols'],
      queryFn: async () => {
        return await api.finance.getSymbols();
      },
    }
  )
}
