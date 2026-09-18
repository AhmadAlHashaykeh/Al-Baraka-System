import Badge from '../ui/Badge'
import { STATUS_META, TYPE_META } from '../../data/programs/constants'

export function StatusBadge({ status }) {
  const meta = STATUS_META[status]
  return <Badge variant={meta?.variant ?? 'neutral'}>{meta?.label ?? status}</Badge>
}

export function TypeBadge({ type }) {
  const meta = TYPE_META[type]
  return (
    <Badge variant={type === 'package' ? 'accent' : 'brand'}>{meta?.label ?? type}</Badge>
  )
}
