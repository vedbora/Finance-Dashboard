import { Plus, TrendingUp } from 'lucide-react';
import Button from '../ui/Button';
import RoleSwitcher from '../ui/RoleSwitcher';
import ThemeToggle from '../ui/ThemeToggle';
import { useApp } from '../../context/AppContext';

export default function TopBar({ activePage, onAddTransaction }) {
  const { state } = useApp();

  const pageTitles = {
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    insights: 'Insights',
  };

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200/80 dark:border-white/10 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <div className="lg:hidden w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <TrendingUp size={18} className="text-white dark:text-neutral-900" />
        </div>
        <div className="min-w-0">
          <h1 className="font-semibold text-neutral-900 dark:text-white text-lg tracking-tight truncate">{pageTitles[activePage]}</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap sm:justify-end">
        <RoleSwitcher />
        <ThemeToggle />
        {state.role === 'admin' && (
          <Button onClick={onAddTransaction} size="md" className="hidden sm:inline-flex">
            <Plus size={16} strokeWidth={2.5} />
            Add Transaction
          </Button>
        )}
        {state.role === 'admin' && (
          <Button onClick={onAddTransaction} size="sm" className="sm:hidden p-2.5 min-w-[2.5rem]">
            <Plus size={18} strokeWidth={2.5} />
          </Button>
        )}
      </div>
    </header>
  );
}
