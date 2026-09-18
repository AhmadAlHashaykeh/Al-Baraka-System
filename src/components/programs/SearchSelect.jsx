import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Plus, Search } from 'lucide-react'
import { cn } from '../../lib/cn'

export default function SearchSelect({
  label,
  items = [],
  value,
  onChange,
  placeholder = 'ابحث…',
  getId = (item) => item.id,
  getLabel = (item) => item.name,
  getMeta,
  getGroup,
  onCreate,
  createLabel = (query) => `إضافة «${query}»`,
  error,
  emptyText = 'لا توجد نتائج',
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef(null)
  const selected = items.find((item) => getId(item) === value) ?? null

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim()
    if (!q) return items
    return items.filter((item) => {
      const hay = `${getLabel(item)} ${getMeta?.(item) ?? ''}`.toLowerCase()
      return hay.includes(q.toLowerCase())
    })
  }, [items, query, getLabel, getMeta])

  const groups = useMemo(() => {
    if (!getGroup) return [{ key: '_', label: null, items: filtered }]
    const map = new Map()
    for (const item of filtered) {
      const group = getGroup(item) || 'أخرى'
      if (!map.has(group)) map.set(group, [])
      map.get(group).push(item)
    }
    return [...map.entries()].map(([label, groupItems]) => ({
      key: label,
      label,
      items: groupItems,
    }))
  }, [filtered, getGroup])

  const choose = (item) => {
    onChange?.(getId(item), item)
    setQuery('')
    setOpen(false)
  }

  const create = () => {
    onCreate?.(query.trim())
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative" data-field-error={error ? 'true' : undefined}>
      {label && <p className="mb-1.5 text-xs font-bold text-ink-600">{label}</p>}
      <div
        className={cn(
          'flex h-10 items-center gap-2 rounded-2xl border bg-white px-3 shadow-soft transition-all',
          error
            ? 'border-danger-500'
            : open
              ? 'border-brand-400 shadow-[0_0_0_3px_rgb(43_62_158/0.15)]'
              : 'border-ink-200 hover:border-ink-300',
        )}
      >
        <Search className="size-4 shrink-0 text-ink-400" />
        <input
          value={open ? query : selected ? getLabel(selected) : query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (!open) setOpen(true)
          }}
          onFocus={() => {
            setOpen(true)
            setQuery('')
          }}
          placeholder={selected ? getLabel(selected) : placeholder}
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none"
        />
        {selected && !open && (
          <button
            type="button"
            onClick={() => onChange?.('', null)}
            className="text-[11px] font-bold text-ink-400 hover:text-ink-700"
          >
            مسح
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-[80] mt-1.5 max-h-72 w-full overflow-y-auto rounded-2xl border border-ink-200 bg-white p-1.5 shadow-pop">
          {groups.map((group) => (
            <div key={group.key}>
              {group.label && (
                <p className="px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-ink-400">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => {
                const id = getId(item)
                const active = id === value
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => choose(item)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-start text-sm transition-colors',
                      active
                        ? 'bg-brand-50 font-bold text-brand-800'
                        : 'text-ink-700 hover:bg-ink-50',
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate">{getLabel(item)}</span>
                      {getMeta?.(item) && (
                        <span className="mt-0.5 block truncate text-[11px] font-medium text-ink-400">
                          {getMeta(item)}
                        </span>
                      )}
                    </span>
                    {active && <Check className="size-3.5 shrink-0 text-brand-600" />}
                  </button>
                )
              })}
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="px-3 py-3 text-sm text-ink-400">{emptyText}</p>
          )}

          {onCreate && query.trim() && (
            <button
              type="button"
              onClick={create}
              className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-start text-sm font-bold text-brand-700 hover:bg-brand-50"
            >
              <Plus className="size-4" />
              {createLabel(query.trim())}
            </button>
          )}
        </div>
      )}
      {error && <p className="mt-1.5 text-[11px] font-bold text-danger-700">{error}</p>}
    </div>
  )
}
