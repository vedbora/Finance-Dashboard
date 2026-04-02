import clsx from 'clsx';
import { Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ThemeToggle() {
  const { state, dispatch } = useApp();
  const dark = state.darkMode;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => dispatch({ type: 'TOGGLE_DARK' })}
      className={clsx(
        'relative h-9 w-[3.25rem] rounded-full border transition-all duration-300 ease-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950',
        dark
          ? 'bg-neutral-800 border-white/10 shadow-inner'
          : 'bg-neutral-100 border-neutral-200 shadow-sm',
      )}
    >
      <span
        className={clsx(
          'absolute top-1 flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300 ease-out',
          'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-white/10 shadow-sm',
          dark ? 'left-[calc(100%-1.75rem-0.25rem)]' : 'left-1',
        )}
      >
        {dark ? (
          <Moon size={14} className="text-neutral-300" strokeWidth={2} />
        ) : (
          <Sun size={14} className="text-neutral-700" strokeWidth={2} />
        )}
      </span>
      <span className="sr-only">{dark ? 'Dark' : 'Light'} mode</span>
    </button>
  );
}
