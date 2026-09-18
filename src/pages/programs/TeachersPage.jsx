import { useMemo, useState } from 'react'
import { Plus, UserRound } from 'lucide-react'
import { usePrograms } from '../../hooks/programs/ProgramsContext'
import { formatMoney } from '../../lib/format'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import EmptyState from '../../components/ui/EmptyState'
import Table, { TBody, TD, TH, THead, TR } from '../../components/ui/Table'
import {
  DataTableCard,
  DeptPageHeader,
  NameCell,
  SearchField,
} from '../../components/programs/DeptChrome'

export default function TeachersPage() {
  const { externalTeachers, items, addExternalTeacher } = usePrograms()
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ name: '', phone: '', specialty: '' })
  const [error, setError] = useState('')

  const rows = useMemo(() => {
    return externalTeachers.map((teacher) => {
      const assignments = items.flatMap((item) =>
        (item.subjects || [])
          .filter((row) => row.teacherId === teacher.id)
          .map((row) => ({
            packageName: item.name,
            subjectName: row.subjectName,
            sharePercent: row.sharePercent,
            price: row.price,
          })),
      )
      return { teacher, assignments }
    })
  }, [externalTeachers, items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(({ teacher, assignments }) =>
      [teacher.name, teacher.phone, teacher.specialty, ...assignments.map((a) => a.packageName)]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [rows, query])

  const save = () => {
    if (!draft.name.trim()) {
      setError('اسم المدرس مطلوب')
      return
    }
    addExternalTeacher(draft)
    setDraft({ name: '', phone: '', specialty: '' })
    setError('')
    setAdding(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <DeptPageHeader
        title="المدرسون الخارجيون"
        subtitle="إدارة مستقلة عن الموظفين الداخليين. النسب تُضبط داخل كل حقيبة."
        action={
          <Button icon={Plus} variant="accent" onClick={() => setAdding((v) => !v)}>
            {adding ? 'إلغاء' : 'إضافة مدرس'}
          </Button>
        }
      />

      {adding && (
        <div className="rounded-3xl border border-dashed border-brand-200 bg-brand-50/40 p-5">
          <p className="text-sm font-extrabold text-ink-900">مدرس خارجي جديد</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              id="ext-name"
              label="الاسم"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              error={error}
            />
            <Input
              id="ext-phone"
              label="الهاتف"
              value={draft.phone}
              onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
            />
            <Input
              id="ext-spec"
              label="التخصص"
              value={draft.specialty}
              onChange={(e) => setDraft((d) => ({ ...d, specialty: e.target.value }))}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button icon={Plus} onClick={save}>
              حفظ المدرس
            </Button>
          </div>
        </div>
      )}

      <DataTableCard
        title="سجل المدرسين الخارجيين"
        subtitle={`${filtered.length} من أصل ${externalTeachers.length}`}
        toolbar={<SearchField compact value={query} onChange={setQuery} placeholder="بحث…" />}
        empty={
          filtered.length === 0 ? (
            <EmptyState
              icon={UserRound}
              title="لا يوجد مدرسون خارجيون"
              description="أضف مدرساً خارجياً ليظهر عند بناء الحقائب."
              className="m-4 min-h-0 border-0 py-12 shadow-none"
            />
          ) : null
        }
        footer={
          filtered.length > 0 ? (
            <p className="text-xs text-ink-400">
              عرض {filtered.length} من أصل {externalTeachers.length} مدرساً
            </p>
          ) : null
        }
      >
        {filtered.length > 0 && (
          <Table>
            <THead>
              <TR hover={false}>
                <TH>المدرس</TH>
                <TH>التخصص</TH>
                <TH>الهاتف</TH>
                <TH>التعيينات</TH>
                <TH className="text-end">عدد المواد</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map(({ teacher, assignments }) => (
                <TR key={teacher.id}>
                  <TD>
                    <NameCell name={teacher.name} />
                  </TD>
                  <TD>{teacher.specialty || '—'}</TD>
                  <TD className="tabular-nums" dir="ltr">
                    {teacher.phone || '—'}
                  </TD>
                  <TD className="max-w-[340px] whitespace-normal">
                    {assignments.length === 0 ? (
                      <span className="text-ink-400">غير معيَّن</span>
                    ) : (
                      assignments
                        .map(
                          (row) =>
                            `${row.subjectName} · ${row.packageName} (${row.sharePercent ?? 0}% · ${formatMoney(row.price)})`,
                        )
                        .join(' | ')
                    )}
                  </TD>
                  <TD className="text-end font-bold tabular-nums">{assignments.length}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </DataTableCard>
    </div>
  )
}
