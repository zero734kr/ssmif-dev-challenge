import { BacktestErrorWrapper } from "@/components/BacktestErrorWrapper"
import { BacktestForm } from "@/components/BacktestForm"
import { BacktestResultWrapper } from "@/components/BacktestResult"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import * as z from "zod"

const backtestFormSchema = z.object({
  ticker: z.string().min(1, "Ticker is required"),
  strategy: z.string().min(1, "Strategy is required"),
  initialCash: z.number().min(1, "Initial cash must be greater than zero"),
  range: z.object({
    start: z.string().min(1, "Start date is required"),
    end: z.string().min(1, "End date is required"),
  }),
  parameters: z.record(z.string(), z.any()).optional(),
})

export type BacktestFormData = z.infer<typeof backtestFormSchema>

export default function Home() {
  const form = useForm({
    resolver: zodResolver(backtestFormSchema),
    defaultValues: {
      ticker: "NVDA",
      strategy: "sma-crossover",
      initialCash: 100000,
      range: {
        start: "2020-01-01",
        end: "2024-12-31",
      },
      parameters: {
        shortPeriod: 20,
        longPeriod: 50,
        positionSize: 10000,
      },
    },
  })

  return (
    <main className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Trading Strategy Backtest</h1>

      {/* Backtest Configuration Form */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Configuration</h2>

        <FormProvider {...form}>
          <BacktestForm />
        </FormProvider>
      </section>

      {/* Error Display */}
      <BacktestErrorWrapper />

      {/* Results Display */}
      <BacktestResultWrapper />
    </main>
  )
}
