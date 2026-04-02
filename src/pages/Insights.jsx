import InsightsPanel from '../components/insights/InsightsPanel';

export default function Insights() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-xl">Financial insights</h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Patterns and comparisons from your data</p>
      </div>
      <InsightsPanel />
    </div>
  );
}
