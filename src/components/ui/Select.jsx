import clsx from 'clsx';

export default function Select({ label, options, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>}
      <select
        className={clsx(
          'w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950',
          'text-neutral-900 dark:text-neutral-100',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/15 dark:focus-visible:ring-white/20',
          'transition-all duration-200 text-sm px-4 py-2.5 cursor-pointer',
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
