import { Pencil, Search } from 'lucide-react'
import { cn } from '../../lib/cn'
import Card from '../ui/Card'
import Table, { TBody, TD, TH, THead, TR } from '../ui/Table'

export function DeptPageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-ink-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function SearchField({ value, onChange, placeholder, compact = false }) {
  return (
    <div className={cn('relative', compact ? 'w-40 sm:w-52' : 'max-w-md flex-1')}>
      <Search
        className={cn(
          'pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-ink-400',
          compact ? 'size-3.5' : 'size-4',
        )}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full border border-ink-200 text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none',
          compact
            ? 'h-9 rounded-full bg-ink-50 pe-3 ps-9 text-xs focus:bg-white'
            : 'h-10 rounded-2xl bg-white pe-3 ps-10 text-sm shadow-soft hover:border-ink-300',
        )}
      />
    </div>
  )
}

export function DataTableCard({ title, subtitle, toolbar, footer, empty, children }) {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-6 py-4">
        <div>
          {title && <h3 className="text-base font-extrabold text-ink-900">{title}</h3>}
          {subtitle && <p className="mt-0.5 text-xs text-ink-400">{subtitle}</p>}
        </div>
        {toolbar && <div className="flex flex-wrap items-center gap-2">{toolbar}</div>}
      </div>
      {empty || children}
      {footer && (
        <div className="flex items-center justify-between border-t border-ink-100 px-6 py-3.5">
          {footer}
        </div>
      )}
    </Card>
  )
}

export function TableActions({ onView, onEdit }) {
  return (
    <div className="flex items-center justify-end gap-1">
      {onView && (
        <button
          type="button"
          onClick={onView}
          className="h-8 rounded-xl px-2.5 text-xs font-bold text-brand-700 hover:bg-brand-50"
        >
          عرض
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-8 items-center gap-1 rounded-xl px-2.5 text-xs font-bold text-ink-600 hover:bg-ink-100"
        >
          <Pencil className="size-3.5" />
          تعديل
        </button>
      )}
    </div>
  )
}

export function KeyValueTable({ rows = [] }) {
  return (
    <Table fit>
      <THead>
        <TR hover={false}>
          <TH>البيان</TH>
          <TH>القيمة</TH>
        </TR>
      </THead>
      <TBody>
        {rows.map((row) => (
          <TR key={row.label}>
            <TD className="w-[36%] align-top text-ink-500">{row.label}</TD>
            <TD className="whitespace-normal font-bold text-ink-900">{row.value ?? '—'}</TD>
          </TR>
        ))}
      </TBody>
    </Table>
  )
}

export function NameCell({ name, hint, onClick }) {
  const initial = String(name || '—').slice(0, 1)
  const content = (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
        {initial}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-bold text-ink-900">{name}</span>
        {hint && <span className="mt-0.5 block truncate text-[11px] text-ink-400">{hint}</span>}
      </span>
    </div>
  )

  if (!onClick) return content
  return (
    <button type="button" onClick={onClick} className="max-w-[280px] text-start">
      {content}
    </button>
  )
}
