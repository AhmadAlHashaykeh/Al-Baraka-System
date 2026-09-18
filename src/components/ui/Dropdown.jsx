import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '../../lib/cn'

/**
 * Lightweight visual dropdown (select-style).
 * Supports controlled (value + onChange) or uncontrolled (defaultValue) usage.
 */
export default function Dropdown({
  label,
  options = [],
  defaultValue,
  value,
  onChange,
  size = 'md',
  className,
}) {
  const isControlled = value !== undefined
  const [open, setOpen] = useState(false)
  const [internal, setInternal] = useState(defaultValue ?? options[0])
  const selected = isControlled ? value : internal
  const ref = useRef(null)

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const choose = (option) => {
    if (!isControlled) setInternal(option)
    onChange?.(option)
    setOpen(false)
  }

  return (
    <div
      ref={ref}
      className={cn('relative flex flex-col gap-1.5', open && 'z-[100]', className)}
    >
      {label && <span className="text-xs font-bold text-ink-600">{label}</span>}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center justify-between gap-2 border bg-white font-medium shadow-soft transition-all duration-200',
          size === 'sm'
            ? 'h-9 rounded-2xl px-3 text-xs'
            : 'h-10 rounded-2xl px-4 text-sm',
          open
            ? 'border-brand-400 text-ink-800 shadow-[0_0_0_3px_rgb(43_62_158/0.15)]'
            : 'border-ink-200 text-ink-700 hover:border-ink-300',
        )}
      >
        <span className="truncate">{selected}</span>
        <ChevronDown
          className={cn(
            'shrink-0 text-ink-400 transition-transform duration-200',
            size === 'sm' ? 'size-3.5' : 'size-4',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            'absolute top-full z-[100] mt-1.5 w-full min-w-44 overflow-hidden border border-ink-200 bg-white shadow-pop',
            size === 'sm' ? 'rounded-xl p-1' : 'rounded-2xl p-1.5',
          )}
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => choose(option)}
              className={cn(
                'flex w-full items-center justify-between transition-colors duration-150',
                size === 'sm'
                  ? 'rounded-lg px-2.5 py-1.5 text-[11px]'
                  : 'rounded-xl px-3 py-2 text-sm',
                option === selected
                  ? 'bg-brand-50 font-bold text-brand-800'
                  : 'text-ink-600 hover:bg-ink-100 hover:text-ink-800',
              )}
            >
              {option}
              {option === selected && <Check className="size-3.5 shrink-0 text-brand-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
