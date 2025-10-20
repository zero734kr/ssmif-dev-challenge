import { useBacktestStore } from "@/lib/store";
import { clsx } from "@challenge/utils";


export function BacktestResultMetrics() {
  const backtestResult = useBacktestStore((state) => state.backtestResult)

  if (!backtestResult) return null;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-6 bg-background-2 border border-background-3 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Final Value</h4>
          <p className={`text-3xl font-bold`}>
            ${backtestResult.finalValue.toFixed(2)}
          </p>
        </div>

        <div className="p-6 bg-background-2 border border-background-3 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Total Return</h4>
          <p className={clsx(
            "text-3xl font-bold",
            backtestResult.metrics.totalReturn >= 0
              ? "text-green-400"
              : "text-red-400"
          )}>
            {(backtestResult.metrics.totalReturn * 100).toFixed(2)}%
          </p>
        </div>

        <div className="p-6 bg-background-2 border border-background-3 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Annualized Return</h4>
          <p className={clsx(
            "text-3xl font-bold",
            backtestResult.metrics.annualizedReturn >= 0
              ? "text-green-400"
              : "text-red-400"
          )}>
            {(backtestResult.metrics.annualizedReturn * 100).toFixed(2)}%
          </p>
        </div>

        <div className="p-6 bg-background-2 border border-background-3 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Max Drawdown</h4>
          <p className="text-3xl font-bold text-red-400">
            {(backtestResult.metrics.maxDrawdown * 100).toFixed(2)}%
          </p>
        </div>

        <div className="p-6 bg-background-2 border border-background-3 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Win Probability</h4>
          <p className="text-3xl font-bold text-blue-400">
            {(backtestResult.metrics.winProbability * 100).toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  )
}