import { useMemo, useState } from 'react'
import { Receipt } from 'lucide-react'
import {
  EXPENSE_ACCOUNTS,
  EXPENSE_CATEGORIES,
  lookupName,
} from '../../data/programs/mock'
import { usePrograms } from '../../hooks/programs/ProgramsContext'
import { detailRoute } from '../../components/layout/navigation'
import { formatMoney } from '../../lib/format'
import EmptyState from '../../components/ui/EmptyState'
import Table, { TBody, TD, TH, THead, TR } from '../../components/ui/Table'
import Dropdown from '../../components/ui/Dropdown'
import {
  DataTableCard,
  DeptPageHeader,
  SearchField,
} from '../../components/programs/DeptChrome'

export default function ExpensesHubPage({ onNavigate }) {
  const { items } = usePrograms()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const programs = items.filter((item) => item.type === 'program')

  const rows = useMemo(() => {
    return programs.flatMap((program) =>
      (program.expenses || []).map((expense) => ({
        ...expense,
        programId: program.id,
        programName: program.name,
      })),
    )
  }, [programs])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (category !== 'all' && row.categoryId !== category) return false
      if (!q) return true
      return `${row.name} ${row.programName} ${row.notes || ''}`.toLowerCase().includes(q)
    })
  }, [rows, query, category])

  const total = filtered.reduce((sum, row) => sum + (Number(row.amount) || 0), 0)
  const categoryOptions = [
    { value: 'all', label: 'كل التصنيفات' },
    ...EXPENSE_CATEGORIES.map((row) => ({ value: row.id, label: row.name })),
  ]

  return (
    <div className="flex flex-col gap-6">
      <DeptPageHeader
        title="مصاريف البرامج"
        subtitle="عرض مركزي لكل بنود المصاريف المرتبطة بالبرامج. التعديل يتم من داخل البرنامج نفسه."
      />

      <DataTableCard
        title="بنود المصاريف"
        subtitle={`${filtered.length} من أصل ${rows.length}`}
        toolbar={
          <>
            <SearchField compact value={query} onChange={setQuery} placeholder="بحث…" />
            <Dropdown
              size="sm"
              className="w-[168px]"
              options={categoryOptions}
              value={category}
              onChange={setCategory}
            />
          </>
        }
        empty={
          filtered.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="لا توجد مصاريف"
              description="أضف بنود المصاريف من شاشة البرنامج ليظهر الملخص هنا."
              className="m-4 min-h-0 border-0 py-12 shadow-none"
            />
          ) : null
        }
        footer={
          filtered.length > 0 ? (
            <>
              <p className="text-xs text-ink-400">
                عرض {filtered.length} من أصل {rows.length} بنداً
              </p>
              <p className="text-sm font-black tabular-nums text-ink-900">المجموع {formatMoney(total)}</p>
            </>
          ) : null
        }
      >
        {filtered.length > 0 && (
          <Table>
            <THead>
              <TR hover={false}>
                <TH>المصروف</TH>
                <TH>البرنامج</TH>
                <TH>التصنيف</TH>
                <TH>الحساب</TH>
                <TH>ملاحظات</TH>
                <TH className="text-end">المبلغ</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((row) => (
                <TR key={`${row.programId}-${row.id}`}>
                  <TD className="font-bold text-ink-900">{row.name}</TD>
                  <TD>
                    <button
                      type="button"
                      onClick={() => onNavigate(detailRoute(row.programId))}
                      className="font-bold text-brand-700 hover:text-brand-800"
                    >
                      {row.programName}
                    </button>
                  </TD>
                  <TD>{lookupName(EXPENSE_CATEGORIES, row.categoryId)}</TD>
                  <TD>{lookupName(EXPENSE_ACCOUNTS, row.accountId)}</TD>
                  <TD className="max-w-[220px] truncate text-ink-400">{row.notes || '—'}</TD>
                  <TD className="text-end font-bold tabular-nums">{formatMoney(row.amount)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </DataTableCard>
    </div>
  )
}
