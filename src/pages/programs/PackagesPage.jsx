import { useMemo, useState } from 'react'
import { BookMarked, Plus } from 'lucide-react'
import { STATUSES } from '../../data/programs/constants'
import { BRANCHES, lookupName } from '../../data/programs/mock'
import { itemPrice } from '../../hooks/programs/calculations'
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

export default function PackagesPage({ onNavigate }) {
  const { items } = usePrograms()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const packages = items.filter((item) => item.type === 'package')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return packages.filter((item) => {
      if (status !== 'all' && item.status !== status) return false
      if (!q) return true
      const hay = [item.name, item.shortDescription, item.notes]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [packages, query, status])

  return (
    <div className="flex flex-col gap-6">
      <DeptPageHeader
        title="إدارة الحقائب"
        subtitle="الحزم الدراسية متعددة المواد. سعر الحقيبة يُحسب من مجموع أسعار المواد."
        action={
          <Button icon={Plus} variant="accent" onClick={() => onNavigate(createRoute('package'))}>
            إضافة حقيبة
          </Button>
        }
      />

      <DataTableCard
        title="قائمة الحقائب"
        subtitle={`${filtered.length} من أصل ${packages.length}`}
        toolbar={
          <>
            <SearchField compact value={query} onChange={setQuery} placeholder="بحث…" />
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
              icon={BookMarked}
              title={packages.length === 0 ? 'لا توجد حقائب بعد' : 'لا نتائج مطابقة'}
              description={
                packages.length === 0
                  ? 'أضف حقيبة دراسية وابدأ ببناء جدول المواد والمعلمين.'
                  : 'جرّب تعديل البحث أو فلتر الحالة.'
              }
              action={
                packages.length === 0 ? (
                  <Button icon={Plus} onClick={() => onNavigate(createRoute('package'))}>
                    إضافة حقيبة
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
              عرض {filtered.length} من أصل {packages.length} حقيبة
            </p>
          ) : null
        }
      >
        {filtered.length > 0 && (
          <Table>
            <THead>
              <TR hover={false}>
                <TH>الحقيبة</TH>
                <TH>الفرع</TH>
                <TH>الحالة</TH>
                <TH className="text-end">المواد</TH>
                <TH className="text-end">المعلمون</TH>
                <TH className="text-end">سعر الحقيبة</TH>
                <TH className="text-end">المسجّلون</TH>
                <TH>آخر تحديث</TH>
                <TH className="text-end">إجراءات</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((item) => {
                const teacherCount = new Set(
                  (item.subjects || []).map((row) => row.teacherId).filter(Boolean),
                ).size
                return (
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
                    <TD className="text-end tabular-nums">{item.subjects?.length || 0}</TD>
                    <TD className="text-end tabular-nums">{teacherCount}</TD>
                    <TD className="text-end font-bold tabular-nums">{formatMoney(itemPrice(item))}</TD>
                    <TD className="text-end tabular-nums">{item.enrollmentsCount}</TD>
                    <TD className="tabular-nums text-ink-400">{formatDate(item.updatedAt)}</TD>
                    <TD>
                      <TableActions
                        onView={() => onNavigate(detailRoute(item.id))}
                        onEdit={() => onNavigate(editRoute(item.id))}
                      />
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
