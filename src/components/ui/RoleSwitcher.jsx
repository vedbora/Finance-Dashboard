import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { ChevronDown, Eye, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ROLES = [
  { value: 'viewer', label: 'Viewer', description: 'Read-only', icon: Eye },
  { value: 'admin', label: 'Admin', description: 'Full access', icon: Shield },
];

export default function RoleSwitcher() {
  const { state, dispatch } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const active = ROLES.find((r) => r.value === state.role) ?? ROLES[0];
  const ActiveIcon = active.icon;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          'flex min-w-[140px] items-center gap-2 rounded-xl border border-neutral-200 bg-white py-2 pl-3 pr-2.5 text-left shadow-lg shadow-neutral-900/[0.05] transition-all duration-200 dark:border-white/10 dark:bg-neutral-900 dark:shadow-black/40',
          'hover:border-neutral-300 hover:shadow-md dark:hover:border-white/15',
          open && 'border-neutral-400 ring-2 ring-neutral-900/5 dark:border-white/20 dark:ring-white/10',
        )}
      >
        <ActiveIcon size={16} className="shrink-0 text-neutral-500 dark:text-neutral-400" />
        <span className="flex-1 truncate text-sm font-semibold text-neutral-900 dark:text-white">{active.label}</span>
        <ChevronDown size={16} className={clsx('shrink-0 text-neutral-400 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      <div
        role="listbox"
        className={clsx(
          'absolute right-0 top-full z-40 mt-2 w-[min(100vw-2rem,280px)] origin-top-right overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-white/10 dark:bg-neutral-900 dark:shadow-black/40',
          'transition-all duration-200 ease-out',
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-[0.98] opacity-0',
        )}
      >
        <p className="px-4 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Switch role
        </p>
        <div className="p-1.5 pt-0">
          {ROLES.map(({ value, label, description, icon: Icon }) => {
            const selected = state.role === value;
            return (
              <button
                key={value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  dispatch({ type: 'SET_ROLE', payload: value });
                  setOpen(false);
                }}
                className={clsx(
                  'flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-200',
                  selected
                    ? 'border border-neutral-200 bg-neutral-100 text-neutral-900 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white'
                    : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-white/[0.06]',
                )}
              >
                <Icon size={18} className={clsx('mt-0.5 shrink-0', selected ? 'text-neutral-900 dark:text-white' : 'text-neutral-400')} />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="mt-0.5 block text-xs text-neutral-500 dark:text-neutral-500">{description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
