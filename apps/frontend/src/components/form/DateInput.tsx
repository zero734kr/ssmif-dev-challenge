import { BacktestFormData } from "@/pages"
import { useFormContext } from "react-hook-form"
import { FormError } from "./FormError"

export function DateInput({ htmlFor }: { htmlFor: "start" | "end" }) {
  const { register, formState: { errors } } = useFormContext<BacktestFormData>()

  return (
    <>
      <input
        id={`${htmlFor}Date`}
        type="date"
        {...register(`range.${htmlFor}`)}
        className="w-full px-3 py-2 border border-background-3 rounded-md"
      />

      <FormError message={errors.range?.[htmlFor]?.message || ""} />
    </>
  )
}
