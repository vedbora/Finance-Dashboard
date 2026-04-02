import InsightsPanel from '../components/insights/InsightsPanel';

export default function Insights() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-white tracking-tight">Financial insights</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Patterns and comparisons from your data</p>
      </div>
      <InsightsPanel />
    </div>
  );
}
