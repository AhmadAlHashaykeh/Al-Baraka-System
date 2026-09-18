import { SHARE_TYPES } from '../../data/programs/constants'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import { cn } from '../../lib/cn'
import SearchSelect from './SearchSelect'

export default function PartnerSection({
  form,
  errors,
  partners,
  setField,
  updateNewPartner,
}) {
  return (
    <div className="flex flex-col gap-6">
      {form.hasPartner && (
        <>
          {form.isNewPartner ? (
            <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold text-ink-900">شريك جديد</p>
                  <p className="mt-0.5 text-xs text-ink-400">
                    سيُحفظ في قائمة الشركاء ويُتاح لإعادة الاستخدام لاحقاً.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setField('isNewPartner', false)
                    setField('newPartner', { name: '', phone: '', address: '', notes: '' })
                  }}
                  className="text-xs font-bold text-brand-700 hover:text-brand-800"
                >
                  اختيار من القائمة
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  id="partner-name"
                  label="اسم الشريك"
                  value={form.newPartner.name}
                  onChange={(e) => updateNewPartner('name', e.target.value)}
                  error={errors.partnerName}
                  placeholder="اسم الجهة أو المؤسسة"
                />
                <Input
                  id="partner-phone"
                  label="رقم الهاتف"
                  value={form.newPartner.phone}
                  onChange={(e) => updateNewPartner('phone', e.target.value)}
                  placeholder="06-xxxxxxx"
                  dir="ltr"
                  inputClassName="text-end"
                />
                <Input
                  id="partner-address"
                  label="العنوان"
                  className="sm:col-span-2"
                  value={form.newPartner.address}
                  onChange={(e) => updateNewPartner('address', e.target.value)}
                  placeholder="المدينة — الحي"
                />
                <Textarea
                  id="partner-notes"
                  label="ملاحظات"
                  className="sm:col-span-2"
                  value={form.newPartner.notes}
                  onChange={(e) => updateNewPartner('notes', e.target.value)}
                  placeholder="طبيعة الشراكة أو أي ملاحظة تشغيلية"
                  rows={2}
                />
              </div>
            </div>
          ) : (
            <SearchSelect
              label="الشريك"
              items={partners}
              value={form.partnerId}
              onChange={(id) => setField('partnerId', id)}
              placeholder="ابحث عن شريك قائم…"
              getMeta={(item) => item.phone}
              onCreate={(query) => {
                setField('isNewPartner', true)
                setField('partnerId', '')
                updateNewPartner('name', query)
              }}
              error={errors.partnerId}
            />
          )}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Input
              id="partner-share"
              label="نسبة الشريك %"
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={form.partnerSharePercent}
              onChange={(e) => setField('partnerSharePercent', e.target.value)}
              error={errors.partnerSharePercent}
              placeholder="مثال: 30"
            />
            <div className="lg:col-span-2" data-field-error={errors.partnerShareType ? 'true' : undefined}>
              <p className="mb-1.5 text-xs font-bold text-ink-600">نوع النسبة</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Object.values(SHARE_TYPES).map((option) => {
                  const selected = form.partnerShareType === option.id
                  const isProfit = option.id === 'profit'
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setField('partnerShareType', option.id)}
                      className={cn(
                        'rounded-2xl border p-4 text-start transition-all',
                        selected
                          ? isProfit
                            ? 'border-accent-400 bg-accent-50 shadow-[0_0_0_3px_rgb(249_188_21/0.22)]'
                            : 'border-brand-400 bg-brand-50 shadow-[0_0_0_3px_rgb(43_62_158/0.16)]'
                          : 'border-ink-200 bg-white hover:border-ink-300',
                      )}
                    >
                      <p className="text-[11px] font-bold tracking-[0.12em] text-ink-400">
                        {isProfit ? 'بعد المصاريف' : 'من الإجمالي'}
                      </p>
                      <p className="mt-1 text-base font-extrabold text-ink-900">{option.title}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{option.hint}</p>
                      <p className="mt-2 text-[11px] font-medium text-ink-400">{option.detail}</p>
                    </button>
                  )
                })}
              </div>
              {errors.partnerShareType && (
                <p className="mt-1.5 text-[11px] font-bold text-danger-700">{errors.partnerShareType}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
