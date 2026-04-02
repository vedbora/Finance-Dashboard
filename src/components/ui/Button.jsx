import clsx from 'clsx';

export default function Button({ children, variant = 'primary', size = 'md', className, disabled, onClick, type = 'button' }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950',
        size === 'sm' && 'px-3 py-2 text-sm',
        size === 'md' && 'px-4 py-2.5 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        variant === 'primary' &&
          clsx(
            'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-950',
            'hover:bg-neutral-800 hover:shadow-md dark:hover:bg-neutral-200',
            'active:scale-[0.98] disabled:active:scale-100',
          ),
        variant === 'secondary' &&
          clsx(
            'border border-neutral-200/80 bg-neutral-100 text-neutral-900 dark:border-white/10 dark:bg-white/10 dark:text-white',
            'hover:bg-neutral-200/90 dark:hover:bg-white/15',
          ),
        variant === 'ghost' && 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5',
        variant === 'danger' &&
          clsx('bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900', 'hover:opacity-90'),
        disabled && 'cursor-not-allowed opacity-45',
        className,
      )}
    >
      {children}
    </button>
  );
}
