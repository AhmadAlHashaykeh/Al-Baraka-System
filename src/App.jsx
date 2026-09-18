import { useState } from 'react'
import { Construction } from 'lucide-react'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import EmptyState from './components/ui/EmptyState'
import Button from './components/ui/Button'
import { findNavItem } from './components/layout/navigation'

export default function App() {
  const [activeId, setActiveId] = useState('home')

  return (
    <AppLayout
      activeId={activeId}
      onNavigate={setActiveId}
      headerSubtitle="أهلاً بك مجدداً"
    >
      {activeId === 'home' ? (
        <Dashboard />
      ) : (
        <EmptyState
          icon={Construction}
          title={findNavItem(activeId).label}
          description="هذا القسم قيد التطوير — سيتم بناء وحداته في المراحل القادمة اعتماداً على نظام التصميم الحالي."
          action={
            <Button variant="secondary" onClick={() => setActiveId('home')}>
              العودة إلى الرئيسية
            </Button>
          }
          className="min-h-[60vh]"
        />
      )}
    </AppLayout>
  )
}
