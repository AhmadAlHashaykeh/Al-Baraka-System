import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '../../lib/cn'

/**
 * Lightweight visual dropdown (select-style).
 * Supports controlled (value + onChange) or uncontrolled (defaultValue) usage.
 */
function normalize(option) {
  if (option && typeof option === 'object') {
    return { value: option.value, label: option.label }
  }
  return { value: option, label: option }
}

export default function Dropdown({
  label,
  options = [],
  defaultValue,
  value,
  onChange,
  size = 'md',
  className,
  placeholder = 'اختر…',
  error,
  disabled = false,
}) {
  const normalized = options.map(normalize)
  const isControlled = value !== undefined
  const [open, setOpen] = useState(false)
  const [internal, setInternal] = useState(defaultValue ?? normalized[0]?.value)
  const selected = isControlled ? value : internal
  const ref = useRef(null)
  const selectedOpt = normalized.find((o) => o.value === selected)
  const isEmpty = selected === undefined || selected === null || selected === ''
  const display = selectedOpt?.label ?? (isEmpty ? placeholder : selected)

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const choose = (optionValue) => {
    if (!isControlled) setInternal(optionValue)
    onChange?.(optionValue)
    setOpen(false)
  }

  return (
    <div
      ref={ref}
      data-field-error={error ? 'true' : undefined}
      className={cn('relative flex flex-col gap-1.5', open && 'z-[100]', className)}
    >
      {label && <span className="text-xs font-bold text-ink-600">{label}</span>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-invalid={error ? true : undefined}
        className={cn(
          'flex items-center justify-between gap-2 border bg-white font-medium shadow-soft transition-all duration-200',
          'disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400',
          size === 'sm'
            ? 'h-9 rounded-2xl px-3 text-xs'
            : 'h-10 rounded-2xl px-4 text-sm',
          error
            ? 'border-danger-500 text-ink-800'
            : open
              ? 'border-brand-400 text-ink-800 shadow-[0_0_0_3px_rgb(43_62_158/0.15)]'
              : 'border-ink-200 text-ink-700 hover:border-ink-300',
        )}
      >
        <span className={cn('truncate', isEmpty && 'text-ink-400')}>{display}</span>
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
          {normalized.map((option) => (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => choose(option.value)}
              className={cn(
                'flex w-full items-center justify-between transition-colors duration-150',
                size === 'sm'
                  ? 'rounded-lg px-2.5 py-1.5 text-[11px]'
                  : 'rounded-xl px-3 py-2 text-sm',
                option.value === selected
                  ? 'bg-brand-50 font-bold text-brand-800'
                  : 'text-ink-600 hover:bg-ink-100 hover:text-ink-800',
              )}
            >
              {option.label}
              {option.value === selected && <Check className="size-3.5 shrink-0 text-brand-600" />}
            </button>
          ))}
        </div>
      )}
      {error && <p className="text-[11px] font-bold text-danger-700">{error}</p>}
    </div>
  )
}
