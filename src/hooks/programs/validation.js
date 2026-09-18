export function validateForm(form) {
  const errors = {}

  if (!form.type) {
    errors.type = 'يجب اختيار نوع العنصر أولاً'
  }

  if (!String(form.name || '').trim()) {
    errors.name = form.type === 'package' ? 'اسم الحقيبة مطلوب' : 'اسم البرنامج مطلوب'
  }

  if (!form.branchId) {
    errors.branchId = 'يجب اختيار الفرع'
  }

  if (form.type === 'program') {
    const price = Number(form.basePrice)
    if (form.basePrice === '' || form.basePrice === null || Number.isNaN(price)) {
      errors.basePrice = 'السعر الأساسي مطلوب'
    } else if (price < 0) {
      errors.basePrice = 'لا يمكن أن يكون السعر سالباً'
    }

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      errors.endDate = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية'
    }

    if (form.hasPartner) {
      if (form.isNewPartner) {
        if (!String(form.newPartner?.name || '').trim()) {
          errors.partnerName = 'اسم الشريك مطلوب'
        }
      } else if (!form.partnerId) {
        errors.partnerId = 'يجب اختيار شريك أو إضافة شريك جديد'
      }

      const pct = Number(form.partnerSharePercent)
      if (form.partnerSharePercent === '' || Number.isNaN(pct)) {
        errors.partnerSharePercent = 'نسبة الشريك مطلوبة'
      } else if (pct < 0 || pct > 100) {
        errors.partnerSharePercent = 'النسبة يجب أن تكون بين 0 و 100'
      }

      if (!form.partnerShareType) {
        errors.partnerShareType = 'يجب اختيار نوع النسبة'
      }
    }

    for (const expense of form.expenses || []) {
      if (!String(expense.name || '').trim()) {
        errors[`expense-${expense.id}-name`] = 'اسم المصروف مطلوب'
      }
      const amount = Number(expense.amount)
      if (expense.amount === '' || Number.isNaN(amount)) {
        errors[`expense-${expense.id}-amount`] = 'المبلغ مطلوب'
      } else if (amount < 0) {
        errors[`expense-${expense.id}-amount`] = 'لا يمكن أن يكون المبلغ سالباً'
      }
    }
  }

  if (form.type === 'package') {
    if (!form.gradeId) errors.gradeId = 'يجب اختيار الصف / المستوى'
    if (!form.curriculumId) errors.curriculumId = 'يجب اختيار المنهاج'

    if (!form.subjects?.length) {
      errors.subjects = 'يجب إضافة مادة واحدة على الأقل'
    }

    for (const subject of form.subjects || []) {
      if (!subject.subjectId) {
        errors[`subject-${subject.id}-subject`] = 'المادة مطلوبة'
      }

      const price = Number(subject.price)
      if (subject.price === '' || Number.isNaN(price)) {
        errors[`subject-${subject.id}-price`] = 'سعر المادة مطلوب'
      } else if (price < 0) {
        errors[`subject-${subject.id}-price`] = 'لا يمكن أن يكون السعر سالباً'
      }

      const teacherMissing = subject.isNewTeacher
        ? !String(subject.newTeacher?.name || '').trim()
        : !subject.teacherId
      if (teacherMissing) {
        errors[`subject-${subject.id}-teacher`] = 'يجب تحديد المعلم'
      }

      const kind = subject.isNewTeacher ? 'external' : subject.teacherKind
      if (kind === 'external') {
        const pct = Number(subject.sharePercent)
        if (subject.sharePercent === '' || Number.isNaN(pct)) {
          errors[`subject-${subject.id}-share`] = 'نسبة المعلم الخارجي مطلوبة'
        } else if (pct < 0 || pct > 100) {
          errors[`subject-${subject.id}-share`] = 'النسبة يجب أن تكون بين 0 و 100'
        }
      }
    }
  }

  return errors
}
