import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  EMPLOYEES,
  EXTERNAL_TEACHERS,
  INITIAL_PROGRAMS,
  PARTNERS,
  SUBJECTS,
} from '../../data/programs/mock'

const ProgramsContext = createContext(null)

export function ProgramsProvider({ children }) {
  const [items, setItems] = useState(INITIAL_PROGRAMS)
  const [partners, setPartners] = useState(PARTNERS)
  const [externalTeachers, setExternalTeachers] = useState(EXTERNAL_TEACHERS)
  const [subjects, setSubjects] = useState(SUBJECTS)

  const addPartner = useCallback((partner) => {
    const row = {
      id: `prt-${Date.now()}`,
      name: partner.name.trim(),
      phone: partner.phone?.trim() || '',
      address: partner.address?.trim() || '',
      notes: partner.notes?.trim() || '',
    }
    setPartners((list) => [...list, row])
    return row
  }, [])

  const addExternalTeacher = useCallback((teacher) => {
    const row = {
      id: `ext-${Date.now()}`,
      kind: 'external',
      name: teacher.name.trim(),
      phone: teacher.phone?.trim() || '',
      specialty: teacher.specialty?.trim() || '',
    }
    setExternalTeachers((list) => [...list, row])
    return row
  }, [])

  const addSubject = useCallback((subject) => {
    const row = {
      id: `sub-${Date.now()}`,
      name: subject.name.trim(),
    }
    setSubjects((list) => [...list, row])
    return row
  }, [])

  const saveItem = useCallback((item) => {
    setItems((list) => {
      const index = list.findIndex((row) => row.id === item.id)
      if (index === -1) return [item, ...list]
      const next = [...list]
      next[index] = item
      return next
    })
    return item
  }, [])

  const removeItem = useCallback((id) => {
    setItems((list) => list.filter((row) => row.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      items,
      partners,
      employees: EMPLOYEES,
      externalTeachers,
      subjects,
      addPartner,
      addExternalTeacher,
      addSubject,
      saveItem,
      removeItem,
    }),
    [items, partners, externalTeachers, subjects, addPartner, addExternalTeacher, addSubject, saveItem, removeItem],
  )

  return <ProgramsContext.Provider value={value}>{children}</ProgramsContext.Provider>
}

export function usePrograms() {
  const ctx = useContext(ProgramsContext)
  if (!ctx) {
    throw new Error('usePrograms must be used within ProgramsProvider')
  }
  return ctx
}
