import { useMemo, useState } from 'react'
import { ArrowRight, Pencil, Trash2 } from 'lucide-react'
import {
  CONTRACT_TEMPLATES,
  REGISTRATION_FORM_TYPES,
  SHARE_TYPES,
  STATUS_META,
  TEACHER_KINDS,
} from '../../data/programs/constants'
import {
  BRANCHES,
  CURRICULA,
  EXPENSE_ACCOUNTS,
  EXPENSE_CATEGORIES,
  GRADES,
  lookupName,
} from '../../data/programs/mock'
import {
  itemPrice,
  packageFinancials,
  programFinancials,
} from '../../hooks/programs/calculations'
import { editRoute, listRouteForType } from '../../components/layout/navigation'
import { usePrograms } from '../../hooks/programs/ProgramsContext'
import { formatDate, formatDateTime, formatMoney } from '../../lib/format'
import { cn } from '../../lib/cn'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import Table, { TBody, TD, TH, THead, TR } from '../../components/ui/Table'
import { StatusBadge, TypeBadge } from '../../components/programs/StatusBadge'
import {
  DataTableCard,
  KeyValueTable,
} from '../../components/programs/DeptChrome'

function programTabs(type) {
  if (type === 'package') {
    return [
      { id: 'overview', label: 'نظرة عامة' },
      { id: 'finance', label: 'البيانات المالية' },
      { id: 'subjects', label: 'المواد والمدرسين' },
      { id: 'registration', label: 'إعدادات التسجيل' },
      { id: 'activity', label: 'النشاط' },
    ]
  }
  return [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'finance', label: 'البيانات المالية' },
    { id: 'partners', label: 'الشركاء' },
    { id: 'expenses', label: 'المصاريف' },
    { id: 'registration', label: 'إعدادات التسجيل' },
    { id: 'activity', label: 'النشاط' },
  ]
}

function yesNo(value) {
  return value ? 'نعم' : 'لا'
}

