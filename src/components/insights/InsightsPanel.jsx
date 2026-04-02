import { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Star, Zap, Target, ListOrdered } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import {
  formatCurrency,
  getMonthOverMonthDisplay,
  formatMoMSubtitle,
  insightMoMLine,
  momDeltaLabel,
} from '../../utils/formatters';
import { getCurrentMonthSnapshot, getSpendingByCategory, getMonthlyTrend } from '../../utils/aggregates';
import Card from '../ui/Card';

const iconBox =
  'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border border-neutral-200/80 dark:border-white/10';
const iconBoxA = `${iconBox} bg-neutral-100 text-neutral-800 dark:bg-white/10 dark:text-neutral-100`;
const iconBoxB = `${iconBox} bg-neutral-200/50 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100`;

function InsightCard({ icon: Icon, title, value, subtitle, variant = 'a' }) {
  const box = variant === 'b' ? iconBoxB : iconBoxA;
  return (
    <Card className="p-6 hover:shadow-card-hover transition-all duration-200 animate-slide-up">
      <div className="flex items-start gap-4">
        <div className={box}>
          <Icon size={20} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">{title}</p>
          <div className="text-xl font-semibold text-neutral-900 dark:text-white tracking-tight inline-flex items-center gap-2 flex-wrap">
            {value}
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 leading-snug">{subtitle}</p>
        </div>
      </div>
    </Card>
  );
}

function MomHeadline({ mom, kind }) {
  let up = mom.direction === 'up';
  let down = mom.direction === 'down';
  if (mom.direction === 'new') {
    if (kind === 'expense') down = true;
    else up = true;
  }
  return (
    <>
      {up && <TrendingUp size={22} className="text-neutral-500 dark:text-neutral-400 flex-shrink-0" strokeWidth={2} />}
      {down && <TrendingDown size={22} className="text-neutral-500 dark:text-neutral-400 flex-shrink-0" strokeWidth={2} />}
      <span>{mom.headline}</span>
    </>
  );
}

const rowTone = {
  soft: 'bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/10',
  base: 'bg-white dark:bg-neutral-950/50 border border-neutral-200/60 dark:border-white/10',
};

