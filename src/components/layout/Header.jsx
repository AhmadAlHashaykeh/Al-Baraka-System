import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  HelpCircle,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  Settings,
  User,
} from 'lucide-react'
import { IconButton } from '../ui/Button'
import BrandLogo from '../ui/BrandLogo'
import { cn } from '../../lib/cn'

const NOTIFICATIONS = [
  {
    id: 1,
    title: 'تسجيل جديد',
    body: 'تم تسجيل رنيم الخصاونة في برنامج تدريبي 01',
    time: 'قبل 10 دقائق',
    unread: true,
  },
  {
    id: 2,
    title: 'دفعة مستلمة',
    body: 'تم استلام دفعة بقيمة 1,200 د.أ',
    time: 'قبل ساعة',
    unread: true,
  },
  {
    id: 3,
    title: 'تقرير جاهز',
    body: 'تقرير الحضور الأسبوعي جاهز للعرض',
    time: 'أمس',
    unread: false,
  },
]

const HELP_ITEMS = [
  { icon: BookOpen, label: 'دليل الاستخدام', desc: 'تعرّف على أقسام النظام' },
  { icon: MessageCircle, label: 'تواصل مع الدعم', desc: 'راسل فريق أكاديمية ومركز البركة' },
]

const PROFILE_ITEMS = [
  { icon: User, label: 'الملف الشخصي' },
  { icon: Settings, label: 'إعدادات الحساب' },
  { icon: LogOut, label: 'تسجيل الخروج', danger: true },
]

