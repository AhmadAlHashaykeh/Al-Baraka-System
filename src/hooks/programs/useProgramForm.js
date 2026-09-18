import { useMemo, useState } from 'react'
import { DEFAULT_REGISTRATION } from '../../data/programs/constants'
import { lookupName } from '../../data/programs/mock'
import { packageFinancials, programFinancials } from './calculations'
import { usePrograms } from './ProgramsContext'
import { validateForm } from './validation'

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function emptyExpense() {
  return {
    id: uid('exp'),
    name: '',
    categoryId: '',
    amount: '',
    accountId: '',
    notes: '',
  }
}

export function emptySubject() {
  return {
    id: uid('subrow'),
    subjectId: '',
    teacherId: '',
    teacherKind: '',
    isNewTeacher: false,
    newTeacher: { name: '', phone: '', specialty: '' },
    price: '',
    sharePercent: '',
    shareType: 'revenue',
    sessionsCount: '',
  }
}

export function emptyForm() {
  return {
    type: null,
    name: '',
    shortDescription: '',
    branchId: '',
    status: 'draft',
    startDate: '',
    endDate: '',
    basePrice: '',
    notes: '',
    hasPartner: false,
    partnerId: '',
    isNewPartner: false,
    newPartner: { name: '', phone: '', address: '', notes: '' },
    partnerSharePercent: '',
    partnerShareType: 'revenue',
    expenses: [],
    gradeId: '',
    curriculumId: '',
    subjects: [],
    registration: { ...DEFAULT_REGISTRATION },
  }
}

export function itemToForm(item) {
  if (!item) return emptyForm()
  return {
    type: item.type,
    name: item.name || '',
    shortDescription: item.shortDescription || '',
    branchId: item.branchId || '',
    status: item.status || 'draft',
    startDate: item.startDate || '',
    endDate: item.endDate || '',
    basePrice: item.basePrice === 0 || item.basePrice ? String(item.basePrice) : '',
    notes: item.notes || '',
    hasPartner: Boolean(item.hasPartner),
    partnerId: item.partnerId || '',
    isNewPartner: false,
    newPartner: { name: '', phone: '', address: '', notes: '' },
    partnerSharePercent:
      item.partnerSharePercent === 0 || item.partnerSharePercent
        ? String(item.partnerSharePercent)
        : '',
    partnerShareType: item.partnerShareType || 'revenue',
    expenses: (item.expenses || []).map((row) => ({
      ...row,
      amount: row.amount === 0 || row.amount ? String(row.amount) : '',
    })),
    gradeId: item.gradeId || '',
    curriculumId: item.curriculumId || '',
    subjects: (item.subjects || []).map((row) => ({
      id: row.id,
      subjectId: row.subjectId || '',
      teacherId: row.teacherId || '',
      teacherKind: row.teacherKind || '',
      isNewTeacher: false,
      newTeacher: { name: '', phone: '', specialty: '' },
      price: row.price === 0 || row.price ? String(row.price) : '',
      sharePercent:
        row.sharePercent === 0 || row.sharePercent ? String(row.sharePercent) : '',
      shareType: row.shareType || 'revenue',
      sessionsCount:
        row.sessionsCount === 0 || row.sessionsCount ? String(row.sessionsCount) : '',
    })),
    registration: { ...DEFAULT_REGISTRATION, ...(item.registration || {}) },
  }
}

function teacherNameFrom(formSubject, { employees, externalTeachers }) {
  if (formSubject.isNewTeacher) return formSubject.newTeacher.name.trim()
  const pool = formSubject.teacherKind === 'internal' ? employees : externalTeachers
  return lookupName(pool, formSubject.teacherId, '')
}

