import {
  LayoutDashboard,
  Layers,
  ClipboardList,
  Users,
  Wallet,
  GraduationCap,
  BookMarked,
  Handshake,
  BookOpen,
  UserRound,
  Receipt,
  FileSignature,
} from 'lucide-react'

/** Management pages only — never inject business records into the sidebar. */
export const PROGRAMS_NAV = [
  { id: 'programs-manage', label: 'إدارة البرامج', icon: GraduationCap },
  { id: 'packages-manage', label: 'إدارة الحقائب', icon: BookMarked },
  { id: 'partners-manage', label: 'الشركاء', icon: Handshake },
  { id: 'subjects-manage', label: 'المواد', icon: BookOpen },
  { id: 'teachers-manage', label: 'المدرسون الخارجيون', icon: UserRound },
  { id: 'expenses-manage', label: 'مصاريف البرامج', icon: Receipt },
  { id: 'registration-settings', label: 'إعدادات التسجيل والعقود', icon: FileSignature },
]

const PROGRAMS_NAV_IDS = new Set(PROGRAMS_NAV.map((item) => item.id))

export function isProgramsDeptRoute(activeId) {
  if (!activeId) return false
  if (activeId === 'programs' || PROGRAMS_NAV_IDS.has(activeId)) return true
  const id = String(activeId)
  return (
    id.startsWith('programs-create') ||
    id.startsWith('programs-edit:') ||
    id.startsWith('programs-detail:')
  )
}

export function recordIdFromRoute(activeId) {
  for (const prefix of ['programs-detail:', 'programs-edit:']) {
    if (String(activeId).startsWith(prefix)) return activeId.slice(prefix.length)
  }
  return null
}

export function listRouteForType(type) {
  return type === 'package' ? 'packages-manage' : 'programs-manage'
}

export function detailRoute(id) {
  return `programs-detail:${id}`
}

export function editRoute(id) {
  return `programs-edit:${id}`
}

export function createRoute(type) {
  return type === 'package' ? 'programs-create:package' : 'programs-create:program'
}

/** Sidebar highlight target: a management page, never a record id. */
export function resolveNavHighlight(activeId, items = []) {
  if (
    activeId === 'programs' ||
    activeId === 'programs-create' ||
    activeId === 'programs-create:program'
  ) {
    return 'programs-manage'
  }
  if (activeId === 'programs-create:package') return 'packages-manage'
  const recordId = recordIdFromRoute(activeId)
  if (recordId) {
    const item = items.find((row) => row.id === recordId)
    return listRouteForType(item?.type)
  }
  return activeId
}

export const NAV_ITEMS = [
  {
    id: 'home',
    label: 'الرئيسية',
    icon: LayoutDashboard,
  },
  {
    id: 'programs',
    label: 'دائرة البرامج والحقائب',
    icon: Layers,
    children: PROGRAMS_NAV,
  },
  {
    id: 'registration',
    label: 'دائرة التسجيل',
    icon: ClipboardList,
  },
  {
    id: 'staff',
    label: 'دائرة الموظفين',
    icon: Users,
  },
  {
    id: 'finance',
    label: 'دائرة المالية',
    icon: Wallet,
  },
]

export function getNavItems() {
  return NAV_ITEMS
}

/** Flat lookup used by the header to resolve the current page title. */
export function findNavItem(id, programs = []) {
  for (const item of NAV_ITEMS) {
    if (item.id === id) return item
    const child = item.children?.find((row) => row.id === id)
    if (child) return child
  }

  if (id === 'programs-create:package') {
    return { id, label: 'إضافة حقيبة' }
  }
  if (id === 'programs-create:program' || id === 'programs-create') {
    return { id, label: 'إضافة برنامج' }
  }

  const recordId = recordIdFromRoute(id)
  if (recordId) {
    const match = programs.find((row) => row.id === recordId)
    if (String(id).startsWith('programs-edit:')) {
      return { id, label: match ? `تعديل · ${match.name}` : 'تعديل' }
    }
    return { id, label: match?.name || 'التفاصيل' }
  }

  return NAV_ITEMS[0]
}
