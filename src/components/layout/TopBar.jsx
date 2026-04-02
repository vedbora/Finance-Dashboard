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
    <header className="sticky top-0 z-20 border-b border-neutral-200/90 bg-white/90 px-4 py-4 backdrop-blur-md dark:border-white/10 dark:bg-neutral-950/90 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 shadow-sm dark:bg-white lg:hidden">
            <TrendingUp size={18} className="text-white dark:text-neutral-900" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">{pageTitles[activePage]}</h1>
            <p className="mt-0.5 hidden text-xs text-neutral-500 dark:text-neutral-400 sm:block">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <RoleSwitcher />
          <ThemeToggle />
          {state.role === 'admin' && (
            <Button onClick={onAddTransaction} size="md" className="hidden sm:inline-flex">
              <Plus size={16} strokeWidth={2.5} />
              Add Transaction
            </Button>
          )}
          {state.role === 'admin' && (
            <Button onClick={onAddTransaction} size="sm" className="min-w-[2.5rem] p-2.5 sm:hidden">
              <Plus size={18} strokeWidth={2.5} />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
