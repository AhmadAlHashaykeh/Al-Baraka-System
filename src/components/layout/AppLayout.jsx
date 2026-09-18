import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { findNavItem, getNavItems, resolveNavHighlight } from './navigation'

export default function AppLayout({
  activeId,
  onNavigate,
  headerSubtitle,
  programs = [],
  children,
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const current = findNavItem(activeId, programs)
  const navActiveId = resolveNavHighlight(activeId, programs)

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar
        activeId={navActiveId}
        navItems={getNavItems()}
        onNavigate={(id) => {
          onNavigate(id)
          setMobileNavOpen(false)
        }}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={current.label}
          subtitle={headerSubtitle}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1240px]">{children}</div>
        </main>
      </div>
    </div>
  )
}
