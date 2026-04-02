import { useState } from 'react';
import clsx from 'clsx';
import { LayoutDashboard, ArrowLeftRight, Lightbulb, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar({ activePage, setActivePage }) {
  const [collapsed, setCollapsed] = useState(false);
  const { state } = useApp();

  return (
    <aside className={clsx(
      'hidden lg:flex flex-col bg-neutral-950 text-white transition-all duration-300 relative border-r border-white/10',
      collapsed ? 'w-[4.25rem]' : 'w-60'
    )}>
      <div className={clsx('flex items-center gap-3 px-4 py-6 border-b border-white/10', collapsed && 'justify-center px-2')}>
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <TrendingUp size={18} className="text-neutral-900" />
        </div>
        {!collapsed && <span className="font-semibold text-lg tracking-tight text-white">FinFlow</span>}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-0.5">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            className={clsx(
              'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200',
              activePage === id
                ? 'bg-white text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:bg-white/5 hover:text-white',
              collapsed && 'justify-center px-2'
            )}
          >
            <Icon size={18} className="flex-shrink-0" strokeWidth={2} />
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
          </button>
        ))}
      </nav>

      {!collapsed && (
        <div className="px-4 pb-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 mb-1">Current role</p>
            <p className="text-sm font-semibold text-white capitalize">
              {state.role}
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center hover:bg-neutral-700 transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} className="text-neutral-300" /> : <ChevronLeft size={12} className="text-neutral-300" />}
      </button>
    </aside>
  );
}
