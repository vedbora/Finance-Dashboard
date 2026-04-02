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
  const base = 'flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors';
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
    <Card className="p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-5 gap-2">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-neutral-100 dark:bg-white/10 border border-neutral-200/60 dark:border-white/10">
          <Icon size={20} className="text-neutral-700 dark:text-neutral-200" strokeWidth={2} />
        </div>
        <div className={changePillClass(ok)}>
          {mom.mode === 'percent' &&
            (up ? <ArrowUpRight size={12} strokeWidth={2.5} /> : down ? <ArrowDownRight size={12} strokeWidth={2.5} /> : null)}
          {mom.mode === 'new' &&
            (cardType === 'expense' ? <ArrowDownRight size={12} strokeWidth={2.5} /> : <ArrowUpRight size={12} strokeWidth={2.5} />)}
          <span className="text-right leading-tight max-w-[9.5rem] sm:max-w-none">{line}</span>
        </div>
      </div>
      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">{title}</p>
      <p className="text-2xl font-semibold text-neutral-900 dark:text-white font-mono tracking-tight">{value}</p>
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
      <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-900 text-white p-6 sm:p-8 relative overflow-hidden shadow-card">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 80% 40%, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative">
          <p className="text-neutral-400 text-sm font-medium mb-1">Overview</p>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-6">Your financial snapshot</h2>
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10">
            <div>
              <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider mb-1">Net worth</p>
              <p className="text-3xl sm:text-4xl font-semibold font-mono tracking-tight">{formatCurrency(totalBalance)}</p>
            </div>
            <div className="hidden sm:block w-px h-14 bg-white/15 self-center" />
            <div>
              <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider mb-1">{monthTitle} savings</p>
              <p className="text-xl sm:text-2xl font-semibold font-mono text-neutral-100">
                {formatCurrency(income - expenses, true)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <StatCard title="Total Balance" value={formatCurrency(totalBalance, true)} mom={savingsMom} icon={Wallet} cardType="balance" />
        <StatCard title="Monthly Income" value={formatCurrency(income, true)} mom={incomeMom} icon={TrendingUp} cardType="income" />
        <StatCard title="Monthly Expenses" value={formatCurrency(expenses, true)} mom={expenseMom} icon={TrendingDown} cardType="expense" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5">
        <div className="lg:col-span-3 min-w-0">
          <TrendLineChart />
        </div>
        <div className="lg:col-span-2 min-w-0">
          <SpendingPieChart />
        </div>
      </div>

      <Card className="p-6">
        <div className="mb-5">
          <h3 className="font-semibold text-neutral-900 dark:text-white text-lg tracking-tight">Recent transactions</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Last 5</p>
        </div>
        <div className="space-y-0.5">
          {recent.length === 0 ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 py-8 text-center">No transactions yet.</p>
          ) : (
            recent.map((txn, i) => {
              const cat = CATEGORIES[txn.category] || { label: txn.category, icon: '📋' };
              return (
                <div
                  key={txn.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-all duration-200"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-neutral-100 dark:bg-white/10 border border-neutral-200/60 dark:border-white/10">
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{txn.description}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{txn.merchant}</p>
                  </div>
                  <p
                    className={`text-sm font-semibold font-mono flex-shrink-0 tabular-nums ${
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
