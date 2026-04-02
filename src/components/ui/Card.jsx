import clsx from 'clsx';

export default function Card({ children, className, isStatic = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'h-full rounded-2xl border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-neutral-900',
        'shadow-lg shadow-neutral-900/[0.06] dark:shadow-black/50',
        'transition-all duration-200',
        !isStatic &&
          'hover:scale-[1.02] hover:shadow-xl hover:shadow-neutral-900/[0.08] dark:hover:shadow-black/60',
        onClick && 'cursor-pointer active:scale-[0.99]',
        className,
      )}
    >
      {children}
    </div>
  );
}
