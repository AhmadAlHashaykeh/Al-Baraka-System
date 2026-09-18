import { cn } from '../../lib/cn'

export default function Card({ className, hover = false, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-ink-200/60 bg-white shadow-soft',
        hover &&
          'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, title, subtitle, action, children }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 px-6 pt-5 pb-1', className)}>
      <div>
        {title && <h3 className="text-base font-extrabold text-ink-900">{title}</h3>}
        {subtitle && <p className="mt-0.5 text-xs text-ink-400">{subtitle}</p>}
        {children}
      </div>
      {action}
    </div>
  )
}

export function CardBody({ className, children }) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}

export function CardFooter({ className, children }) {
  return (
    <div className={cn('border-t border-ink-100 px-6 py-3.5', className)}>{children}</div>
  )
}
