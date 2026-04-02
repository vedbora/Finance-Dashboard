import clsx from 'clsx';

export default function Badge({ type, children, className }) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide',
      type === 'income' && 'bg-neutral-100 text-neutral-800 dark:bg-white/10 dark:text-neutral-200',
      type === 'expense' && 'bg-neutral-200/80 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200',
      className
    )}>
      {children}
    </span>
  );
}
