import { cn } from '../../lib/cn'
import BrandLogo from './BrandLogo'

export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink-300 bg-white px-8 py-16 text-center shadow-soft',
        className,
      )}
    >
      <BrandLogo size="xl" surface="soft" className="mb-5 !rounded-3xl" />
      {Icon && <Icon className="mb-3 size-5 text-ink-300" strokeWidth={1.5} />}
      <h3 className="text-base font-extrabold text-ink-800">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-400">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