export default function ProgramDetailsPage({ item, onNavigate }) {
  const { items, removeItem } = usePrograms()
  const current = items.find((row) => row.id === item.id) || item
  const [tab, setTab] = useState('overview')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const tabs = programTabs(current.type)
  const price = itemPrice(current)
  const programFin = useMemo(() => programFinancials(current), [current])
  const packageFin = useMemo(() => packageFinancials(current), [current])
  const shareMeta = SHARE_TYPES[current.partnerShareType] || SHARE_TYPES.revenue

  const identityRows = [
    { label: 'الحالة', value: STATUS_META[current.status]?.label },
    { label: 'الفرع', value: lookupName(BRANCHES, current.branchId) },
    ...(current.type === 'program'
      ? [
          { label: 'تاريخ البداية', value: formatDate(current.startDate) },
          { label: 'تاريخ النهاية', value: formatDate(current.endDate) },
        ]
      : [
          { label: 'الصف / المستوى', value: lookupName(GRADES, current.gradeId) },
          { label: 'المنهاج', value: lookupName(CURRICULA, current.curriculumId) },
          { label: 'عدد المواد', value: String(current.subjects?.length || 0) },
        ]),
    { label: 'تاريخ الإنشاء', value: formatDateTime(current.createdAt) },
    { label: 'الملاحظات', value: current.notes || '—' },
  ]

  const financeRows =
    current.type === 'package'
      ? [
          { label: 'عدد المواد', value: String(packageFin.subjectCount) },
          { label: 'مجموع أسعار المواد', value: formatMoney(packageFin.total) },
          { label: 'حصص المعلمين الخارجيين', value: formatMoney(packageFin.externalCost) },
          { label: 'سعر الحقيبة النهائي', value: formatMoney(packageFin.total) },
        ]
      : [
          { label: 'الإيراد المتوقع', value: formatMoney(programFin.revenue) },
          { label: 'إجمالي المصاريف', value: formatMoney(programFin.expensesTotal) },
          { label: 'الربح التقديري', value: formatMoney(programFin.profit) },
          ...(current.hasPartner
            ? [
                {
                  label: `حصة الشريك (${current.partnerSharePercent || 0}٪ ${shareMeta.label})`,
                  value: formatMoney(programFin.partnerAmount),
                },
              ]
            : []),
          { label: 'صافي المركز', value: formatMoney(programFin.net) },
        ]

  const registrationRows = [
    {
      label: 'نوع نموذج التسجيل',
      value: REGISTRATION_FORM_TYPES.find((row) => row.value === current.registration?.formType)?.label,
    },
    {
      label: 'قالب العقد',
      value: CONTRACT_TEMPLATES.find((row) => row.value === current.registration?.contractTemplate)?.label,
    },
    { label: 'بيانات ولي الأمر مطلوبة', value: yesNo(current.registration?.guardianRequired) },
    { label: 'اختيار المواد مسموح', value: yesNo(current.registration?.allowSubjectSelection) },
    { label: 'التوقيع مطلوب', value: yesNo(current.registration?.signatureRequired) },
    { label: 'شروط خاصة', value: yesNo(current.registration?.hasSpecialTerms) },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate(listRouteForType(current.type))}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-400 hover:text-ink-700"
          >
            <ArrowRight className="size-3.5" />
            {current.type === 'package' ? 'إدارة الحقائب' : 'إدارة البرامج'}
          </button>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
              {current.name}
            </h2>
            <TypeBadge type={current.type} />
            <StatusBadge status={current.status} />
          </div>
          {current.shortDescription && (
            <p className="mt-1 max-w-2xl text-sm text-ink-400">{current.shortDescription}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={Pencil} onClick={() => onNavigate(editRoute(current.id))}>
            تعديل
          </Button>
          <Button variant="ghost" icon={Trash2} onClick={() => setConfirmDelete(true)}>
            حذف
          </Button>
        </div>
      </div>

      <div className="border-b border-ink-200">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => setTab(row.id)}
              className={cn(
                'shrink-0 border-b-2 px-4 py-3 text-sm font-bold transition-colors',
                tab === row.id
                  ? 'border-brand-500 text-brand-700'
                  : 'border-transparent text-ink-400 hover:text-ink-700',
              )}
            >
              {row.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <DataTableCard title="البيانات التعريفية">
            <KeyValueTable rows={identityRows} />
          </DataTableCard>
          <DataTableCard title="الملخص التشغيلي">
            <Table>
              <THead>
                <TR hover={false}>
                  <TH>{current.type === 'package' ? 'سعر الحقيبة' : 'السعر الأساسي'}</TH>
                  <TH className="text-end">المسجّلون</TH>
                  <TH>الفرع</TH>
                  <TH>آخر تحديث</TH>
                </TR>
              </THead>
              <TBody>
                <TR>
                  <TD className="font-bold tabular-nums">{formatMoney(price)}</TD>
                  <TD className="text-end font-bold tabular-nums">{current.enrollmentsCount}</TD>
                  <TD>{lookupName(BRANCHES, current.branchId)}</TD>
                  <TD className="tabular-nums text-ink-400">{formatDate(current.updatedAt)}</TD>
                </TR>
              </TBody>
            </Table>
          </DataTableCard>
        </div>
      )}

      {tab === 'finance' && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <DataTableCard
            title={current.type === 'package' ? 'تسعير الحقيبة' : 'إيراد ومصاريف الدورة'}
            subtitle={
              current.type === 'package'
                ? 'السعر النهائي مجموع أسعار المواد'
                : 'تُخصم المصاريف من الإيراد قبل أو بعد حصة الشريك حسب نوع النسبة'
            }
          >
            <KeyValueTable rows={financeRows} />
          </DataTableCard>
          {current.type === 'program' ? (
            <ExpenseTable expenses={current.expenses} />
          ) : (
            <SubjectFinanceTable subjects={current.subjects} />
          )}
        </div>
      )}

      {tab === 'partners' && (
        current.hasPartner && current.partner ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <DataTableCard title="بيانات الشريك">
              <KeyValueTable
                rows={[
                  { label: 'الاسم', value: current.partner.name },
                  { label: 'الهاتف', value: current.partner.phone || '—' },
                  { label: 'العنوان', value: current.partner.address || '—' },
                  { label: 'ملاحظات', value: current.partner.notes || '—' },
                ]}
              />
            </DataTableCard>
            <DataTableCard title="نموذج النسبة">
              <KeyValueTable
                rows={[
                  { label: 'النسبة', value: `${current.partnerSharePercent}%` },
                  { label: 'النوع', value: shareMeta.title || shareMeta.label },
                  { label: 'الوصف', value: shareMeta.hint },
                  { label: 'حصة الشريك التقديرية', value: formatMoney(programFin.partnerAmount) },
                ]}
              />
            </DataTableCard>
          </div>
        ) : (
          <DataTableCard title="الشركاء">
            <EmptyState
              title="لا يوجد شريك لهذا البرنامج"
              description="يمكن إضافة شريك لاحقاً من شاشة التعديل."
              className="m-4 min-h-0 border-0 py-12 shadow-none"
            />
          </DataTableCard>
        )
      )}

      {tab === 'subjects' && (
        <DataTableCard
          title="المواد والمدرسون"
          subtitle={`${current.subjects.length} مواد · السعر النهائي ${formatMoney(packageFin.total)}`}
        >
          <Table>
            <THead>
              <TR hover={false}>
                <TH>المادة</TH>
                <TH>المعلم</TH>
                <TH>النوع</TH>
                <TH>الحصص</TH>
                <TH>النسبة</TH>
                <TH className="text-end">السعر</TH>
              </TR>
            </THead>
            <TBody>
              {current.subjects.map((row) => (
                <TR key={row.id}>
                  <TD className="font-bold text-ink-900">{row.subjectName}</TD>
                  <TD>{row.teacherName}</TD>
                  <TD>{TEACHER_KINDS[row.teacherKind]?.label ?? '—'}</TD>
                  <TD className="tabular-nums">{row.sessionsCount || '—'}</TD>
                  <TD>
                    {row.teacherKind === 'external'
                      ? `${row.sharePercent}% · ${SHARE_TYPES[row.shareType]?.label || 'من الإيراد'}`
                      : 'غير مطبّقة'}
                  </TD>
                  <TD className="text-end font-bold tabular-nums">{formatMoney(row.price)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </DataTableCard>
      )}

      {tab === 'expenses' && <ExpenseTable expenses={current.expenses} total={programFin.expensesTotal} />}

      {tab === 'registration' && (
        <DataTableCard
          title="إعدادات التسجيل والعقود"
          subtitle="مساحة تحضيرية — البناء الكامل في مرحلة لاحقة"
        >
          <KeyValueTable rows={registrationRows} />
        </DataTableCard>
      )}

      {tab === 'activity' && (
        <DataTableCard title="سجل النشاط" subtitle={`${(current.activity || []).length} حدثاً`}>
          {(current.activity || []).length === 0 ? (
            <EmptyState
              title="لا يوجد نشاط"
              description="ستظهر هنا عمليات الإنشاء والتعديل."
              className="m-4 min-h-0 border-0 py-12 shadow-none"
            />
          ) : (
            <Table>
              <THead>
                <TR hover={false}>
                  <TH>التاريخ</TH>
                  <TH>الحدث</TH>
                  <TH>التفاصيل</TH>
                  <TH>بواسطة</TH>
                </TR>
              </THead>
              <TBody>
                {(current.activity || []).map((event) => (
                  <TR key={event.id}>
                    <TD className="tabular-nums text-ink-400">{formatDateTime(event.at)}</TD>
                    <TD className="font-bold text-ink-900">{event.title}</TD>
                    <TD className="max-w-[420px] whitespace-normal text-ink-500">{event.body}</TD>
                    <TD>{event.actor}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </DataTableCard>
      )}

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="حذف العنصر"
        subtitle="سيتم إزالته من الواجهة فقط — لا توجد قاعدة بيانات في هذه المرحلة."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              إلغاء
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                removeItem(current.id)
                setConfirmDelete(false)
                onNavigate(listRouteForType(current.type))
              }}
            >
              تأكيد الحذف
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-ink-600">
          هل تريد حذف «{current.name}» من دائرة البرامج والحقائب؟
        </p>
      </Modal>
    </div>
  )
}

function ExpenseTable({ expenses = [], total }) {
  return (
    <DataTableCard
      title="بنود المصاريف"
      subtitle={total != null ? `الإجمالي ${formatMoney(total)}` : undefined}
      empty={
        expenses.length === 0 ? (
          <EmptyState
            title="لا توجد مصاريف مسجّلة"
            description="أضف البنود من شاشة التعديل."
            className="m-4 min-h-0 border-0 py-12 shadow-none"
          />
        ) : null
      }
    >
      {expenses.length > 0 && (
        <Table>
          <THead>
            <TR hover={false}>
              <TH>المصروف</TH>
              <TH>التصنيف</TH>
              <TH>الحساب</TH>
              <TH>ملاحظات</TH>
              <TH className="text-end">المبلغ</TH>
            </TR>
          </THead>
          <TBody>
            {expenses.map((row) => (
              <TR key={row.id}>
                <TD className="font-bold text-ink-900">{row.name}</TD>
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
  )
}

function SubjectFinanceTable({ subjects = [] }) {
  return (
    <DataTableCard title="تفصيل أسعار المواد" subtitle="سعر الحقيبة مجموع هذه البنود">
      <Table>
        <THead>
          <TR hover={false}>
            <TH>المادة</TH>
            <TH>المعلم</TH>
            <TH>حصة خارجي</TH>
            <TH className="text-end">السعر</TH>
          </TR>
        </THead>
        <TBody>
          {subjects.map((row) => (
            <TR key={row.id}>
              <TD className="font-bold text-ink-900">{row.subjectName}</TD>
              <TD>{row.teacherName}</TD>
              <TD>
                {row.teacherKind === 'external'
                  ? formatMoney(((Number(row.price) || 0) * (Number(row.sharePercent) || 0)) / 100)
                  : '—'}
              </TD>
              <TD className="text-end font-bold tabular-nums">{formatMoney(row.price)}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </DataTableCard>
  )
}
