import { ArrowRight } from 'lucide-react'
import { STATUSES, TYPE_META } from '../../data/programs/constants'
import { BRANCHES, CURRICULA, GRADES } from '../../data/programs/mock'
import { useProgramForm } from '../../hooks/programs/useProgramForm'
import { detailRoute, listRouteForType } from '../../components/layout/navigation'
import Button from '../../components/ui/Button'
import Dropdown from '../../components/ui/Dropdown'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import ExpensesSection from '../../components/programs/ExpensesSection'
import FinancialSummary from '../../components/programs/FinancialSummary'
import { FormSection, YesNoToggle } from '../../components/programs/FormSection'
import PartnerSection from '../../components/programs/PartnerSection'
import RegistrationPlaceholder from '../../components/programs/RegistrationPlaceholder'
import SubjectsTable from '../../components/programs/SubjectsTable'
import TypeSelector from '../../components/programs/TypeSelector'
import { sumExpenses, sumSubjectPrices } from '../../hooks/programs/calculations'

const statusOptions = STATUSES.map((row) => ({ value: row.value, label: row.label }))
const branchOptions = BRANCHES.map((row) => ({ value: row.id, label: row.name }))
const gradeOptions = GRADES.map((row) => ({ value: row.id, label: row.name }))
const curriculumOptions = CURRICULA.map((row) => ({ value: row.id, label: row.name }))

