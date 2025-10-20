import { BacktestResponseDto } from '@challenge/dtos'
import { create } from 'zustand'

interface BacktestStore {
  backtestResult: BacktestResponseDto | null
  setBacktestResult: (result: BacktestResponseDto | null) => void

  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  error: string | null
  setError: (error: string | null) => void
}

export const useBacktestStore = create<BacktestStore>((set) => ({
  backtestResult: null,
  setBacktestResult: (result: BacktestResponseDto | null) => set({ backtestResult: result }),

  isLoading: false,
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),

  error: null as string | null,
  setError: (error: string | null) => set({ error }),
}))
