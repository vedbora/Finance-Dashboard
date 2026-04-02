import clsx from 'clsx';
import { LayoutDashboard, ArrowLeftRight, Lightbulb } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function MobileNav({ activePage, setActivePage }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-neutral-200/80 dark:border-white/10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md safe-bottom">
      <div className="flex">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActivePage(id)}
            className={clsx(
              'flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200',
              activePage === id
                ? 'text-neutral-900 dark:text-white'
                : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300',
            )}
          >
            <Icon size={20} strokeWidth={activePage === id ? 2.25 : 2} />
            <span className="text-[11px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
