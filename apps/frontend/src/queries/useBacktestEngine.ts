import { useApi } from "@challenge/api";
import { BacktestRequestDto } from "@challenge/dtos";
import { useMutation } from '@tanstack/react-query';

export function useBacktestEngine() {
  const api = useApi()

  const { mutateAsync } =  useMutation(
    {
      mutationFn: async (options: BacktestRequestDto) => {
        return await api.backtest.runBacktest(options)
      },
    }
  )

  return {
    runBacktest: mutateAsync
  }
}
