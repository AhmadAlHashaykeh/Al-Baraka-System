import { cn } from '../../lib/cn'

export default function Input({
  label,
  hint,
  error,
  icon: Icon,
  id,
  className,
  inputClassName,
  ...props
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)} data-field-error={error ? 'true' : undefined}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold text-ink-600">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
        )}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          className={cn(
            'h-10 w-full rounded-2xl border bg-white text-sm text-ink-800 shadow-soft',
            'placeholder:text-ink-400 transition-all duration-200 disabled:bg-ink-50 disabled:text-ink-400',
            error
              ? 'border-danger-500 focus:border-danger-500 focus:shadow-[0_0_0_3px_rgb(229_72_61/0.15)] focus:outline-none'
              : 'border-ink-200 hover:border-ink-300 focus:border-brand-400 focus:shadow-[0_0_0_3px_rgb(43_62_158/0.15)] focus:outline-none',
            Icon ? 'ps-10 pe-4' : 'px-4',
            inputClassName,
          )}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-[11px] font-bold text-danger-700">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-ink-400">{hint}</p>
      ) : null}
    </div>
  )
}
