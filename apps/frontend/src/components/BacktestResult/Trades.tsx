import { useBacktestStore } from "@/lib/store";
import { clsx } from "@challenge/utils";

const formatCurrency = (value: number) => `${value < 0 ? "-" : ""}$${Math.abs(value).toFixed(2)}`;

export function BacktestResultTrades() {
  const backtestResult = useBacktestStore((state) => state.backtestResult)

  if (!backtestResult) return null;

  console.log(backtestResult.trades)

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        Trades ({backtestResult.trades.length})
      </h3>

      {backtestResult.trades.length === 0 ? (
        <p className="text-gray-600 italic">No trades executed during this period.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-background-3">
            <thead className="bg-background">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ordered Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">P&L ($)</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">P&L (%)</th>
              </tr>
            </thead>
            <tbody className="bg-background-2 divide-y divide-background-3">
              {backtestResult.trades.map((trade, index) => (
                <tr key={index} className="hover:bg-background-3">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>

                  <td className="px-4 py-3 text-sm">
                    <span className={clsx(
                      "px-2 py-1 rounded text-xs font-medium",
                      trade.type === 'buy'
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    )}>
                      {trade.type.toUpperCase()}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {new Date(trade.orderedDate).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-sm text-right">
                    {formatCurrency(trade.price)}
                  </td>

                  <td className="px-4 py-3 text-sm text-right">{trade.quantity}</td>

                  <td className={clsx(
                    "px-4 py-3 text-sm text-right font-medium",
                    trade.pnl
                      ? trade.pnl >= 0
                        ? "text-green-400"
                        : "text-red-400"
                      : "text-gray-500"
                  )}>
                    {trade.pnl !== undefined
                      ? formatCurrency(trade.pnl)
                      : "-"}
                  </td>

                  <td className={clsx(
                    "px-4 py-3 text-sm text-right font-medium",
                    trade.pnlPercent
                      ? trade.pnlPercent >= 0
                        ? "text-green-400"
                        : "text-red-400"
                      : "text-gray-500"
                  )}>
                    {trade.pnlPercent !== undefined
                      ? `${(trade.pnlPercent * 100).toFixed(2)}%`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}