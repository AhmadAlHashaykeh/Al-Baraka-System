import { useMemo, useState } from 'react'
import { GraduationCap, Plus } from 'lucide-react'
import { STATUSES } from '../../data/programs/constants'
import { BRANCHES, lookupName } from '../../data/programs/mock'
import { itemPrice, sumExpenses } from '../../hooks/programs/calculations'
import { usePrograms } from '../../hooks/programs/ProgramsContext'
import { createRoute, detailRoute, editRoute } from '../../components/layout/navigation'
import { formatDate, formatMoney } from '../../lib/format'
import Button from '../../components/ui/Button'
import Dropdown from '../../components/ui/Dropdown'
import EmptyState from '../../components/ui/EmptyState'
import Table, { TBody, TD, TH, THead, TR } from '../../components/ui/Table'
import { StatusBadge } from '../../components/programs/StatusBadge'
import {
  DataTableCard,
  DeptPageHeader,
  NameCell,
  SearchField,
  TableActions,
} from '../../components/programs/DeptChrome'

const STATUS_FILTERS = [
  { value: 'all', label: 'كل الحالات' },
  ...STATUSES.map((row) => ({ value: row.value, label: row.label })),
]

export default function ProgramsPage({ onNavigate }) {
  const { items } = usePrograms()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const programs = items.filter((item) => item.type === 'program')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return programs.filter((item) => {
      if (status !== 'all' && item.status !== status) return false
      if (!q) return true
      const hay = [item.name, item.shortDescription, item.partner?.name, item.notes]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [programs, query, status])

  return (
    <div className="flex flex-col gap-6">
      <DeptPageHeader
        title="إدارة البرامج"
        subtitle="سجل البرامج المستقلة: الحالة، الشريك، السعر، المصاريف، وعدد المسجّلين."
        action={
          <Button icon={Plus} variant="accent" onClick={() => onNavigate(createRoute('program'))}>
            إضافة برنامج
          </Button>
        }
      />

      <DataTableCard
        title="قائمة البرامج"
        subtitle={`${filtered.length} من أصل ${programs.length}`}
        toolbar={
          <>
            <SearchField
              compact
              value={query}
              onChange={setQuery}
              placeholder="بحث…"
            />
            <Dropdown
              size="sm"
              className="w-[140px]"
              options={STATUS_FILTERS}
              value={status}
              onChange={setStatus}
            />
          </>
        }
        empty={
          filtered.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title={programs.length === 0 ? 'لا توجد برامج بعد' : 'لا نتائج مطابقة'}
              description={
                programs.length === 0
                  ? 'أضف برنامجاً مستقلاً لبدء العمل التشغيلي والمالي.'
                  : 'جرّب تعديل البحث أو فلتر الحالة.'
              }
              action={
                programs.length === 0 ? (
                  <Button icon={Plus} onClick={() => onNavigate(createRoute('program'))}>
                    إضافة برنامج
                  </Button>
                ) : null
              }
              className="m-4 min-h-0 border-0 py-12 shadow-none"
            />
          ) : null
        }
        footer={
          filtered.length > 0 ? (
            <p className="text-xs text-ink-400">
              عرض {filtered.length} من أصل {programs.length} برنامجاً
            </p>
          ) : null
        }
      >
        {filtered.length > 0 && (
          <Table>
            <THead>
              <TR hover={false}>
                <TH>البرنامج</TH>
                <TH>الفرع</TH>
                <TH>الحالة</TH>
                <TH>الشريك</TH>
                <TH className="text-end">السعر</TH>
                <TH className="text-end">المصاريف</TH>
                <TH className="text-end">المسجّلون</TH>
                <TH>آخر تحديث</TH>
                <TH className="text-end">إجراءات</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((item) => (
                <TR key={item.id}>
                  <TD>
                    <NameCell
                      name={item.name}
                      hint={item.shortDescription}
                      onClick={() => onNavigate(detailRoute(item.id))}
                    />
                  </TD>
                  <TD>{lookupName(BRANCHES, item.branchId)}</TD>
                  <TD>
                    <StatusBadge status={item.status} />
                  </TD>
                  <TD>
                    {item.hasPartner ? (
                      <span className="font-bold text-brand-700">{item.partner?.name || 'مع شريك'}</span>
                    ) : (
                      <span className="text-ink-400">بدون شريك</span>
                    )}
                  </TD>
                  <TD className="text-end font-bold tabular-nums">{formatMoney(itemPrice(item))}</TD>
                  <TD className="text-end tabular-nums">{formatMoney(sumExpenses(item.expenses))}</TD>
                  <TD className="text-end tabular-nums">{item.enrollmentsCount}</TD>
                  <TD className="tabular-nums text-ink-400">{formatDate(item.updatedAt)}</TD>
                  <TD>
                    <TableActions
                      onView={() => onNavigate(detailRoute(item.id))}
                      onEdit={() => onNavigate(editRoute(item.id))}
                    />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </DataTableCard>
    </div>
  )
}
