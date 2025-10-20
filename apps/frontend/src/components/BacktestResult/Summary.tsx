import { useBacktestStore } from "@/lib/store"


export function BacktestResultSummary() {
  const backtestResult = useBacktestStore((state) => state.backtestResult)

  if (!backtestResult) return null;

  return (
    <div className="bg-background-2 p-6 rounded-lg border border-background-3">
      <h3 className="text-xl font-semibold mb-4">Backtest Summary</h3>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <dt className="font-medium text-gray-500">Ticker:</dt>
          <dd className="text-lg">{backtestResult.ticker}</dd>
        </div>

        <div>
          <dt className="font-medium text-gray-500">Strategy:</dt>
          <dd className="text-lg">{backtestResult.strategy}</dd>
        </div>

        <div>
          <dt className="font-medium text-gray-500">Period:</dt>
          <dd className="text-lg">
            {backtestResult.range.start} to {backtestResult.range.end}
          </dd>
        </div>

        <div>
          <dt className="font-medium text-gray-500">Parameters:</dt>
          <dd className="text-sm font-mono">
            {JSON.stringify(backtestResult.parameters, null, 2)}
          </dd>
        </div>
      </dl>
    </div>
  )
}