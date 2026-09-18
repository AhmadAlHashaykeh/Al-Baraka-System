export function sumExpenses(expenses = []) {
  return expenses.reduce((sum, row) => sum + (Number(row.amount) || 0), 0)
}

export function sumSubjectPrices(subjects = []) {
  return subjects.reduce((sum, row) => sum + (Number(row.price) || 0), 0)
}

export function expectedRevenue(itemOrForm) {
  const type = itemOrForm.type
  if (type === 'package') return sumSubjectPrices(itemOrForm.subjects)
  const price = Number(itemOrForm.basePrice) || 0
  const seats = Math.max(Number(itemOrForm.enrollmentsCount) || 0, 1)
  return price * seats
}

export function estimatedProfit(revenue, expensesTotal) {
  return revenue - expensesTotal
}

export function partnerShareAmount({
  hasPartner,
  shareType,
  sharePercent,
  revenue,
  profit,
}) {
  if (!hasPartner) return 0
  const percent = Number(sharePercent) || 0
  const base = shareType === 'profit' ? Math.max(profit, 0) : revenue
  return (base * percent) / 100
}

export function centerNet({ shareType, revenue, expensesTotal, partnerAmount }) {
  if (shareType === 'profit') {
    return estimatedProfit(revenue, expensesTotal) - partnerAmount
  }
  return revenue - partnerAmount - expensesTotal
}

export function programFinancials(itemOrForm) {
  const revenue = expectedRevenue(itemOrForm)
  const expensesTotal = sumExpenses(itemOrForm.expenses)
  const profit = estimatedProfit(revenue, expensesTotal)
  const hasPartner = Boolean(itemOrForm.hasPartner)
  const shareType = itemOrForm.partnerShareType || 'revenue'
  const partnerAmount = partnerShareAmount({
    hasPartner,
    shareType,
    sharePercent: itemOrForm.partnerSharePercent,
    revenue,
    profit,
  })
  const net = hasPartner
    ? centerNet({ shareType, revenue, expensesTotal, partnerAmount })
    : profit

  return {
    revenue,
    expensesTotal,
    profit,
    partnerAmount,
    net,
    shareType,
    seatsBasis: Math.max(Number(itemOrForm.enrollmentsCount) || 0, 1),
    enrollmentsCount: Number(itemOrForm.enrollmentsCount) || 0,
  }
}

export function packageFinancials(itemOrForm) {
  const subjects = itemOrForm.subjects || []
  const total = sumSubjectPrices(subjects)
  const externalCost = subjects.reduce((sum, row) => {
    if (row.teacherKind !== 'external') return sum
    const pct = Number(row.sharePercent) || 0
    const price = Number(row.price) || 0
    return sum + (price * pct) / 100
  }, 0)

  return {
    subjectCount: subjects.length,
    total,
    externalCost,
    centerKeep: total - externalCost,
  }
}

export function itemPrice(item) {
  if (!item) return 0
  if (item.type === 'package') return sumSubjectPrices(item.subjects)
  return Number(item.basePrice) || 0
}
