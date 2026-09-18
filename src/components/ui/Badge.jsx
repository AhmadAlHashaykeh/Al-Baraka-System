import { cn } from '../../lib/cn'

const variants = {
  brand: 'bg-brand-500/10 text-brand-800',
  accent: 'bg-accent-400/15 text-brand-900',
  success: 'bg-success-500/10 text-success-700',
  danger: 'bg-danger-500/10 text-danger-700',
  info: 'bg-info-500/10 text-info-700',
  neutral: 'bg-ink-100 text-ink-600',
}

const iconTone = {
  brand: 'text-brand-600',
  accent: 'text-accent-600',
  success: 'text-success-700',
  danger: 'text-danger-700',
  info: 'text-info-700',
  neutral: 'text-ink-500',
}

/**
 * Status / label chip — icon + text.
 */
export default function Badge({ variant = 'neutral', icon: Icon, className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[12px] font-semibold',
        variants[variant] ?? variants.neutral,
        className,
      )}
    >
      {Icon && (
        <Icon
          className={cn('size-3.5 shrink-0', iconTone[variant] ?? iconTone.neutral)}
          strokeWidth={2.25}
        />
      )}
      {children}
    </span>
  )
}
