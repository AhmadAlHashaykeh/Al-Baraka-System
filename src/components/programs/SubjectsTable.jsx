import { ArrowDown, ArrowUp, Plus, Trash2, UserPlus } from 'lucide-react'
import { TEACHER_KINDS } from '../../data/programs/constants'
import { formatMoney } from '../../lib/format'
import { cn } from '../../lib/cn'
import Button from '../ui/Button'
import Dropdown from '../ui/Dropdown'
import Input from '../ui/Input'
import SearchSelect from './SearchSelect'

export default function SubjectsTable({
  subjects,
  catalog = [],
  errors,
  teacherItems,
  onAdd,
  onUpdate,
  onRemove,
  onMove,
  total,
}) {
  const subjectOptions = catalog.map((row) => ({ value: row.id, label: row.name }))
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-ink-400">جدول المواد</p>
          <p className="mt-1 text-sm text-ink-500">
            كل صف مادة مستقلة بسعرها ومعلّمها. سعر الحقيبة = مجموع هذه الأسعار.
          </p>
        </div>
        <Button variant="outline" size="sm" icon={Plus} onClick={onAdd}>
          إضافة مادة
        </Button>
      </div>

      {errors.subjects && (
        <p className="mb-3 text-[11px] font-bold text-danger-700" data-field-error="true">
          {errors.subjects}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-ink-200">
        <div className="hidden border-b border-ink-100 bg-ink-50 px-4 py-2.5 text-[11px] font-bold text-ink-400 xl:grid xl:grid-cols-[1.1fr_1.5fr_0.7fr_0.7fr_0.8fr_auto] xl:gap-3">
          <span>المادة</span>
          <span>المعلم / نوعه</span>
          <span>السعر</span>
          <span>الحصص / الزيارات</span>
          <span>النسبة</span>
          <span className="text-end">إجراءات</span>
        </div>

        {subjects.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm font-bold text-ink-800">الحقيبة فارغة</p>
            <p className="mt-1 text-xs text-ink-400">أضف المادة الأولى لبناء السعر والتوزيع على المعلمين.</p>
          </div>
        ) : (
          <div className="divide-y divide-ink-100">
            {subjects.map((row, index) => {
              const kind = row.isNewTeacher ? 'external' : row.teacherKind
              const showShare = kind === 'external'
              return (
                <div key={row.id} className="px-4 py-4">
                  <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.1fr_1.5fr_0.7fr_0.7fr_0.8fr_auto] xl:items-start">
                    <Dropdown
                      options={subjectOptions}
                      value={row.subjectId}
                      onChange={(value) => onUpdate(row.id, { subjectId: value })}
                      placeholder="اختر المادة"
                      error={errors[`subject-${row.id}-subject`]}
                    />

                    <div className="min-w-0">
                      {row.isNewTeacher ? (
                        <p className="flex h-10 items-center text-xs font-bold text-accent-700">
                          مدرس خارجي جديد — أكمل البيانات بالأسفل
                        </p>
                      ) : (
                        <SearchSelect
                          items={teacherItems}
                          value={row.teacherId}
                          placeholder="ابحث عن معلم…"
                          getMeta={(item) =>
                            `${item.kind === 'internal' ? TEACHER_KINDS.internal.label : TEACHER_KINDS.external.label} · ${item.specialty || ''}`
                          }
                          getGroup={(item) =>
                            item.kind === 'internal' ? 'موظف داخلي' : 'مدرس خارجي'
                          }
                          onChange={(id, item) =>
                            onUpdate(row.id, {
                              teacherId: id,
                              teacherKind: item?.kind || '',
                              isNewTeacher: false,
                              sharePercent: item?.kind === 'external' ? row.sharePercent : '',
                            })
                          }
                          onCreate={(query) =>
                            onUpdate(row.id, {
                              isNewTeacher: true,
                              teacherId: '',
                              teacherKind: 'external',
                              newTeacher: { name: query, phone: '', specialty: '' },
                            })
                          }
                          createLabel={(q) => `إضافة مدرس خارجي «${q}»`}
                          error={errors[`subject-${row.id}-teacher`]}
                        />
                      )}
                      {row.teacherKind === 'internal' && !row.isNewTeacher && (
                        <p className="mt-1 text-[11px] text-ink-400">موظف داخلي — النسبة غير مطبّقة</p>
                      )}
                    </div>

                    <Input
                      id={`${row.id}-price`}
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="السعر"
                      value={row.price}
                      onChange={(e) => onUpdate(row.id, { price: e.target.value })}
                      error={errors[`subject-${row.id}-price`]}
                    />

                    <Input
                      id={`${row.id}-sessions`}
                      type="number"
                      min="0"
                      placeholder="عدد الحصص"
                      value={row.sessionsCount}
                      onChange={(e) => onUpdate(row.id, { sessionsCount: e.target.value })}
                    />

                    <div>
                      {showShare ? (
                        <>
                          <Input
                            id={`${row.id}-share`}
                            type="number"
                            min="0"
                            max="100"
                            step="0.5"
                            placeholder="النسبة %"
                            value={row.sharePercent}
                            onChange={(e) => onUpdate(row.id, { sharePercent: e.target.value })}
                            error={errors[`subject-${row.id}-share`]}
                          />
                          <p className="mt-1 text-[11px] font-bold text-brand-700">من الإيراد</p>
                        </>
                      ) : (
                        <p className="flex h-10 items-center text-xs font-bold text-ink-400">غير مطبّقة</p>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        aria-label="تحريك لأعلى"
                        disabled={index === 0}
                        onClick={() => onMove(row.id, -1)}
                        className={cn(
                          'inline-flex size-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100',
                          index === 0 && 'opacity-30',
                        )}
                      >
                        <ArrowUp className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="تحريك لأسفل"
                        disabled={index === subjects.length - 1}
                        onClick={() => onMove(row.id, 1)}
                        className={cn(
                          'inline-flex size-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100',
                          index === subjects.length - 1 && 'opacity-30',
                        )}
                      >
                        <ArrowDown className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="حذف المادة"
                        onClick={() => onRemove(row.id)}
                        className="inline-flex size-8 items-center justify-center rounded-lg text-ink-400 hover:bg-danger-50 hover:text-danger-700"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {row.isNewTeacher && (
                    <div className="mt-3 rounded-2xl border border-dashed border-accent-300 bg-accent-50/60 p-4">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <p className="text-xs font-extrabold text-ink-900">بيانات المدرس الخارجي الجديد</p>
                        <button
                          type="button"
                          className="text-[11px] font-bold text-brand-700"
                          onClick={() =>
                            onUpdate(row.id, {
                              isNewTeacher: false,
                              teacherKind: '',
                              newTeacher: { name: '', phone: '', specialty: '' },
                            })
                          }
                        >
                          اختيار من القائمة
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <Input
                          id={`${row.id}-new-name`}
                          label="اسم المدرس"
                          value={row.newTeacher.name}
                          onChange={(e) =>
                            onUpdate(row.id, { newTeacher: { ...row.newTeacher, name: e.target.value } })
                          }
                          error={errors[`subject-${row.id}-teacher`]}
                        />
                        <Input
                          id={`${row.id}-new-phone`}
                          label="الهاتف"
                          value={row.newTeacher.phone}
                          onChange={(e) =>
                            onUpdate(row.id, { newTeacher: { ...row.newTeacher, phone: e.target.value } })
                          }
                          dir="ltr"
                          inputClassName="text-end"
                        />
                        <Input
                          id={`${row.id}-new-spec`}
                          label="التخصص"
                          value={row.newTeacher.specialty}
                          onChange={(e) =>
                            onUpdate(row.id, {
                              newTeacher: { ...row.newTeacher, specialty: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-200 bg-ink-50 px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-ink-500">
            <UserPlus className="size-3.5" />
            {subjects.length} {subjects.length === 1 ? 'مادة' : 'مواد'}
          </div>
          <div className="text-end">
            <p className="text-[11px] font-bold text-ink-400">مجموع أسعار المواد</p>
            <p className="text-sm font-black tabular-nums text-ink-900">{formatMoney(total)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
