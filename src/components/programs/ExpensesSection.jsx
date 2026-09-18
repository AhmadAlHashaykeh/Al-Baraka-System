import { Plus, Trash2 } from 'lucide-react'
import { EXPENSE_ACCOUNTS, EXPENSE_CATEGORIES } from '../../data/programs/mock'
import { formatMoney } from '../../lib/format'
import Button from '../ui/Button'
import Dropdown from '../ui/Dropdown'
import Input from '../ui/Input'
import { FormSection } from './FormSection'

const categoryOptions = EXPENSE_CATEGORIES.map((row) => ({ value: row.id, label: row.name }))
const accountOptions = EXPENSE_ACCOUNTS.map((row) => ({ value: row.id, label: row.name }))

export default function ExpensesSection({
  expenses,
  errors,
  onAdd,
  onUpdate,
  onRemove,
  total,
}) {
  return (
    <FormSection
      index={3}
      title="مصاريف البرنامج"
      subtitle="بنود مرنة تُحتسب فوراً ضمن الربح التقديري. يمكن إضافة صفوف أو حذفها أثناء الإعداد."
      action={
        <Button variant="outline" size="sm" icon={Plus} onClick={onAdd}>
          إضافة مصروف
        </Button>
      }
    >
      <div className="overflow-hidden rounded-2xl border border-ink-200">
        <div className="hidden grid-cols-12 gap-2 border-b border-ink-100 bg-ink-50 px-4 py-2.5 text-[11px] font-bold text-ink-400 lg:grid">
          <span className="col-span-3">اسم المصروف</span>
          <span className="col-span-2">التصنيف</span>
          <span className="col-span-2">المبلغ</span>
          <span className="col-span-2">صندوق / حساب</span>
          <span className="col-span-2">ملاحظات</span>
          <span className="col-span-1 text-end">حذف</span>
        </div>

        {expenses.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm font-bold text-ink-700">لا توجد مصاريف بعد</p>
            <p className="mt-1 text-xs text-ink-400">أضف بنود القاعة أو المواد أو الضيافة ليظهر أثرها على الربح.</p>
          </div>
        ) : (
          <div className="divide-y divide-ink-100">
            {expenses.map((row, index) => (
              <div key={row.id} className="grid grid-cols-1 gap-3 px-4 py-4 lg:grid-cols-12 lg:items-start lg:gap-2">
                <Input
                  id={`${row.id}-name`}
                  label={index === 0 ? undefined : undefined}
                  className="lg:col-span-3"
                  placeholder="مثال: إيجار القاعة"
                  value={row.name}
                  onChange={(e) => onUpdate(row.id, 'name', e.target.value)}
                  error={errors[`expense-${row.id}-name`]}
                />
                <Dropdown
                  className="lg:col-span-2"
                  options={categoryOptions}
                  value={row.categoryId}
                  onChange={(value) => onUpdate(row.id, 'categoryId', value)}
                  placeholder="التصنيف"
                />
                <Input
                  id={`${row.id}-amount`}
                  className="lg:col-span-2"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="0"
                  value={row.amount}
                  onChange={(e) => onUpdate(row.id, 'amount', e.target.value)}
                  error={errors[`expense-${row.id}-amount`]}
                />
                <Dropdown
                  className="lg:col-span-2"
                  options={accountOptions}
                  value={row.accountId}
                  onChange={(value) => onUpdate(row.id, 'accountId', value)}
                  placeholder="الحساب"
                />
                <Input
                  id={`${row.id}-notes`}
                  className="lg:col-span-2"
                  placeholder="اختياري"
                  value={row.notes}
                  onChange={(e) => onUpdate(row.id, 'notes', e.target.value)}
                />
                <div className="flex justify-end lg:col-span-1 lg:pt-1">
                  <button
                    type="button"
                    onClick={() => onRemove(row.id)}
                    aria-label="حذف المصروف"
                    className="inline-flex size-9 items-center justify-center rounded-xl text-ink-400 transition-colors hover:bg-danger-50 hover:text-danger-700"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-ink-200 bg-ink-50 px-4 py-3">
          <p className="text-xs font-bold text-ink-500">إجمالي المصاريف</p>
          <p className="text-sm font-black tabular-nums text-ink-900">{formatMoney(total)}</p>
        </div>
      </div>
    </FormSection>
  )
}
