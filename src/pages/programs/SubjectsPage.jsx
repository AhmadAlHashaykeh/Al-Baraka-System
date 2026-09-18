import { useMemo, useState } from 'react'
import { BookOpen, Plus } from 'lucide-react'
import { usePrograms } from '../../hooks/programs/ProgramsContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import EmptyState from '../../components/ui/EmptyState'
import Table, { TBody, TD, TH, THead, TR } from '../../components/ui/Table'
import {
  DataTableCard,
  DeptPageHeader,
  SearchField,
} from '../../components/programs/DeptChrome'

export default function SubjectsPage() {
  const { subjects, items, addSubject } = usePrograms()
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const usage = useMemo(() => {
    const map = new Map(subjects.map((subject) => [subject.id, []]))
    for (const item of items) {
      for (const row of item.subjects || []) {
        if (!map.has(row.subjectId)) map.set(row.subjectId, [])
        map.get(row.subjectId).push(item.name)
      }
    }
    return map
  }, [subjects, items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return subjects
    return subjects.filter((subject) => subject.name.toLowerCase().includes(q))
  }, [subjects, query])

  const save = () => {
    if (!name.trim()) {
      setError('اسم المادة مطلوب')
      return
    }
    addSubject({ name })
    setName('')
    setError('')
    setAdding(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <DeptPageHeader
        title="المواد"
        subtitle="كتالوج المواد القابلة لإعادة الاستخدام داخل الحقائب الدراسية."
        action={
          <Button icon={Plus} variant="accent" onClick={() => setAdding((v) => !v)}>
            {adding ? 'إلغاء' : 'إضافة مادة'}
          </Button>
        }
      />

      {adding && (
        <div className="rounded-3xl border border-dashed border-brand-200 bg-brand-50/40 p-5">
          <p className="text-sm font-extrabold text-ink-900">مادة جديدة</p>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <Input
              id="new-subject"
              label="اسم المادة"
              placeholder="مثال: رياضيات"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={error}
              className="min-w-[220px] flex-1"
            />
            <Button icon={Plus} onClick={save}>
              حفظ المادة
            </Button>
          </div>
        </div>
      )}

      <DataTableCard
        title="كتالوج المواد"
        subtitle={`${filtered.length} من أصل ${subjects.length}`}
        toolbar={<SearchField compact value={query} onChange={setQuery} placeholder="بحث…" />}
        empty={
          filtered.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="لا توجد مواد"
              description="أضف مادة إلى الكتالوج لتظهر عند بناء الحقائب."
              className="m-4 min-h-0 border-0 py-12 shadow-none"
            />
          ) : null
        }
        footer={
          filtered.length > 0 ? (
            <p className="text-xs text-ink-400">
              عرض {filtered.length} من أصل {subjects.length} مادة
            </p>
          ) : null
        }
      >
        {filtered.length > 0 && (
          <Table>
            <THead>
              <TR hover={false}>
                <TH>المادة</TH>
                <TH>مستخدمة في</TH>
                <TH className="text-end">عدد الحقائب</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((subject) => {
                const usedIn = [...new Set(usage.get(subject.id) || [])]
                return (
                  <TR key={subject.id}>
                    <TD className="font-bold text-ink-900">{subject.name}</TD>
                    <TD className="max-w-[420px] whitespace-normal text-ink-500">
                      {usedIn.length ? usedIn.join(' · ') : 'غير مرتبطة بعد'}
                    </TD>
                    <TD className="text-end font-bold tabular-nums">{usedIn.length}</TD>
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
