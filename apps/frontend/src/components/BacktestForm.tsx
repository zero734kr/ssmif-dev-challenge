import { useBacktestStore } from "@/lib/store"
import { BacktestFormData } from "@/pages"
import { useBacktestEngine } from "@/queries/useBacktestEngine"
import { BacktestRequestDto } from "@challenge/dtos"
import { useFormContext } from "react-hook-form"
import { DateInput } from "./form/DateInput"
import { InitialCashInput } from "./form/InitialCashInput"
import { SMAParamsForm } from "./form/SMAParamsForm"
import { StrategyInput } from "./form/StrategyInput"
import { TickerInput } from "./form/TickerInput"
import { SubmitButton } from "./SubmitButton"

export function BacktestForm() {
  const isLoading = useBacktestStore((state) => state.isLoading)
  const setError = useBacktestStore((state) => state.setError)
  const setIsLoading = useBacktestStore((state) => state.setIsLoading)
  const setBacktestResult = useBacktestStore((state) => state.setBacktestResult)

  const { watch, handleSubmit, formState: { errors } } = useFormContext<BacktestFormData>()

  const { runBacktest } = useBacktestEngine()

  const onSubmit = async (data: BacktestFormData) => {
    setIsLoading(true)
    setError(null)
    setBacktestResult(null)

    try {
      const requestData: BacktestRequestDto = {
        ...data,
        parameters: data.parameters
      }
      const result = await runBacktest(requestData)
      setBacktestResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Backtest error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const strategy = watch("strategy")

  return <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    <div className="bg-background-2 border border-background-3 rounded-lg p-6">
      <label className="block text-lg font-medium mb-2">
        Backtest Configuration
      </label>

      <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label htmlFor="ticker" className="block text-sm font-medium mb-2">
            Stock Ticker
          </label>

          <TickerInput />
        </div>

        <div>
          <label htmlFor="strategy" className="block text-sm font-medium mb-2">
            Strategy
          </label>

          <StrategyInput />
        </div>

        <div>
          <label htmlFor="initialCash" className="block text-sm font-medium mb-2">
            Initial Cash ($)
          </label>

          <InitialCashInput />
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium mb-2">
            Start Date
          </label>

          <DateInput htmlFor="start" />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium mb-2">
            End Date
          </label>

          <DateInput htmlFor="end" />
        </div>
      </div>

      <hr className="my-7 text-background-3" />

      <div>
        <label className="block text-lg font-medium mb-2">
          Strategy Parameters ({strategy})
        </label>

        {strategy === "sma-crossover" && <SMAParamsForm />}
      </div>
    </div>

    <SubmitButton isLoading={isLoading}>
      {isLoading ? "Running Backtest..." : "Run Backtest"}
    </SubmitButton>
  </form>
}
