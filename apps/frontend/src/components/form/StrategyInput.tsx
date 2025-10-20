import { BacktestFormData } from "@/pages";
import { useFormContext } from "react-hook-form";
import { FormError } from "./FormError";


export function StrategyInput() {
  const { register, formState: { errors } } = useFormContext<BacktestFormData>();

  return (
    <>
      <select
        {...register("strategy")}
        id="strategy"
        className="w-full px-3 py-2 border border-background-3 rounded-md"
      >
        <option value="sma-crossover">SMA Crossover</option>
      </select>

      <FormError message={errors.strategy?.message || ""} />
    </>
  )
}
