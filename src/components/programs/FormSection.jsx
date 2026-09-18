import { cn } from '../../lib/cn'

export function FormSection({ index, title, subtitle, children, className, action }) {
  return (
    <section className={cn('border-t border-ink-200 pt-8', className)}>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-4">
          {index != null && (
            <span className="mt-1 font-black tabular-nums tracking-[0.14em] text-ink-300">
              {String(index).padStart(2, '0')}
            </span>
          )}
          <div>
            <h3 className="text-lg font-extrabold text-ink-900">{title}</h3>
            {subtitle && <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-400">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

export function YesNoToggle({ label, value, onChange, yesLabel = 'نعم', noLabel = 'لا', hint }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <p className="text-xs font-bold text-ink-600">{label}</p>}
      <div className="inline-flex w-fit overflow-hidden rounded-2xl border border-ink-200 bg-white p-1 shadow-soft">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={cn(
            'h-9 min-w-[72px] rounded-xl px-4 text-sm font-bold transition-colors',
            value ? 'bg-brand-500 text-white shadow-brand' : 'text-ink-500 hover:bg-ink-50',
          )}
        >
          {yesLabel}
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            'h-9 min-w-[72px] rounded-xl px-4 text-sm font-bold transition-colors',
            !value ? 'bg-ink-900 text-white' : 'text-ink-500 hover:bg-ink-50',
          )}
        >
          {noLabel}
        </button>
      </div>
      {hint && <p className="text-[11px] text-ink-400">{hint}</p>}
    </div>
  )
}
