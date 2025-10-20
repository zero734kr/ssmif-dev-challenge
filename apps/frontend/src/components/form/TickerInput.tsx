import { BacktestFormData } from "@/pages"
import { useFormContext } from "react-hook-form"
import { FormError } from "./FormError"


export function TickerInput() {
  const { register, formState: { errors } } = useFormContext<BacktestFormData>()

  return (
    <>
      <input
        {...register("ticker")}
        id="ticker"
        type="text"
        placeholder="e.g., NVDA, AAPL, GOOGL"
        className="w-full px-3 py-2 border border-background-3 rounded-md"
      />

      <FormError message={errors.ticker?.message || ""} />
    </>
  )
}
