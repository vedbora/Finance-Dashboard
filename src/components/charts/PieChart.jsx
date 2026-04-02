import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../../context/AppContext';
import { getSpendingByCategory } from '../../utils/aggregates';
import { formatCurrency } from '../../utils/formatters';
import Card from '../ui/Card';

const GRAYS_LIGHT = ['#171717', '#404040', '#525252', '#737373', '#a3a3a3', '#d4d4d4', '#e5e5e5'];
const GRAYS_DARK = ['#fafafa', '#e5e5e5', '#d4d4d4', '#a3a3a3', '#737373', '#525252', '#404040'];

export default function SpendingPieChart() {
  const { state } = useApp();
  const dark = state.darkMode;

  const segments = useMemo(() => {
    const raw = getSpendingByCategory(state.transactions);
    const pal = dark ? GRAYS_DARK : GRAYS_LIGHT;
    return raw.map((c, i) => ({ ...c, fill: pal[i % pal.length] }));
  }, [state.transactions, dark]);

  const total = segments.reduce((s, c) => s + c.value, 0);
  const periodLabel = useMemo(() => new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }), []);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    const denom = total || 1;
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-3 text-sm shadow-lg dark:border-white/10 dark:bg-neutral-950">
        <p className="font-semibold text-neutral-900 dark:text-white">{d.name}</p>
        <p className="text-neutral-500 dark:text-neutral-400">
          {formatCurrency(d.value)} ({((d.value / denom) * 100).toFixed(1)}%)
        </p>
      </div>
    );
  };

  if (total === 0) {
    return (
      <Card>
        <div className="mb-5">
          <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">Spending by category</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{periodLabel}</p>
        </div>
        <p className="py-14 text-center text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          No expenses this month yet. Add an expense to see the breakdown.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-5">
        <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">Spending by category</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{periodLabel}</p>
      </div>
      <div className="flex flex-col items-center gap-8 sm:flex-row">
        <div className="relative shrink-0">
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie data={segments} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                {segments.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total</p>
            <p className="font-mono text-sm font-semibold text-neutral-900 dark:text-white">{formatCurrency(total, true)}</p>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-2.5">
          {segments.slice(0, 6).map((cat) => (
            <div key={cat.category} className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-neutral-900/10 dark:ring-white/15" style={{ backgroundColor: cat.fill }} />
              <span className="flex-1 truncate text-xs text-neutral-600 dark:text-neutral-300">{cat.name}</span>
              <span className="font-mono text-xs font-semibold tabular-nums text-neutral-900 dark:text-white">{formatCurrency(cat.value, true)}</span>
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-neutral-100 dark:bg-white/10">
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(cat.value / total) * 100}%`, backgroundColor: cat.fill }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
