import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { formatCurrency, getMonthOverMonthDisplay } from '../utils/formatters';
import { getCurrentMonthSnapshot } from '../utils/aggregates';
import Card from '../components/ui/Card';
import TrendLineChart from '../components/charts/LineChart';
import SpendingPieChart from '../components/charts/PieChart';

function momLooksGood(cardType, mom) {
  if (mom.mode === 'none') return true;
  if (mom.mode === 'new') return cardType !== 'expense';
  if (mom.mode !== 'percent' || mom.pct == null) return true;
  if (cardType === 'expense') return mom.pct <= 0;
  return mom.pct >= 0;
}

function changePillClass(ok) {
  const base = 'flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors';
  return ok
    ? `${base} bg-neutral-100 text-neutral-800 dark:bg-white/10 dark:text-neutral-200`
    : `${base} bg-neutral-200/70 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300`;
}

function StatCard({ title, value, mom, icon: Icon, cardType }) {
  const ok = momLooksGood(cardType, mom);
  const line =
    mom.mode === 'percent'
      ? `${mom.headline} vs last month`
      : mom.mode === 'new'
        ? 'New (none last month)'
        : 'No comparison';

  const up = mom.direction === 'up' || mom.direction === 'new';
  const down = mom.direction === 'down';

  return (
    <Card className="flex h-full flex-col justify-between animate-slide-up">
      <div className="mb-5 flex items-start justify-between gap-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200/60 bg-neutral-100 dark:border-white/10 dark:bg-white/10">
          <Icon size={20} className="text-neutral-700 dark:text-neutral-200" strokeWidth={2} />
        </div>
        <div className={changePillClass(ok)}>
          {mom.mode === 'percent' &&
            (up ? <ArrowUpRight size={12} strokeWidth={2.5} /> : down ? <ArrowDownRight size={12} strokeWidth={2.5} /> : null)}
          {mom.mode === 'new' &&
            (cardType === 'expense' ? <ArrowDownRight size={12} strokeWidth={2.5} /> : <ArrowUpRight size={12} strokeWidth={2.5} />)}
          <span className="max-w-[9.5rem] text-right leading-tight sm:max-w-none">{line}</span>
        </div>
      </div>
      <div>
        <p className="mb-1 text-sm font-semibold text-neutral-500 dark:text-neutral-400">{title}</p>
        <p className="font-mono text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">{value}</p>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { state } = useApp();
  const snap = getCurrentMonthSnapshot(state.transactions);
  const { totalBalance, income, expenses, prevMonthIncome, prevMonthExpenses } = snap;

  const monthTitle = new Date().toLocaleString('en-IN', { month: 'long' });
  const savingsMom = getMonthOverMonthDisplay(income - expenses, prevMonthIncome - prevMonthExpenses);
  const incomeMom = getMonthOverMonthDisplay(income, prevMonthIncome);
  const expenseMom = getMonthOverMonthDisplay(expenses, prevMonthExpenses);
  const recent = state.transactions.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-900 p-6 text-white shadow-lg sm:p-8 dark:border-white/10">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at 80% 40%, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative">
          <p className="mb-1 text-sm font-semibold text-neutral-500">Overview</p>
          <h2 className="mb-6 text-lg font-semibold tracking-tight sm:text-xl">Your financial snapshot</h2>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-10">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-neutral-400">Net worth</p>
              <p className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">{formatCurrency(totalBalance)}</p>
            </div>
            <div className="hidden h-14 w-px shrink-0 bg-white/15 sm:block" />
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-neutral-400">{monthTitle} savings</p>
              <p className="font-mono text-xl font-semibold text-neutral-100 sm:text-2xl">{formatCurrency(income - expenses, true)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
        <StatCard title="Total Balance" value={formatCurrency(totalBalance, true)} mom={savingsMom} icon={Wallet} cardType="balance" />
        <StatCard title="Monthly Income" value={formatCurrency(income, true)} mom={incomeMom} icon={TrendingUp} cardType="income" />
        <StatCard title="Monthly Expenses" value={formatCurrency(expenses, true)} mom={expenseMom} icon={TrendingDown} cardType="expense" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
        <div className="min-w-0 lg:col-span-3">
          <TrendLineChart />
        </div>
        <div className="min-w-0 lg:col-span-2">
          <SpendingPieChart />
        </div>
      </div>

      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">Recent transactions</h3>
          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">Last 5</p>
        </div>
        <div className="space-y-1">
          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <p className="text-sm font-medium text-neutral-900 dark:text-white">No transactions available</p>
              <p className="mt-1 max-w-xs text-xs text-neutral-500 dark:text-neutral-400">Add a transaction from the header when you&apos;re in Admin role.</p>
            </div>
          ) : (
            recent.map((txn, i) => {
              const cat = CATEGORIES[txn.category] || { label: txn.category, icon: '📋' };
              return (
                <div
                  key={txn.id}
                  className="flex items-center gap-3 rounded-xl p-3 transition-colors duration-200 hover:bg-neutral-50 dark:hover:bg-white/[0.04]"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200/60 bg-neutral-100 text-lg dark:border-white/10 dark:bg-white/10">
                    {cat.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">{txn.description}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{txn.merchant}</p>
                  </div>
                  <p
                    className={`shrink-0 font-mono text-sm font-semibold tabular-nums ${
                      txn.type === 'income' ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    {txn.type === 'income' ? '+' : '−'}
                    {formatCurrency(txn.amount, true)}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
