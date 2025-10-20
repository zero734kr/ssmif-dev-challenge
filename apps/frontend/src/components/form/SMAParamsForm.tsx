import { BacktestFormData } from "@/pages";
import { useFormContext } from "react-hook-form";


export function SMAParamsForm() {
  const { register } = useFormContext<BacktestFormData>();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label htmlFor="shortPeriod" className="block text-sm font-medium mb-2">
            Short Period (days)
          </label>

          <input
            id="shortPeriod"
            type="number"
            {...register("parameters.shortPeriod", { valueAsNumber: true })}
            placeholder="20"
            className="w-full px-3 py-2 border border-background-3 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="longPeriod" className="block text-sm font-medium mb-2">
            Long Period (days)
          </label>

          <input
            id="longPeriod"
            type="number"
            {...register("parameters.longPeriod", { valueAsNumber: true })}
            placeholder="50"
            className="w-full px-3 py-2 border border-background-3 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="positionSize" className="block text-sm font-medium mb-2">
            Max Position Size ($)
          </label>

          <input
            id="positionSize"
            type="number"
            {...register("parameters.positionSize", { valueAsNumber: true })}
            placeholder="10000"
            className="w-full px-3 py-2 border border-background-3 rounded-md"
          />
        </div>
      </div>
    </>
  )
}