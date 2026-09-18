import { SHARE_TYPES } from '../../data/programs/constants'
import { formatMoney } from '../../lib/format'
import { KeyValueTable } from './DeptChrome'

export function ProgramSummary({ financials, hasPartner, shareType, sharePercent }) {
  if (!financials) return null
  const shareMeta = SHARE_TYPES[shareType] || SHARE_TYPES.revenue
  const previewSeats = financials.enrollmentsCount === 0
  const rows = [
    {
      label: 'الإيراد المتوقع',
      value: `${formatMoney(financials.revenue)}${
        previewSeats ? ' · معاينة لمقعد واحد' : ` · ${financials.seatsBasis} مسجّل`
      }`,
    },
    { label: 'إجمالي المصاريف', value: formatMoney(financials.expensesTotal) },
    { label: 'الربح التقديري', value: formatMoney(financials.profit) },
  ]
  if (hasPartner) {
    rows.push({
      label: `حصة الشريك (${sharePercent || 0}٪ ${shareMeta.label})`,
      value: formatMoney(financials.partnerAmount),
    })
  }
  rows.push({ label: 'صافي المركز', value: formatMoney(financials.net) })
  return <KeyValueTable rows={rows} />
}

export function PackageSummary({ financials }) {
  if (!financials) return null
  return (
    <KeyValueTable
      rows={[
        { label: 'عدد المواد', value: String(financials.subjectCount) },
        { label: 'مجموع أسعار المواد', value: formatMoney(financials.total) },
        { label: 'حصص المعلمين الخارجيين', value: formatMoney(financials.externalCost) },
        { label: 'سعر الحقيبة النهائي', value: formatMoney(financials.total) },
      ]}
    />
  )
}

export default function FinancialSummary({ form, financials }) {
  return (
    <aside className="overflow-hidden rounded-3xl border border-ink-200/60 bg-white shadow-soft xl:sticky xl:top-24">
      <div className="border-b border-ink-100 px-6 py-4">
        <h3 className="text-base font-extrabold text-ink-900">الملخص المالي</h3>
        <p className="mt-0.5 text-xs text-ink-400">
          {form.type === 'package' ? 'تسعير الحقيبة من مجموع المواد' : 'أثر الدورة مع كل تعديل'}
        </p>
      </div>
      {form.type === 'package' ? (
        <PackageSummary financials={financials} />
      ) : (
        <ProgramSummary
          financials={financials}
          hasPartner={form.hasPartner}
          shareType={form.partnerShareType}
          sharePercent={form.partnerSharePercent}
        />
      )}
    </aside>
  )
}
