import { BookMarked, GraduationCap } from 'lucide-react'
import { TYPE_META } from '../../data/programs/constants'
import { cn } from '../../lib/cn'

const ICONS = {
  program: GraduationCap,
  package: BookMarked,
}

export default function TypeSelector({ value, onChange, error }) {
  return (
    <div data-field-error={error ? 'true' : undefined}>
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-[0.16em] text-ink-400">النوع</p>
          <h3 className="mt-1 text-xl font-extrabold text-ink-900">ماذا تريد أن تنشئ؟</h3>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {Object.values(TYPE_META).map((type) => {
          const Icon = ICONS[type.id]
          const selected = value === type.id
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onChange(type.id)}
              className={cn(
                'group relative overflow-hidden rounded-3xl border p-5 text-start transition-all duration-200',
                selected
                  ? type.id === 'package'
                    ? 'border-accent-400 bg-accent-50 shadow-[0_0_0_3px_rgb(249_188_21/0.25)]'
                    : 'border-brand-400 bg-brand-50 shadow-[0_0_0_3px_rgb(43_62_158/0.18)]'
                  : 'border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50/60',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    'flex size-11 items-center justify-center rounded-2xl',
                    selected
                      ? type.id === 'package'
                        ? 'bg-accent-400 text-brand-950'
                        : 'bg-brand-500 text-accent-400'
                      : 'bg-ink-50 text-ink-500',
                  )}
                >
                  <Icon className="size-5" strokeWidth={2} />
                </span>
                {selected && (
                  <span className="text-[11px] font-bold text-brand-700">محدد</span>
                )}
              </div>
              <p className="mt-4 text-lg font-extrabold text-ink-900">{type.label}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{type.description}</p>
            </button>
          )
        })}
      </div>
      {error && <p className="mt-2 text-[11px] font-bold text-danger-700">{error}</p>}
    </div>
  )
}
