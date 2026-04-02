import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { ChevronDown, Eye, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ROLES = [
  { value: 'viewer', label: 'Viewer', description: 'Read-only access', icon: Eye },
  { value: 'admin', label: 'Admin', description: 'Full access', icon: Shield },
];

export default function RoleSwitcher() {
  const { state, dispatch } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const active = ROLES.find((r) => r.value === state.role) || ROLES[0];
  const ActiveIcon = active.icon;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          'flex items-center gap-2 pl-3 pr-2.5 py-2 rounded-xl border transition-all duration-200',
          'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/10',
          'shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-white/15',
          'text-left min-w-[140px] sm:min-w-[160px]',
          open && 'ring-2 ring-black/5 dark:ring-white/10 border-neutral-300 dark:border-white/15',
        )}
      >
        <ActiveIcon size={16} className="text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
        <span className="flex-1 text-sm font-medium text-neutral-900 dark:text-white truncate">{active.label}</span>
        <ChevronDown
          size={16}
          className={clsx('text-neutral-400 transition-transform duration-200 flex-shrink-0', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          className={clsx(
            'absolute right-0 top-full mt-2 w-[min(100vw-2rem,280px)] rounded-2xl border z-40 overflow-hidden',
            'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/10',
            'shadow-lg shadow-black/5 dark:shadow-black/40 animate-slide-up',
          )}
        >
          <p className="px-4 pt-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Switch Role
          </p>
          <div className="p-1.5 pt-0">
            {ROLES.map(({ value, label, description, icon: Icon }) => {
              const selected = state.role === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'SET_ROLE', payload: value });
                    setOpen(false);
                  }}
                  className={clsx(
                    'w-full flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200',
                    selected
                      ? 'bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5',
                  )}
                >
                  <Icon size={18} className={clsx('mt-0.5 flex-shrink-0', selected ? 'text-neutral-900 dark:text-white' : 'text-neutral-400')} />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="block text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">{description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
