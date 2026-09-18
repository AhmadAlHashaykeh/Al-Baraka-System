export function formatMoney(value, { empty = '—' } = {}) {
  if (value === '' || value === null || value === undefined) return empty
  const n = Number(value)
  if (!Number.isFinite(n)) return empty
  return `${n.toLocaleString('en-US')} د.أ`
}

export function formatDate(iso, { empty = '—' } = {}) {
  if (!iso) return empty
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return empty
  return d.toLocaleDateString('ar-JO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(iso, { empty = '—' } = {}) {
  if (!iso) return empty
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return empty
  return d.toLocaleString('ar-JO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function padIndex(index) {
  return String(index + 1).padStart(2, '0')
}
