import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { NAV_ITEMS } from './navigation'
import BrandLogo from '../ui/BrandLogo'

function NavLeaf({ item, active, onClick, nested = false }) {
  const Icon = item.icon
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex w-full items-center gap-3 rounded-2xl text-sm transition-all duration-200',
        nested ? 'px-3 py-2' : 'px-3.5 py-2.5',
        active
          ? 'bg-brand-500 font-bold text-white shadow-brand'
          : 'font-medium text-ink-500 hover:bg-ink-100 hover:text-ink-800',
      )}
    >
      <Icon
        className={cn(
          'size-[18px] shrink-0 transition-colors',
          nested && 'size-4',
          active ? 'text-accent-400' : 'text-ink-400 group-hover:text-ink-600',
        )}
        strokeWidth={2}
      />
      <span className="truncate">{item.label}</span>
    </button>
  )
}

function NavGroup({ item, activeId, onNavigate }) {
  const childActive = item.children.some((c) => c.id === activeId)
  const [manualOpen, setManualOpen] = useState(false)
  const [forceClosed, setForceClosed] = useState(false)
  const open = forceClosed ? false : childActive || manualOpen
  const Icon = item.icon

  if (!childActive && forceClosed) {
    setForceClosed(false)
  }

  const toggle = () => {
    if (open) {
      setForceClosed(true)
      setManualOpen(false)
    } else {
      setForceClosed(false)
      setManualOpen(true)
    }
  }

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={toggle}
        className={cn(
          'group flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm transition-all duration-200',
          childActive || open
            ? 'bg-brand-50 font-bold text-brand-800'
            : 'font-medium text-ink-500 hover:bg-ink-100 hover:text-ink-800',
        )}
      >
        <Icon
          className="size-[18px] shrink-0 text-ink-400 group-hover:text-ink-600"
          strokeWidth={2}
        />
        <span className="flex-1 truncate text-start">{item.label}</span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-ink-400 transition-transform duration-300',
            open && 'rotate-180',
          )}
        />
      </button>

      <div
        className={cn(
          'grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="mt-1 flex flex-col gap-0.5 ps-3">
            {item.children.map((child) => (
              <NavLeaf
                key={child.id}
                item={child}
                nested
                active={activeId === child.id}
                onClick={() => onNavigate(child.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({
  activeId,
  onNavigate,
  mobileOpen,
  onCloseMobile,
  navItems = NAV_ITEMS,
}) {
  const content = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 overflow-visible px-5 pt-6 pb-5">
        <BrandLogo size="md" surface="soft" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-black leading-tight text-ink-900 sm:text-sm">
            أكاديمية ومركز البركة
          </p>
          <p className="truncate text-[11px] font-medium text-ink-400">نظام الإدارة</p>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="إغلاق القائمة"
          className="inline-flex size-8 items-center justify-center rounded-xl text-ink-400 hover:bg-ink-100 hover:text-ink-700 lg:hidden"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <p className="px-3.5 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-400">
          القائمة الرئيسية
        </p>
        <div className="flex flex-col gap-1">
          {navItems.map((item) =>
            item.children ? (
              item.children.length === 0 ? (
                <NavLeaf
                  key={item.id}
                  item={item}
                  active={item.isActive?.(activeId) || activeId === item.id}
                  onClick={() => onNavigate(item.id)}
                />
              ) : (
                <NavGroup key={item.id} item={item} activeId={activeId} onNavigate={onNavigate} />
              )
            ) : (
              <NavLeaf
                key={item.id}
                item={item}
                active={activeId === item.id}
                onClick={() => onNavigate(item.id)}
              />
            ),
          )}
        </div>
      </nav>

      {/* Brand footer */}
      <div className="border-t border-ink-100 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-ink-50 px-3 py-3">
          <BrandLogo size="sm" surface="soft" />
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-ink-900">أكاديمية ومركز البركة</p>
            <p className="truncate text-[11px] text-ink-400">دعم فني · support@albaraka.jo</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 border-e border-ink-200/80 bg-white lg:block">
        {content}
      </aside>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-ink-900/35 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onCloseMobile}
      />
      <aside
        className={cn(
          'fixed inset-y-0 start-0 z-50 w-[300px] bg-white shadow-pop transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden',
          mobileOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {content}
      </aside>
    </>
  )
}