export default function InsightsPanel() {
  const { state } = useApp();
  const txns = state.transactions;

  const data = useMemo(() => {
    const snap = getCurrentMonthSnapshot(txns);
    const spendingByCategory = getSpendingByCategory(txns);
    const months = getMonthlyTrend(txns, 6);
    const incomeMom = getMonthOverMonthDisplay(snap.income, snap.prevMonthIncome);
    const expenseMom = getMonthOverMonthDisplay(snap.expenses, snap.prevMonthExpenses);
    const savingsRate =
      snap.income > 0
        ? (((snap.income - snap.expenses) / snap.income) * 100).toFixed(0)
        : '0';
    const topCategory = spendingByCategory[0];
    const expenseList = txns.filter((t) => t.type === 'expense');
    const avgTxn =
      expenseList.length > 0
        ? expenseList.reduce((s, t) => s + t.amount, 0) / expenseList.length
        : 0;
    const lastMonth = months.length >= 2 ? months[months.length - 2] : null;
    const currentMonth = months.length >= 1 ? months[months.length - 1] : null;
    const bestIncomeMonth = months.length
      ? months.reduce((b, x) => (x.income > b.income ? x : b))
      : null;
    const topSpendPct =
      snap.expenses > 0 && topCategory
        ? ((topCategory.value / snap.expenses) * 100).toFixed(0)
        : '0';

    const topLine = topCategory
      ? `**${topCategory.name}** led spending at ${formatCurrency(topCategory.value)} this month.`
      : 'No expense categories yet for this month.';

    const bullets = [
      { text: topLine, tone: topCategory ? 'soft' : 'base' },
      { text: insightMoMLine('Income', snap.income, snap.prevMonthIncome), tone: 'soft' },
      { text: insightMoMLine('Expenses', snap.expenses, snap.prevMonthExpenses), tone: 'soft' },
      {
        text: `Savings rate **${savingsRate}%** this month. Target 30%+ if you can.`,
        tone: Number(savingsRate) >= 30 ? 'soft' : 'base',
      },
      {
        text: `**${txns.length}** transactions; average expense **${formatCurrency(avgTxn, true)}**.`,
        tone: 'base',
      },
    ];

    const barMuted = state.darkMode ? '#737373' : '#a3a3a3';
    const barStrong = state.darkMode ? '#fafafa' : '#171717';

    return {
      snap,
      spendingByCategory,
      months,
      incomeMom,
      expenseMom,
      savingsRate,
      topCategory,
      avgTxn,
      lastMonth,
      currentMonth,
      bestIncomeMonth,
      topSpendPct,
      bullets,
      barMuted,
      barStrong,
    };
  }, [txns, state.darkMode]);

  const {
    snap,
    spendingByCategory,
    incomeMom,
    expenseMom,
    savingsRate,
    topCategory,
    avgTxn,
    lastMonth,
    currentMonth,
    bestIncomeMonth,
    topSpendPct,
    bullets,
    barMuted,
    barStrong,
  } = data;

  const topCat = topCategory
    ? CATEGORIES[topCategory.category] || { label: topCategory.name, icon: '📋' }
    : { label: '—', icon: '📋' };

  const bestLabel = bestIncomeMonth ? `${bestIncomeMonth.month} (6 mo)` : '—';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <InsightCard
          icon={TrendingUp}
          title="Income growth"
          value={<MomHeadline mom={incomeMom} kind="income" />}
          subtitle={formatMoMSubtitle(snap.income, snap.prevMonthIncome)}
        />
        <InsightCard
          icon={TrendingDown}
          title="Expense change"
          value={<MomHeadline mom={expenseMom} kind="expense" />}
          subtitle={formatMoMSubtitle(snap.expenses, snap.prevMonthExpenses)}
          variant="b"
        />
        <InsightCard
          icon={Target}
          title="Savings rate"
          value={`${savingsRate}%`}
          subtitle={`${formatCurrency(snap.income - snap.expenses, true)} saved this month`}
        />
        <InsightCard
          icon={AlertTriangle}
          title="Top spend category"
          value={topCat.label}
          subtitle={
            topCategory
              ? `${formatCurrency(topCategory.value)} · ${topSpendPct}% of expenses`
              : 'No expenses this month'
          }
          variant="b"
        />
        <InsightCard icon={Zap} title="Avg. transaction" value={formatCurrency(avgTxn, true)} subtitle="Per expense" />
        <InsightCard
          icon={Star}
          title="Best income month"
          value={bestLabel}
          subtitle={
            bestIncomeMonth
              ? `${formatCurrency(bestIncomeMonth.income, true)} in the last 6 months`
              : 'Add income to see trends'
          }
          variant="b"
        />
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-neutral-900 dark:text-white text-lg tracking-tight mb-5 flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-white/10 border border-neutral-200/80 dark:border-white/10 text-neutral-700 dark:text-neutral-200">
            <ListOrdered size={18} strokeWidth={2} />
          </span>
          Summary
        </h3>
        <div className="space-y-3">
          {bullets.map((row, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed ${rowTone[row.tone]}`}
              dangerouslySetInnerHTML={{
                __html: row.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-neutral-900 dark:text-white font-semibold">$1</strong>'),
              }}
            />
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-neutral-900 dark:text-white text-lg tracking-tight mb-5">Month over month</h3>
        {lastMonth && currentMonth ? (
          <div className="space-y-6">
            {[
              { label: 'Income', cur: currentMonth.income, prev: lastMonth.income, strong: true },
              { label: 'Expenses', cur: currentMonth.expenses, prev: lastMonth.expenses, strong: false },
              {
                label: 'Net savings',
                cur: currentMonth.income - currentMonth.expenses,
                prev: lastMonth.income - lastMonth.expenses,
                strong: true,
              },
            ].map((row) => {
              const mom = getMonthOverMonthDisplay(row.cur, row.prev);
              const maxVal = Math.max(row.cur, row.prev, 1);
              const fill = row.strong ? barStrong : barMuted;
              return (
                <div key={row.label}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{row.label}</span>
                    <div className="flex items-center gap-2 sm:gap-3 text-sm flex-wrap">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {lastMonth.month}: {formatCurrency(row.prev, true)}
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {currentMonth.month}: {formatCurrency(row.cur, true)}
                      </span>
                      <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 tabular-nums">
                        {momDeltaLabel(mom)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 h-2">
                    <div className="flex-1 bg-neutral-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full opacity-40 dark:opacity-50 transition-all duration-300"
                        style={{ width: `${(row.prev / maxVal) * 100}%`, backgroundColor: fill }}
                      />
                    </div>
                    <div className="flex-1 bg-neutral-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${(row.cur / maxVal) * 100}%`, backgroundColor: fill }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-400 mt-1.5 font-medium">
                    <span>{lastMonth.month}</span>
                    <span>{currentMonth.month}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Add transactions to compare months.</p>
        )}
      </Card>
    </div>
  );
}
