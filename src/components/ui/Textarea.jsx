import { cn } from '../../lib/cn'

export default function Textarea({
  label,
  hint,
  error,
  id,
  className,
  inputClassName,
  rows = 3,
  ...props
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)} data-field-error={error ? 'true' : undefined}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold text-ink-600">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        className={cn(
          'w-full resize-y rounded-2xl border bg-white px-4 py-2.5 text-sm text-ink-800 shadow-soft',
          'placeholder:text-ink-400 transition-all duration-200 disabled:bg-ink-50 disabled:text-ink-400',
          error
            ? 'border-danger-500 focus:border-danger-500 focus:shadow-[0_0_0_3px_rgb(229_72_61/0.15)] focus:outline-none'
            : 'border-ink-200 hover:border-ink-300 focus:border-brand-400 focus:shadow-[0_0_0_3px_rgb(43_62_158/0.15)] focus:outline-none',
          inputClassName,
        )}
        {...props}
      />
      {error ? (
        <p className="text-[11px] font-bold text-danger-700">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-ink-400">{hint}</p>
      ) : null}
    </div>
  )
}
