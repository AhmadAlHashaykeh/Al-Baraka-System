import { cn } from '../../lib/cn'

const variants = {
  primary:
    'bg-brand-500 text-white shadow-brand hover:bg-brand-600 active:bg-brand-700',
  secondary:
    'bg-accent-50 text-brand-800 border border-accent-200 hover:bg-accent-100',
  outline:
    'bg-white text-ink-700 border border-ink-200 shadow-soft hover:border-ink-300 hover:bg-ink-50',
  ghost:
    'bg-transparent text-ink-600 hover:bg-ink-100 hover:text-ink-900',
  danger:
    'bg-danger-500 text-white hover:bg-danger-700',
  dark:
    'bg-ink-900 text-white hover:bg-ink-800',
  accent:
    'bg-accent-400 text-brand-950 shadow-accent hover:bg-accent-500 active:bg-accent-600',
}

const sizes = {
  sm: 'h-9 px-3.5 text-xs gap-1.5 rounded-2xl',
  md: 'h-10 px-5 text-sm gap-2 rounded-2xl',
  lg: 'h-11 px-6 text-[15px] gap-2.5 rounded-2xl',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconEnd: IconEnd,
  className,
  children,
  ...props
}) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex select-none items-center justify-center font-bold transition-all duration-200',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="size-4 shrink-0" strokeWidth={2.25} />}
      {children}
      {IconEnd && <IconEnd className="size-4 shrink-0" strokeWidth={2.25} />}
    </button>
  )
}

export function IconButton({ icon: Icon, label, className, active, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-full border transition-all duration-200',
        active
          ? 'border-brand-200 bg-brand-50 text-brand-700'
          : 'border-ink-200 bg-white text-ink-500 shadow-soft hover:border-ink-300 hover:text-ink-800',
        className,
      )}
      {...props}
    >
      <Icon className="size-[18px]" strokeWidth={1.75} />
    </button>
  )
}
