import { BacktestFormData } from "@/pages"
import { useFormContext } from "react-hook-form"
import { FormError } from "./FormError"

export function InitialCashInput() {
  const { register, formState: { errors } } = useFormContext<BacktestFormData>()

  return (
    <>
      <input
        {...register("initialCash", { valueAsNumber: true })}
        id="initialCash"
        type="number"
        placeholder="100000"
        className="w-full px-3 py-2 border border-background-3 rounded-md"
      />

      <FormError message={errors.initialCash?.message || ""} />
    </>
  )
}