function Panel({ className, children }) {
  return (
    <div
      className={cn(
        'absolute end-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-pop',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default function Header({ title, subtitle, onOpenMobileNav }) {
  const [openPanel, setOpenPanel] = useState(null) // 'help' | 'notifications' | 'profile' | 'search'
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const actionsRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target)) {
        setOpenPanel(null)
        setMobileSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
        setOpenPanel(null)
        setMobileSearchOpen(false)
      }
      if (e.key === 'Escape') {
        setOpenPanel(null)
        setMobileSearchOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const toggle = (id) => {
    setMobileSearchOpen(false)
    setOpenPanel((cur) => (cur === id ? null : id))
  }
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length

  return (
    <header className="sticky top-0 z-30 border-b border-ink-200/60 bg-ink-50/85 backdrop-blur-md">
      <div className="flex h-[72px] items-center gap-3 px-5 lg:px-8">
        <IconButton
          icon={Menu}
          label="فتح القائمة"
          className="lg:hidden"
          onClick={onOpenMobileNav}
        />

        <div className="flex min-w-0 shrink-0 items-center gap-2.5 sm:max-w-[300px] lg:max-w-none">
          <BrandLogo size="sm" surface="soft" className="hidden sm:inline-flex" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm text-ink-400">
              <span className="hidden font-medium sm:inline">أكاديمية ومركز البركة</span>
              <ChevronLeft className="hidden size-4 shrink-0 opacity-60 sm:block" />
              <span className="truncate text-base font-extrabold text-ink-900">{title}</span>
            </div>
            {subtitle && (
              <p className="mt-0.5 truncate text-xs text-ink-400 sm:hidden">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="relative mx-auto hidden w-full max-w-md flex-1 md:block">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
          <input
            ref={searchRef}
            type="search"
            placeholder="ابحث في النظام…"
            className="h-10 w-full rounded-2xl border border-ink-200 bg-white pe-[4.5rem] ps-10 text-sm text-ink-800 shadow-soft placeholder:text-ink-400 transition-colors hover:border-ink-300 focus:border-brand-400 focus:outline-none"
          />
          <kbd className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 rounded-lg border border-ink-200 bg-ink-50 px-1.5 py-0.5 text-[10px] font-bold text-ink-400">
            Ctrl+K
          </kbd>
        </div>

        <div ref={actionsRef} className="relative ms-auto flex items-center gap-1.5 sm:ms-0">
          {/* Mobile search */}
          <div className="relative md:hidden">
            <IconButton
              icon={Search}
              label="بحث"
              active={mobileSearchOpen}
              onClick={() => {
                setMobileSearchOpen((o) => !o)
                setOpenPanel(null)
              }}
            />
            {mobileSearchOpen && (
              <Panel className="w-[min(92vw,320px)] p-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
                  <input
                    autoFocus
                    type="search"
                    placeholder="ابحث في النظام…"
                    className="h-10 w-full rounded-2xl border border-ink-200 bg-ink-50 pe-3 ps-10 text-sm text-ink-800 focus:border-brand-400 focus:bg-white focus:outline-none"
                  />
                </div>
              </Panel>
            )}
          </div>

          <div className="hidden items-center gap-1.5 sm:flex">
            {/* Help */}
            <div className="relative">
              <IconButton
                icon={HelpCircle}
                label="المساعدة"
                active={openPanel === 'help'}
                onClick={() => toggle('help')}
              />
              {openPanel === 'help' && (
              <Panel className="w-72 overflow-hidden p-0">
                <div className="border-b border-ink-100 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <BrandLogo size="sm" surface="muted" />
                    <div>
                      <p className="text-sm font-extrabold text-ink-900">المساعدة</p>
                      <p className="text-[11px] text-ink-400">أكاديمية ومركز البركة</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  {HELP_ITEMS.map(({ icon: Icon, label, desc }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setOpenPanel(null)}
                      className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-start transition-colors hover:bg-ink-50"
                    >
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                        <Icon className="size-4" strokeWidth={2} />
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-ink-900">{label}</span>
                        <span className="mt-0.5 block text-[11px] text-ink-400">{desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </Panel>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <IconButton
                icon={Bell}
                label="الإشعارات"
                active={openPanel === 'notifications'}
                onClick={() => toggle('notifications')}
              />
              {unreadCount > 0 && (
                <span className="pointer-events-none absolute end-2 top-2 size-2 rounded-full bg-accent-400 ring-2 ring-ink-50" />
              )}
              {openPanel === 'notifications' && (
                <Panel className="w-80">
                  <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
                    <p className="text-sm font-extrabold text-ink-900">الإشعارات</p>
                    <span className="text-[11px] font-bold text-brand-700">
                      {unreadCount} جديدة
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1">
                    {NOTIFICATIONS.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => setOpenPanel(null)}
                        className="flex w-full gap-3 px-4 py-3 text-start transition-colors hover:bg-ink-50"
                      >
                        <span
                          className={cn(
                            'mt-1.5 size-2 shrink-0 rounded-full',
                            n.unread ? 'bg-accent-400' : 'bg-ink-200',
                          )}
                        />
                        <span className="min-w-0">
                          <span className="block text-sm font-bold text-ink-900">{n.title}</span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">
                            {n.body}
                          </span>
                          <span className="mt-1 block text-[11px] text-ink-400">{n.time}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-ink-100 px-4 py-2.5">
                    <button
                      type="button"
                      onClick={() => setOpenPanel(null)}
                      className="text-xs font-bold text-brand-700 hover:text-brand-800"
                    >
                      عرض كل الإشعارات
                    </button>
                  </div>
                </Panel>
              )}
            </div>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggle('profile')}
              aria-expanded={openPanel === 'profile'}
              className={cn(
                'group flex items-center gap-2.5 rounded-2xl border bg-white p-1 pe-3 shadow-soft transition-all',
                openPanel === 'profile'
                  ? 'border-brand-400'
                  : 'border-ink-200 hover:border-ink-300',
              )}
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-brand-500 text-[11px] font-bold text-accent-400">
                أم
              </span>
              <span className="hidden text-start md:block">
                <span className="block text-sm font-bold leading-tight text-ink-800">أحمد محمد</span>
                <span className="block text-[10px] text-ink-400">مدير النظام</span>
              </span>
              <ChevronDown
                className={cn(
                  'hidden size-3.5 text-ink-400 transition-transform md:block',
                  openPanel === 'profile' && 'rotate-180',
                )}
              />
            </button>

            {openPanel === 'profile' && (
              <Panel className="w-56 p-1.5">
                <div className="border-b border-ink-100 px-3 py-2.5 md:hidden">
                  <p className="text-sm font-bold text-ink-900">أحمد محمد</p>
                  <p className="text-[11px] text-ink-400">مدير النظام</p>
                </div>
                {PROFILE_ITEMS.map(({ icon: Icon, label, danger }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setOpenPanel(null)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors',
                      danger
                        ? 'text-danger-700 hover:bg-danger-50'
                        : 'text-ink-700 hover:bg-ink-50 hover:text-ink-900',
                    )}
                  >
                    <Icon className="size-4 shrink-0" strokeWidth={2} />
                    {label}
                  </button>
                ))}
              </Panel>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
