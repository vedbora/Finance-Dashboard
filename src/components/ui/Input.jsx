import clsx from 'clsx';

export default function Input({ label, error, className, icon, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">{icon}</span>}
        <input
          className={clsx(
            'w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950',
            'text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/15 dark:focus-visible:ring-white/20',
            'transition-all duration-200 text-sm',
            icon ? 'pl-9 pr-4 py-2.5' : 'px-4 py-2.5',
            error && 'border-neutral-800 dark:border-white/30',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-neutral-600 dark:text-neutral-400">{error}</p>}
    </div>
  );
}
