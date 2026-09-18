import { cn } from '../../lib/cn'

export default function Table({ className, fit = false, children }) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className={cn('w-full border-collapse text-start', !fit && 'min-w-max')}>{children}</table>
    </div>
  )
}

export function THead({ children }) {
  return <thead className="border-b border-ink-100">{children}</thead>
}

export function TBody({ children }) {
  return <tbody className="divide-y divide-ink-50">{children}</tbody>
}

export function TR({ className, hover = true, children }) {
  return (
    <tr className={cn(hover && 'transition-colors duration-150 hover:bg-ink-50/80', className)}>
      {children}
    </tr>
  )
}

export function TH({ className, children }) {
  return (
    <th
      className={cn(
        'whitespace-nowrap px-6 py-3.5 text-start text-[11px] font-bold text-ink-400',
        className,
      )}
    >
      {children}
    </th>
  )
}

export function TD({ className, children }) {
  return (
    <td className={cn('whitespace-nowrap px-6 py-4 text-start text-sm text-ink-700', className)}>
      {children}
    </td>
  )
}
