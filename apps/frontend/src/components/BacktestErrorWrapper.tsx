import { useBacktestStore } from "@/lib/store";


export function BacktestErrorWrapper() {
  const error = useBacktestStore((state) => state.error);

  if (!error) return null;

  return (
    <section className="mb-12 p-6 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
      <p className="text-red-700">{error}</p>
    </section>
  )
}