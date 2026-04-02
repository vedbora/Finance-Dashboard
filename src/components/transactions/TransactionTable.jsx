import { useState } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Filter, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import Button from '../ui/Button';

function EmptyState({ short }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 text-lg text-neutral-400 dark:border-white/10 dark:bg-white/5">
        —
      </div>
      <p className="text-sm font-semibold text-neutral-900 dark:text-white">No transactions available</p>
      <p className="mt-1 max-w-sm text-xs text-neutral-500 dark:text-neutral-400">
        {short ? 'Adjust filters or clear search.' : 'Try a different search, or clear filters to see all transactions.'}
      </p>
    </div>
  );
}

export default function TransactionTable() {
  const { state, dispatch, filteredTransactions } = useApp();
  const [showFilters, setShowFilters] = useState(false);

  const toggleSort = (field) => {
    if (state.filters.sortBy === field) {
      dispatch({ type: 'SET_FILTER', payload: { sortDir: state.filters.sortDir === 'asc' ? 'desc' : 'asc' } });
    } else {
      dispatch({ type: 'SET_FILTER', payload: { sortBy: field, sortDir: 'desc' } });
    }
  };

  const SortIcon = ({ field }) => {
    if (state.filters.sortBy !== field) return <ArrowUpDown size={14} className="text-neutral-400" />;
    return state.filters.sortDir === 'asc' ? <ArrowUp size={14} className="text-neutral-900 dark:text-white" /> : <ArrowDown size={14} className="text-neutral-900 dark:text-white" />;
  };

  return (
    <Card isStatic className="overflow-hidden p-0">
      <div className="space-y-3 border-b border-neutral-200 p-6 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={state.filters.search}
              onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { search: e.target.value } })}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-4 text-sm text-neutral-900 transition-all duration-200 placeholder:text-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/10 dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:focus-visible:ring-white/15"
            />
          </div>
          <Button variant="secondary" size="md" onClick={() => setShowFilters(!showFilters)} className="gap-1.5">
            <Filter size={15} />
            Filters
            <ChevronDown size={14} className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2 pt-1 animate-slide-up">
            {['all', 'income', 'expense'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => dispatch({ type: 'SET_FILTER', payload: { type } })}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-all duration-200 ${
                  state.filters.type === type
                    ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-950'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 dark:bg-white/5 dark:text-neutral-400 dark:hover:bg-white/10'
                }`}
              >
                {type === 'all' ? 'All' : type === 'income' ? '↑ Income' : '↓ Expense'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-b border-neutral-200 px-6 py-3 text-xs text-neutral-500 dark:border-white/10 dark:text-neutral-400">
        Showing <span className="font-semibold text-neutral-800 dark:text-neutral-200">{filteredTransactions.length}</span>{' '}
        transactions
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50/90 dark:border-white/10 dark:bg-white/[0.03]">
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <button type="button" className="flex items-center gap-1.5 transition-colors duration-200 hover:text-neutral-900 dark:hover:text-white" onClick={() => toggleSort('date')}>
                  Date <SortIcon field="date" />
                </button>
              </th>
              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Description</th>
              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Category</th>
              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Type</th>
              <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <button type="button" className="ml-auto flex items-center gap-1.5 transition-colors duration-200 hover:text-neutral-900 dark:hover:text-white" onClick={() => toggleSort('amount')}>
                  Amount <SortIcon field="amount" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <EmptyState />
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn) => {
                const cat = CATEGORIES[txn.category] || { label: txn.category, icon: '📋' };
                return (
                  <tr
                    key={txn.id}
                    className="border-b border-neutral-100 transition-colors duration-200 hover:bg-neutral-50 dark:border-white/[0.06] dark:hover:bg-white/[0.04]"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-sm tabular-nums text-neutral-600 dark:text-neutral-400">{formatDate(txn.date)}</td>
                    <td className="px-4 py-4">
                      <p className="max-w-[200px] truncate text-sm font-medium text-neutral-900 dark:text-white">{txn.description}</p>
                      <p className="max-w-[200px] truncate text-xs text-neutral-500 dark:text-neutral-400">{txn.merchant}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200/60 bg-neutral-100 text-base dark:border-white/10 dark:bg-white/10">{cat.icon}</span>
                        <span className="font-medium">{cat.label}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge type={txn.type}>
                        {txn.type === 'income' ? '↑' : '↓'} {txn.type}
                      </Badge>
                    </td>
                    <td className={`px-6 py-4 text-right font-mono text-sm font-semibold tabular-nums ${txn.type === 'income' ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'}`}>
                      {txn.type === 'income' ? '+' : '−'}
                      {formatCurrency(txn.amount)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-neutral-200 dark:divide-white/10 md:hidden">
        {filteredTransactions.length === 0 ? (
          <EmptyState short />
        ) : (
          filteredTransactions.map((txn) => {
            const cat = CATEGORIES[txn.category] || { label: txn.category, icon: '📋' };
            return (
              <div
                key={txn.id}
                className="flex items-center gap-3 px-4 py-4 transition-colors duration-200 hover:bg-neutral-50 dark:hover:bg-white/[0.04]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200/60 bg-neutral-100 text-lg dark:border-white/10 dark:bg-white/10">{cat.icon}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">{txn.description}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {formatDate(txn.date)} · {cat.label}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className={`font-mono text-sm font-semibold tabular-nums ${txn.type === 'income' ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'}`}>
                    {txn.type === 'income' ? '+' : '−'}
                    {formatCurrency(txn.amount, true)}
                  </p>
                  <Badge type={txn.type} className="mt-1 text-[10px]">
                    {txn.type}
                  </Badge>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
