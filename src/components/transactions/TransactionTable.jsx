import { useState } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Filter, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import Button from '../ui/Button';

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
    <Card className="animate-fade-in overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-neutral-200/80 dark:border-white/10 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={state.filters.search}
              onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { search: e.target.value } })}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/10 dark:focus-visible:ring-white/15 transition-all duration-200"
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
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all duration-200 ${
                  state.filters.type === type
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                    : 'bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/80 dark:hover:bg-white/10'
                }`}
              >
                {type === 'all' ? 'All' : type === 'income' ? '↑ Income' : '↓ Expense'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 sm:px-6 py-2.5 text-xs text-neutral-500 dark:text-neutral-400 border-b border-neutral-200/80 dark:border-white/10">
        Showing <span className="font-semibold text-neutral-800 dark:text-neutral-200">{filteredTransactions.length}</span> transactions
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200/80 dark:border-white/10">
              <th className="text-left px-4 sm:px-6 py-3.5 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <button type="button" className="flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200" onClick={() => toggleSort('date')}>
                  Date <SortIcon field="date" />
                </button>
              </th>
              <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Description</th>
              <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Category</th>
              <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Type</th>
              <th className="text-right px-4 sm:px-6 py-3.5 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <button type="button" className="flex items-center gap-1.5 ml-auto hover:text-neutral-900 dark:hover:text-white transition-colors duration-200" onClick={() => toggleSort('amount')}>
                  Amount <SortIcon field="amount" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-20 px-4">
                  <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-white/10 border border-neutral-200/80 dark:border-white/10 flex items-center justify-center text-xl">⌕</div>
                    <p className="font-semibold text-neutral-900 dark:text-white">No transactions found</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">Try adjusting your search or filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn, i) => {
                const cat = CATEGORIES[txn.category] || { label: txn.category, icon: '📋' };
                return (
                  <tr
                    key={txn.id}
                    className="border-b border-neutral-100 dark:border-white/[0.06] hover:bg-neutral-50/80 dark:hover:bg-white/[0.03] transition-colors duration-150"
                    style={{ animationDelay: `${i * 20}ms` }}
                  >
                    <td className="px-4 sm:px-6 py-3.5 text-sm text-neutral-600 dark:text-neutral-400 font-mono whitespace-nowrap tabular-nums">
                      {formatDate(txn.date)}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white truncate max-w-[200px]">{txn.description}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[200px]">{txn.merchant}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                        <span className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-white/10 flex items-center justify-center text-base border border-neutral-200/60 dark:border-white/10">{cat.icon}</span>
                        <span className="font-medium">{cat.label}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge type={txn.type}>
                        {txn.type === 'income' ? '↑' : '↓'} {txn.type}
                      </Badge>
                    </td>
                    <td className={`px-4 sm:px-6 py-3.5 text-right font-semibold font-mono text-sm tabular-nums ${txn.type === 'income' ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'}`}>
                      {txn.type === 'income' ? '+' : '−'}{formatCurrency(txn.amount)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-neutral-200/80 dark:divide-white/10">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 px-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-white/10 flex items-center justify-center text-xl border border-neutral-200/80 dark:border-white/10">⌕</div>
            <p className="font-semibold text-neutral-900 dark:text-white">No transactions found</p>
            <p className="text-sm text-neutral-500 text-center">Try adjusting filters.</p>
          </div>
        ) : (
          filteredTransactions.map((txn) => {
            const cat = CATEGORIES[txn.category] || { label: txn.category, icon: '📋' };
            return (
              <div key={txn.id} className="flex items-center gap-3 px-4 py-4 hover:bg-neutral-50/80 dark:hover:bg-white/[0.03] transition-colors duration-150">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-neutral-100 dark:bg-white/10 border border-neutral-200/60 dark:border-white/10">
                  {cat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{txn.description}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatDate(txn.date)} · {cat.label}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-semibold font-mono tabular-nums ${txn.type === 'income' ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'}`}>
                    {txn.type === 'income' ? '+' : '−'}{formatCurrency(txn.amount, true)}
                  </p>
                  <Badge type={txn.type} className="mt-1 text-[10px]">{txn.type}</Badge>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
