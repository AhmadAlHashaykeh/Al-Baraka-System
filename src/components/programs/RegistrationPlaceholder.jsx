import { FileSignature, Info } from 'lucide-react'
import {
  CONTRACT_TEMPLATES,
  REGISTRATION_FORM_TYPES,
} from '../../data/programs/constants'
import Dropdown from '../ui/Dropdown'
import { FormSection, YesNoToggle } from './FormSection'

export default function RegistrationPlaceholder({ registration, onChange, index = 4 }) {
  return (
    <FormSection
      index={index}
      title="إعدادات التسجيل والعقد"
      subtitle="معاينة معمارية لمحرك التسجيل. لا تُنشئ عقداً كاملاً في هذه المرحلة."
    >
      <div className="overflow-hidden rounded-3xl border border-ink-200">
        <div className="flex items-start gap-3 border-b border-accent-200 bg-accent-50 px-5 py-4">
          <Info className="mt-0.5 size-4 shrink-0 text-accent-700" />
          <p className="text-sm leading-relaxed text-ink-700">
            سيتم تطوير إعدادات العقود ونماذج التسجيل بشكل كامل في المرحلة القادمة.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-2">
          <Dropdown
            label="نوع نموذج التسجيل"
            options={REGISTRATION_FORM_TYPES}
            value={registration.formType}
            onChange={(value) => onChange('formType', value)}
          />
          <Dropdown
            label="قالب العقد"
            options={CONTRACT_TEMPLATES}
            value={registration.contractTemplate}
            onChange={(value) => onChange('contractTemplate', value)}
          />
          <YesNoToggle
            label="هل بيانات ولي الأمر مطلوبة؟"
            value={registration.guardianRequired}
            onChange={(value) => onChange('guardianRequired', value)}
          />
          <YesNoToggle
            label="هل اختيار المواد مسموح؟"
            value={registration.allowSubjectSelection}
            onChange={(value) => onChange('allowSubjectSelection', value)}
            hint="مفيد للحقائب التي تسمح للطالب باستثناء مادة أو أكثر."
          />
          <YesNoToggle
            label="هل التوقيع مطلوب؟"
            value={registration.signatureRequired}
            onChange={(value) => onChange('signatureRequired', value)}
          />
          <YesNoToggle
            label="هل توجد شروط خاصة؟"
            value={registration.hasSpecialTerms}
            onChange={(value) => onChange('hasSpecialTerms', value)}
          />
        </div>

        <div className="flex items-center gap-3 border-t border-ink-100 bg-ink-50 px-5 py-4">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-soft">
            <FileSignature className="size-4" />
          </span>
          <div>
            <p className="text-sm font-extrabold text-ink-900">مساحة قالب العقد</p>
            <p className="text-xs text-ink-400">
              ستُربط هنا بنود العقد، توقيع ولي الأمر، والتسعير التفصيلي لكل مادة.
            </p>
          </div>
        </div>
      </div>
    </FormSection>
  )
}
