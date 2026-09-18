import { useMemo, useState } from 'react'
import { Handshake, Plus } from 'lucide-react'
import { SHARE_TYPES } from '../../data/programs/constants'
import { usePrograms } from '../../hooks/programs/ProgramsContext'
import { detailRoute } from '../../components/layout/navigation'
import { itemPrice } from '../../hooks/programs/calculations'
import { formatMoney } from '../../lib/format'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import EmptyState from '../../components/ui/EmptyState'
import Table, { TBody, TD, TH, THead, TR } from '../../components/ui/Table'
import {
  DataTableCard,
  DeptPageHeader,
  NameCell,
  SearchField,
} from '../../components/programs/DeptChrome'

export default function PartnersPage({ onNavigate }) {
  const { partners, items, addPartner } = usePrograms()
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ name: '', phone: '', address: '', notes: '' })
  const [error, setError] = useState('')

  const rows = useMemo(() => {
    return partners.map((partner) => {
      const linked = items.filter((item) => item.partnerId === partner.id)
      return { partner, linked }
    })
  }, [partners, items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(({ partner, linked }) =>
      [partner.name, partner.phone, partner.address, ...linked.map((item) => item.name)]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [rows, query])

  const saveDraft = () => {
    if (!draft.name.trim()) {
      setError('اسم الشريك مطلوب')
      return
    }
    addPartner(draft)
    setDraft({ name: '', phone: '', address: '', notes: '' })
    setError('')
    setAdding(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <DeptPageHeader
        title="الشركاء"
        subtitle="جهات الشراكة التشغيلية ونسبها المرتبطة بالبرامج."
        action={
          <Button icon={Plus} variant="accent" onClick={() => setAdding((v) => !v)}>
            {adding ? 'إلغاء' : 'إضافة شريك'}
          </Button>
        }
      />

      {adding && (
        <div className="rounded-3xl border border-dashed border-brand-200 bg-brand-50/40 p-5">
          <p className="text-sm font-extrabold text-ink-900">شريك جديد</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="new-partner-name"
              label="اسم الشريك"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              error={error}
            />
            <Input
              id="new-partner-phone"
              label="الهاتف"
              value={draft.phone}
              onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
            />
            <Input
              id="new-partner-address"
              className="sm:col-span-2"
              label="العنوان"
              value={draft.address}
              onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))}
            />
            <Textarea
              id="new-partner-notes"
              className="sm:col-span-2"
              label="ملاحظات"
              rows={2}
              value={draft.notes}
              onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={saveDraft}>حفظ الشريك</Button>
          </div>
        </div>
      )}

      <DataTableCard
        title="سجل الشركاء"
        subtitle={`${filtered.length} من أصل ${partners.length}`}
        toolbar={
          <SearchField compact value={query} onChange={setQuery} placeholder="بحث…" />
        }
        empty={
          filtered.length === 0 ? (
            <EmptyState
              icon={Handshake}
              title="لا يوجد شركاء"
              description="أضف شريكاً ليظهر في هذا السجل ويُتاح عند إنشاء البرامج."
              className="m-4 min-h-0 border-0 py-12 shadow-none"
            />
          ) : null
        }
        footer={
          filtered.length > 0 ? (
            <p className="text-xs text-ink-400">
              عرض {filtered.length} من أصل {partners.length} شريكاً
            </p>
          ) : null
        }
      >
        {filtered.length > 0 && (
          <Table>
            <THead>
              <TR hover={false}>
                <TH>الشريك</TH>
                <TH>الهاتف</TH>
                <TH>العنوان</TH>
                <TH>البرامج المرتبطة</TH>
                <TH>النسبة</TH>
                <TH>نوع النسبة</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map(({ partner, linked }) => {
                const share = linked[0]
                return (
                  <TR key={partner.id}>
                    <TD>
                      <NameCell name={partner.name} hint={partner.notes} />
                    </TD>
                    <TD className="tabular-nums" dir="ltr">
                      {partner.phone || '—'}
                    </TD>
                    <TD className="max-w-[220px] truncate">{partner.address || '—'}</TD>
                    <TD className="whitespace-normal">
                      {linked.length === 0 ? (
                        <span className="text-ink-400">لا يوجد</span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {linked.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => onNavigate(detailRoute(item.id))}
                              className="text-start text-sm font-bold text-brand-700 hover:text-brand-800"
                            >
                              {item.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </TD>
                    <TD className="tabular-nums">
                      {share ? `${share.partnerSharePercent}%` : '—'}
                    </TD>
                    <TD>
                      {share ? SHARE_TYPES[share.partnerShareType]?.label || '—' : '—'}
                      {share && (
                        <span className="mt-0.5 block text-[11px] text-ink-400">
                          {formatMoney(itemPrice(share))}
                        </span>
                      )}
                    </TD>
                  </TR>
                )
              })}
            </TBody>
          </Table>
        )}
      </DataTableCard>
    </div>
  )
}

