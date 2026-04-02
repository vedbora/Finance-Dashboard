import clsx from 'clsx';

export default function Card({ children, className, hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-white/10',
        'shadow-card transition-all duration-200',
        hover && 'cursor-pointer hover:shadow-card-hover hover:border-neutral-300 dark:hover:border-white/15 active:scale-[0.998]',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
