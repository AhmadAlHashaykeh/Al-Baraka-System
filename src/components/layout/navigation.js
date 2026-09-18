import {
  LayoutDashboard,
  Layers,
  ClipboardList,
  Users,
  Wallet,
  GraduationCap,
} from 'lucide-react'

/** Single source of truth for the sidebar navigation tree. */
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
    children: [
      { id: 'program-01', label: 'برنامج تدريبي 01', icon: GraduationCap },
      { id: 'program-02', label: 'برنامج تدريبي 02', icon: GraduationCap },
    ],
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

/** Flat lookup used by the header to resolve the current page title. */
export function findNavItem(id) {
  for (const item of NAV_ITEMS) {
    if (item.id === id) return item
    const child = item.children?.find((c) => c.id === id)
    if (child) return child
  }
  return NAV_ITEMS[0]
}