export default function ProgramFormPage({ mode = 'create', item, forcedType, onNavigate }) {
  const {
    form,
    errors,
    financials,
    setField,
    setType,
    setRegistration,
    updateNewPartner,
    addExpense,
    updateExpense,
    removeExpense,
    addSubject,
    updateSubject,
    removeSubject,
    moveSubject,
    submit,
    partners,
    employees,
    externalTeachers,
    subjectCatalog,
  } = useProgramForm(item, { initialType: forcedType })

  const isEdit = mode === 'edit'
  const typeLocked = isEdit || Boolean(forcedType)
  const teacherItems = [...employees, ...externalTeachers]
  const backTo = listRouteForType(item?.type || forcedType || form.type || 'program')

  const handleSave = () => {
    const saved = submit()
    if (saved) onNavigate(detailRoute(saved.id))
  }

  const pageTitle = isEdit
    ? item?.type === 'package'
      ? 'تعديل الحقيبة'
      : 'تعديل البرنامج'
    : forcedType === 'package'
      ? 'إضافة حقيبة'
      : 'إضافة برنامج'

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate(isEdit && item ? detailRoute(item.id) : backTo)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-400 hover:text-ink-700"
          >
            <ArrowRight className="size-3.5" />
            العودة
          </button>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-ink-900">
            {pageTitle}
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            {isEdit
              ? `تحديث البيانات التشغيلية لـ «${item?.name}».`
              : forcedType === 'package'
                ? 'أكمل بيانات الحقيبة وجدول المواد. السعر يُحسب تلقائياً.'
                : 'أكمل البيانات التشغيلية والمالية للبرنامج.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => onNavigate(isEdit && item ? detailRoute(item.id) : backTo)}>
            إلغاء
          </Button>
          <Button onClick={handleSave} disabled={!form.type}>
            حفظ
          </Button>
        </div>
      </div>

      {!typeLocked && (
        <TypeSelector value={form.type} onChange={setType} error={errors.type} />
      )}

      {form.type && (
        <>
          {!typeLocked && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-y border-ink-200 py-3">
              <p className="text-sm text-ink-600">
                النوع المحدد:{' '}
                <span className="font-extrabold text-ink-900">{TYPE_META[form.type].label}</span>
              </p>
              <button
                type="button"
                onClick={() => setType(null)}
                className="text-xs font-bold text-brand-700 hover:text-brand-800"
              >
                تغيير النوع
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
            <div className="flex flex-col gap-2 xl:col-span-8">
              <FormSection
                index={1}
                title="المعلومات الأساسية"
                subtitle={
                  form.type === 'package'
                    ? 'هوية الحقيبة الدراسية: الاسم، الصف، المنهاج، والفرع.'
                    : 'بيانات البرنامج التشغيلية بما فيها المدة والسعر الأساسي.'
                }
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    id="item-name"
                    className="sm:col-span-2"
                    label={form.type === 'package' ? 'اسم الحقيبة' : 'اسم البرنامج'}
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    error={errors.name}
                    placeholder={
                      form.type === 'package'
                        ? 'مثال: حقيبة الصف السابع'
                        : 'مثال: برنامج مهارات القيادة'
                    }
                  />
                  <Textarea
                    id="item-desc"
                    className="sm:col-span-2"
                    label="وصف مختصر"
                    value={form.shortDescription}
                    onChange={(e) => setField('shortDescription', e.target.value)}
                    placeholder="جملة أو جملتان توضّحان الجمهور والهدف."
                    rows={2}
                  />

                  {form.type === 'package' && (
                    <>
                      <Dropdown
                        label="الصف / المستوى"
                        options={gradeOptions}
                        value={form.gradeId}
                        onChange={(value) => setField('gradeId', value)}
                        error={errors.gradeId}
                        placeholder="اختر الصف"
                      />
                      <Dropdown
                        label="المنهاج"
                        options={curriculumOptions}
                        value={form.curriculumId}
                        onChange={(value) => setField('curriculumId', value)}
                        error={errors.curriculumId}
                        placeholder="اختر المنهاج"
                      />
                    </>
                  )}

                  <Dropdown
                    label="الفرع"
                    options={branchOptions}
                    value={form.branchId}
                    onChange={(value) => setField('branchId', value)}
                    error={errors.branchId}
                    placeholder="اختر الفرع"
                  />
                  <Dropdown
                    label="الحالة"
                    options={statusOptions}
                    value={form.status}
                    onChange={(value) => setField('status', value)}
                  />

                  {form.type === 'program' && (
                    <>
                      <Input
                        id="start-date"
                        type="date"
                        label="تاريخ البداية"
                        value={form.startDate}
                        onChange={(e) => setField('startDate', e.target.value)}
                      />
                      <Input
                        id="end-date"
                        type="date"
                        label="تاريخ النهاية"
                        value={form.endDate}
                        onChange={(e) => setField('endDate', e.target.value)}
                        error={errors.endDate}
                      />
                      <Input
                        id="base-price"
                        type="number"
                        min="0"
                        step="0.5"
                        label="السعر الأساسي"
                        value={form.basePrice}
                        onChange={(e) => setField('basePrice', e.target.value)}
                        error={errors.basePrice}
                        hint="سعر المقعد الواحد. الإيراد المتوقع = السعر × عدد المسجّلين."
                      />
                    </>
                  )}

                  <Textarea
                    id="item-notes"
                    className="sm:col-span-2"
                    label="ملاحظات"
                    value={form.notes}
                    onChange={(e) => setField('notes', e.target.value)}
                    placeholder="ملاحظات تشغيلية داخلية"
                    rows={2}
                  />
                </div>
              </FormSection>

              {form.type === 'program' && (
                <FormSection
                  index={2}
                  title="الشريك"
                  subtitle="الشراكة اختيارية. إذا وُجد شريك يمكن احتساب نسبته من الإيراد أو من الربح بعد المصاريف."
                >
                  <YesNoToggle
                    label="هل يوجد شريك؟"
                    value={form.hasPartner}
                    onChange={(value) => {
                      setField('hasPartner', value)
                      if (!value) {
                        setField('isNewPartner', false)
                        setField('partnerId', '')
                      }
                    }}
                  />
                  <div className="mt-6">
                    <PartnerSection
                      form={form}
                      errors={errors}
                      partners={partners}
                      setField={setField}
                      updateNewPartner={updateNewPartner}
                    />
                  </div>
                </FormSection>
              )}

              {form.type === 'program' && (
                <ExpensesSection
                  expenses={form.expenses}
                  errors={errors}
                  onAdd={addExpense}
                  onUpdate={updateExpense}
                  onRemove={removeExpense}
                  total={sumExpenses(form.expenses)}
                />
              )}

              {form.type === 'package' && (
                <FormSection
                  index={2}
                  title="المواد والمعلمون"
                  subtitle="جدول مرن لكل مادة: معلم داخلي أو خارجي، سعر مستقل، وعدد الحصص."
                >
                  <SubjectsTable
                    subjects={form.subjects}
                    errors={errors}
                    catalog={subjectCatalog}
                    teacherItems={teacherItems}
                    onAdd={addSubject}
                    onUpdate={updateSubject}
                    onRemove={removeSubject}
                    onMove={moveSubject}
                    total={sumSubjectPrices(form.subjects)}
                  />
                </FormSection>
              )}

              <RegistrationPlaceholder
                registration={form.registration}
                onChange={setRegistration}
                index={form.type === 'package' ? 3 : 4}
              />
            </div>

            <div className="xl:col-span-4">
              <FinancialSummary form={form} financials={financials} />
              <div className="mt-4 flex gap-2">
                <Button className="flex-1" onClick={handleSave}>
                  حفظ
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onNavigate(isEdit && item ? detailRoute(item.id) : backTo)}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
