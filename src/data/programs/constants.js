export const STATUSES = [
  { value: 'draft', label: 'مسودة', variant: 'brand' },
  { value: 'active', label: 'نشط', variant: 'success' },
  { value: 'paused', label: 'متوقف', variant: 'accent' },
  { value: 'archived', label: 'مؤرشف', variant: 'neutral' },
]

export const STATUS_META = Object.fromEntries(STATUSES.map((s) => [s.value, s]))

export const TYPE_META = {
  program: {
    id: 'program',
    label: 'برنامج',
    kicker: 'برنامج مستقل',
    short: 'برنامج',
    description: 'للبرامج التعليمية والتدريبية المستقلة، مع إمكانية الشراكة واحتساب المصاريف التشغيلية.',
  },
  package: {
    id: 'package',
    label: 'حقيبة دراسية',
    kicker: 'حقيبة متعددة المواد',
    short: 'حقيبة',
    description: 'لحزم دراسية تضم عدة مواد ومعلمين، ويُحسب سعرها تلقائياً من مجموع أسعار المواد.',
  },
}

export const SHARE_TYPES = {
  revenue: {
    id: 'revenue',
    label: 'من الإيراد',
    title: 'نسبة من الإيراد',
    hint: 'الشريك يأخذ نسبته مباشرة من إجمالي الإيراد، قبل خصم أي مصروف.',
    detail: 'مناسب للشراكات التشغيلية التي تتقاسم العائد منذ اللحظة الأولى.',
  },
  profit: {
    id: 'profit',
    label: 'من الربح',
    title: 'نسبة من الربح',
    hint: 'الشريك يأخذ نسبته بعد خصم المصاريف أولاً، أي من الربح التقديري فقط.',
    detail: 'مناسب للشراكات القائمة على النتيجة الصافية للدورة.',
  },
}

export const TEACHER_KINDS = {
  internal: { id: 'internal', label: 'موظف داخلي' },
  external: { id: 'external', label: 'مدرس خارجي' },
}

export const REGISTRATION_FORM_TYPES = [
  { value: 'standard', label: 'نموذج قياسي' },
  { value: 'guardian', label: 'نموذج ولي الأمر' },
  { value: 'custom', label: 'نموذج مخصص (لاحقاً)' },
]

export const CONTRACT_TEMPLATES = [
  { value: 'default', label: 'قالب العقد الافتراضي' },
  { value: 'partner', label: 'قالب الشراكة' },
  { value: 'package', label: 'قالب الحقيبة الدراسية' },
]

export const DEFAULT_REGISTRATION = {
  formType: 'standard',
  guardianRequired: true,
  allowSubjectSelection: false,
  signatureRequired: true,
  hasSpecialTerms: false,
  contractTemplate: 'default',
}

export function statusLabel(status) {
  return STATUS_META[status]?.label ?? status
}

export function typeLabel(type) {
  return TYPE_META[type]?.label ?? type
}