export function useProgramForm(initialItem, { initialType } = {}) {
  const {
    partners,
    employees,
    externalTeachers,
    subjects: subjectCatalog,
    addPartner,
    addExternalTeacher,
    saveItem,
  } = usePrograms()

  const [form, setForm] = useState(() => {
    const base = itemToForm(initialItem)
    if (!initialItem && initialType) return { ...base, type: initialType }
    return base
  })
  const [errors, setErrors] = useState({})
  const [attempted, setAttempted] = useState(false)

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    if (attempted) {
      setErrors((current) => {
        if (!current[key]) return current
        const next = { ...current }
        delete next[key]
        return next
      })
    }
  }

  const setRegistration = (key, value) => {
    setForm((current) => ({
      ...current,
      registration: { ...current.registration, [key]: value },
    }))
  }

  const setType = (type) => {
    setForm((current) => {
      const next = { ...current, type }
      if (type === 'program') {
        return { ...next, subjects: [], gradeId: '', curriculumId: '' }
      }
      if (type === 'package') {
        return {
          ...next,
          hasPartner: false,
          partnerId: '',
          isNewPartner: false,
          expenses: [],
          startDate: '',
          endDate: '',
          basePrice: '',
        }
      }
      return next
    })
    setErrors((current) => {
      const next = { ...current }
      delete next.type
      return next
    })
  }

  const updateNewPartner = (key, value) => {
    setForm((current) => ({
      ...current,
      newPartner: { ...current.newPartner, [key]: value },
    }))
  }

  const addExpense = () => {
    setForm((current) => ({ ...current, expenses: [...current.expenses, emptyExpense()] }))
  }

  const updateExpense = (id, key, value) => {
    setForm((current) => ({
      ...current,
      expenses: current.expenses.map((row) => (row.id === id ? { ...row, [key]: value } : row)),
    }))
  }

  const removeExpense = (id) => {
    setForm((current) => ({
      ...current,
      expenses: current.expenses.filter((row) => row.id !== id),
    }))
  }

  const addSubject = () => {
    setForm((current) => ({ ...current, subjects: [...current.subjects, emptySubject()] }))
    if (attempted) {
      setErrors((current) => {
        if (!current.subjects) return current
        const next = { ...current }
        delete next.subjects
        return next
      })
    }
  }

  const updateSubject = (id, patch) => {
    setForm((current) => ({
      ...current,
      subjects: current.subjects.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    }))
  }

  const removeSubject = (id) => {
    setForm((current) => ({
      ...current,
      subjects: current.subjects.filter((row) => row.id !== id),
    }))
  }

  const moveSubject = (id, direction) => {
    setForm((current) => {
      const index = current.subjects.findIndex((row) => row.id === id)
      if (index < 0) return current
      const target = index + direction
      if (target < 0 || target >= current.subjects.length) return current
      const next = [...current.subjects]
      const [row] = next.splice(index, 1)
      next.splice(target, 0, row)
      return { ...current, subjects: next }
    })
  }

  const financials = useMemo(() => {
    if (form.type === 'package') return { kind: 'package', ...packageFinancials(form) }
    if (form.type === 'program') {
      return {
        kind: 'program',
        ...programFinancials({ ...form, enrollmentsCount: initialItem?.enrollmentsCount || 0 }),
      }
    }
    return null
  }, [form, initialItem])

  const submit = () => {
    const nextErrors = validateForm(form)
    setAttempted(true)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      queueMicrotask(() => {
        document.querySelector('[data-field-error="true"]')?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      })
      return null
    }

    const now = new Date().toISOString()
    let partner = null
    let partnerId = form.partnerId

    if (form.type === 'program' && form.hasPartner) {
      if (form.isNewPartner) {
        partner = addPartner(form.newPartner)
        partnerId = partner.id
      } else {
        partner = partners.find((row) => row.id === partnerId) || null
      }
    }

    const resolvedSubjects = (form.subjects || []).map((row) => {
      let teacherId = row.teacherId
      let teacherKind = row.teacherKind
      let teacherName = teacherNameFrom(row, { employees, externalTeachers })

      if (row.isNewTeacher) {
        const created = addExternalTeacher(row.newTeacher)
        teacherId = created.id
        teacherKind = 'external'
        teacherName = created.name
      }

      return {
        id: row.id,
        subjectId: row.subjectId,
        subjectName: lookupName(subjectCatalog, row.subjectId, ''),
        teacherId,
        teacherName,
        teacherKind,
        price: Number(row.price) || 0,
        sharePercent:
          teacherKind === 'external' ? Number(row.sharePercent) || 0 : null,
        shareType: teacherKind === 'external' ? row.shareType || 'revenue' : 'revenue',
        sessionsCount: Number(row.sessionsCount) || 0,
      }
    })

    const existing = initialItem
    const item = {
      id: existing?.id || uid(form.type === 'package' ? 'pkg' : 'prg'),
      type: form.type,
      name: form.name.trim(),
      shortDescription: form.shortDescription.trim(),
      branchId: form.branchId,
      status: form.status,
      startDate: form.type === 'program' ? form.startDate : '',
      endDate: form.type === 'program' ? form.endDate : '',
      basePrice: form.type === 'program' ? Number(form.basePrice) || 0 : 0,
      notes: form.notes.trim(),
      hasPartner: form.type === 'program' && form.hasPartner,
      partnerId: form.type === 'program' && form.hasPartner ? partnerId : '',
      partner: form.type === 'program' && form.hasPartner ? partner : null,
      partnerSharePercent:
        form.type === 'program' && form.hasPartner ? Number(form.partnerSharePercent) || 0 : 0,
      partnerShareType:
        form.type === 'program' && form.hasPartner ? form.partnerShareType : 'revenue',
      expenses:
        form.type === 'program'
          ? form.expenses.map((row) => ({
              ...row,
              name: row.name.trim(),
              amount: Number(row.amount) || 0,
              notes: row.notes?.trim() || '',
            }))
          : [],
      gradeId: form.type === 'package' ? form.gradeId : '',
      curriculumId: form.type === 'package' ? form.curriculumId : '',
      subjects: form.type === 'package' ? resolvedSubjects : [],
      enrollmentsCount: existing?.enrollmentsCount || 0,
      registration: { ...form.registration },
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      activity: [
        {
          id: uid('act'),
          at: now,
          title: existing ? 'تم حفظ التعديلات' : 'تم إنشاء العنصر',
          body: existing
            ? `حُفظت تعديلات «${form.name.trim()}».`
            : `أُضيف «${form.name.trim()}» إلى دائرة البرامج والحقائب.`,
          actor: 'أحمد محمد',
        },
        ...(existing?.activity || []),
      ],
    }

    saveItem(item)
    return item
  }

  return {
    form,
    errors,
    attempted,
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
  }
}
