import {
  CONTRACT_TEMPLATES,
  REGISTRATION_FORM_TYPES,
} from '../../data/programs/constants'
import { usePrograms } from '../../hooks/programs/ProgramsContext'
import { detailRoute } from '../../components/layout/navigation'
import { DataTableCard, DeptPageHeader } from '../../components/programs/DeptChrome'
import Table, { TBody, TD, TH, THead, TR } from '../../components/ui/Table'

function flag(value) {
  return value ? 'نعم' : 'لا'
}

function labelOf(list, value) {
  return list.find((row) => row.value === value)?.label || '—'
}

export default function RegistrationSettingsPage({ onNavigate }) {
  const { items } = usePrograms()

  return (
    <div className="flex flex-col gap-6">
      <DeptPageHeader
        title="إعدادات التسجيل والعقود"
        subtitle="مساحة تحضيرية لمحرك نماذج التسجيل وقوالب العقود. البناء الكامل في مرحلة لاحقة."
      />

      <DataTableCard
        title="الإعدادات الحالية على السجلات"
        subtitle="عرض مرجعي لنماذج التسجيل المرتبطة بالبرامج والحقائب"
        footer={
          <p className="text-xs text-ink-400">عرض {items.length} سجلاً</p>
        }
      >
        <Table>
          <THead>
            <TR hover={false}>
              <TH>السجل</TH>
              <TH>النوع</TH>
              <TH>نموذج التسجيل</TH>
              <TH>ولي الأمر</TH>
              <TH>اختيار المواد</TH>
              <TH>توقيع</TH>
              <TH>شروط خاصة</TH>
              <TH>قالب العقد</TH>
            </TR>
          </THead>
          <TBody>
            {items.map((item) => (
              <TR key={item.id}>
                <TD>
                  <button
                    type="button"
                    onClick={() => onNavigate(detailRoute(item.id))}
                    className="font-bold text-brand-700 hover:text-brand-800"
                  >
                    {item.name}
                  </button>
                </TD>
                <TD>{item.type === 'package' ? 'حقيبة' : 'برنامج'}</TD>
                <TD>{labelOf(REGISTRATION_FORM_TYPES, item.registration?.formType)}</TD>
                <TD>{flag(item.registration?.guardianRequired)}</TD>
                <TD>{flag(item.registration?.allowSubjectSelection)}</TD>
                <TD>{flag(item.registration?.signatureRequired)}</TD>
                <TD>{flag(item.registration?.hasSpecialTerms)}</TD>
                <TD>{labelOf(CONTRACT_TEMPLATES, item.registration?.contractTemplate)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </DataTableCard>
    </div>
  )
}
