import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../../context/AppContext';
import { getSpendingByCategory } from '../../utils/aggregates';
import { formatCurrency } from '../../utils/formatters';
import Card from '../ui/Card';

export default function SpendingPieChart() {
  const { state } = useApp();

  const spendingByCategory = useMemo(
    () => getSpendingByCategory(state.transactions),
    [state.transactions],
  );
  const total = spendingByCategory.reduce((s, c) => s + c.value, 0);
  const periodLabel = useMemo(
    () => new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
    [],
  );

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    const denom = total || 1;
    return (
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-semibold text-neutral-900 dark:text-white">{d.name}</p>
        <p className="text-neutral-500 dark:text-neutral-400">
          {formatCurrency(d.value)} ({((d.value / denom) * 100).toFixed(1)}%)
        </p>
      </div>
    );
  };

  if (total === 0) {
    return (
      <Card className="p-6">
        <div className="mb-5">
          <h3 className="font-semibold text-neutral-900 dark:text-white text-lg tracking-tight">Spending by category</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{periodLabel}</p>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 py-14 text-center leading-relaxed">
          No expenses this month yet. Add an expense to see the breakdown.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-5">
        <h3 className="font-semibold text-neutral-900 dark:text-white text-lg tracking-tight">Spending by category</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{periodLabel}</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <div className="relative flex-shrink-0">
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie
                data={spendingByCategory}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {spendingByCategory.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Total</p>
            <p className="font-semibold text-neutral-900 dark:text-white text-sm font-mono">{formatCurrency(total, true)}</p>
          </div>
        </div>
        <div className="flex-1 space-y-2.5 w-full min-w-0">
          {spendingByCategory.slice(0, 6).map((cat) => (
            <div key={cat.category} className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-1 ring-black/10 dark:ring-white/15" style={{ backgroundColor: cat.color }} />
              <span className="text-xs text-neutral-600 dark:text-neutral-300 flex-1 truncate">{cat.name}</span>
              <span className="text-xs font-semibold text-neutral-900 dark:text-white font-mono tabular-nums">{formatCurrency(cat.value, true)}</span>
              <div className="w-16 bg-neutral-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(cat.value / total) * 100}%`, backgroundColor: cat.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
