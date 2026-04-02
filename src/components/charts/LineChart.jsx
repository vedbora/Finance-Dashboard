import { useId, useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useApp } from '../../context/AppContext';
import { getMonthlyTrend } from '../../utils/aggregates';
import { formatCurrency } from '../../utils/formatters';
import Card from '../ui/Card';

const INCOME_LIGHT = '#0c87f5';
const EXPENSE_LIGHT = '#ef4444';
/** Slightly brighter on dark backgrounds */
const INCOME_DARK = '#38bdf8';
const EXPENSE_DARK = '#fb7185';

export default function TrendLineChart() {
  const { state } = useApp();
  const dark = state.darkMode;
  const incomeStroke = dark ? INCOME_DARK : INCOME_LIGHT;
  const expenseStroke = dark ? EXPENSE_DARK : EXPENSE_LIGHT;
  const uid = useId().replace(/:/g, '');
  const incomeGradId = `incomeGrad-${uid}`;
  const expenseGradId = `expenseGrad-${uid}`;

  const monthlyTrend = useMemo(
    () => getMonthlyTrend(state.transactions, 6),
    [state.transactions],
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-semibold text-neutral-900 dark:text-white mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <span style={{ color: p.color }} className="font-mono font-medium tabular-nums">
              {p.dataKey === 'income' ? '↑' : '↓'} {formatCurrency(p.value, true)}
            </span>
            <span className="text-neutral-500 capitalize">{p.dataKey}</span>
          </div>
        ))}
      </div>
    );
  };

  const gridStroke = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const tickFill = dark ? '#a3a3a3' : '#737373';

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-white text-lg tracking-tight">Financial trend</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Last 6 months</p>
        </div>
        <div className="flex items-center gap-5 text-xs font-medium text-neutral-600 dark:text-neutral-400">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: incomeStroke }} />
            Income
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: expenseStroke }} />
            Expenses
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={228}>
        <AreaChart data={monthlyTrend} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id={incomeGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={incomeStroke} stopOpacity={dark ? 0.35 : 0.2} />
              <stop offset="95%" stopColor={incomeStroke} stopOpacity={0} />
            </linearGradient>
            <linearGradient id={expenseGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={expenseStroke} stopOpacity={dark ? 0.32 : 0.18} />
              <stop offset="95%" stopColor={expenseStroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickFill }} axisLine={false} tickLine={false} dy={6} />
          <YAxis tick={{ fontSize: 11, fill: tickFill }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}K`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="income" stroke={incomeStroke} strokeWidth={2.5} fill={`url(#${incomeGradId})`} dot={{ fill: incomeStroke, r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
          <Area type="monotone" dataKey="expenses" stroke={expenseStroke} strokeWidth={2.5} fill={`url(#${expenseGradId})`} dot={{ fill: expenseStroke, r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
