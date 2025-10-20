import { useBacktestStore } from "@/lib/store";
import { BacktestResultMetrics } from "./Metrics";
import { BacktestResultSummary } from "./Summary";
import { BacktestResultTrades } from "./Trades";


export function BacktestResultWrapper() {
  const backtestResult = useBacktestStore((state) => state.backtestResult);

  if (!backtestResult) return null;

  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-bold">Results</h2>

      {/* Summary */}
      <BacktestResultSummary />

      {/* Performance Metrics */}
      <BacktestResultMetrics />

      {/* Trades Table */}
      <BacktestResultTrades />
    </section>
  )
}