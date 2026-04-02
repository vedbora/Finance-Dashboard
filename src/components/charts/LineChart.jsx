import { useId, useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useApp } from '../../context/AppContext';
import { getMonthlyTrend } from '../../utils/aggregates';
import { formatCurrency } from '../../utils/formatters';
import Card from '../ui/Card';

export default function TrendLineChart() {
  const { state } = useApp();
  const dark = state.darkMode;
  const incomeStroke = dark ? '#fafafa' : '#171717';
  const expenseStroke = dark ? '#a3a3a3' : '#737373';
  const uid = useId().replace(/:/g, '');
  const incomeGradId = `incomeGrad-${uid}`;
  const expenseGradId = `expenseGrad-${uid}`;

  const monthlyTrend = useMemo(() => getMonthlyTrend(state.transactions, 6), [state.transactions]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-3 text-sm shadow-lg dark:border-white/10 dark:bg-neutral-950">
        <p className="mb-2 font-semibold text-neutral-900 dark:text-white">{label}</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <span className="font-mono text-sm font-medium tabular-nums text-neutral-900 dark:text-white">
              {p.dataKey === 'income' ? '↑' : '↓'} {formatCurrency(p.value, true)}
            </span>
            <span className="text-xs capitalize text-neutral-500">{p.dataKey}</span>
          </div>
        ))}
      </div>
    );
  };

  const gridStroke = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const tickFill = dark ? '#a3a3a3' : '#737373';

  return (
    <Card>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">Financial trend</h3>
          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">Last 6 months</p>
        </div>
        <div className="flex items-center gap-5 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-neutral-900 dark:bg-white" />
            Income
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
            Expenses
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={232}>
        <AreaChart data={monthlyTrend} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id={incomeGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={incomeStroke} stopOpacity={dark ? 0.22 : 0.14} />
              <stop offset="95%" stopColor={incomeStroke} stopOpacity={0} />
            </linearGradient>
            <linearGradient id={expenseGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={expenseStroke} stopOpacity={dark ? 0.2 : 0.12} />
              <stop offset="95%" stopColor={expenseStroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickFill }} axisLine={false} tickLine={false} dy={6} />
          <YAxis tick={{ fontSize: 11, fill: tickFill }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}K`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="income" stroke={incomeStroke} strokeWidth={2} fill={`url(#${incomeGradId})`} dot={{ fill: incomeStroke, r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
          <Area type="monotone" dataKey="expenses" stroke={expenseStroke} strokeWidth={2} fill={`url(#${expenseGradId})`} dot={{ fill: expenseStroke, r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
