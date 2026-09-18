import { useState } from 'react'
import { Construction } from 'lucide-react'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import EmptyState from './components/ui/EmptyState'
import Button from './components/ui/Button'
import {
  findNavItem,
  isProgramsDeptRoute,
  recordIdFromRoute,
} from './components/layout/navigation'
import { ProgramsProvider, usePrograms } from './hooks/programs/ProgramsContext'
import ProgramsPage from './pages/programs/ProgramsPage'
import PackagesPage from './pages/programs/PackagesPage'
import PartnersPage from './pages/programs/PartnersPage'
import SubjectsPage from './pages/programs/SubjectsPage'
import TeachersPage from './pages/programs/TeachersPage'
import ExpensesHubPage from './pages/programs/ExpensesHubPage'
import RegistrationSettingsPage from './pages/programs/RegistrationSettingsPage'
import ProgramFormPage from './pages/programs/ProgramFormPage'
import ProgramDetailsPage from './pages/programs/ProgramDetailsPage'

function ProgramsRouter({ activeId, onNavigate }) {
  const { items } = usePrograms()

  if (activeId === 'programs-create:package') {
    return <ProgramFormPage key="create-package" mode="create" forcedType="package" onNavigate={onNavigate} />
  }
  if (activeId === 'programs-create:program' || activeId === 'programs-create') {
    return <ProgramFormPage key="create-program" mode="create" forcedType="program" onNavigate={onNavigate} />
  }

  if (String(activeId).startsWith('programs-edit:')) {
    const id = recordIdFromRoute(activeId)
    const item = items.find((row) => row.id === id)
    if (!item) {
      return (
        <EmptyState
          title="العنصر غير موجود"
          description="تعذر العثور على البرنامج أو الحقيبة المطلوبة."
          action={
            <Button variant="secondary" onClick={() => onNavigate('programs-manage')}>
              العودة إلى إدارة البرامج
            </Button>
          }
          className="min-h-[60vh]"
        />
      )
    }
    return <ProgramFormPage key={item.id} mode="edit" item={item} onNavigate={onNavigate} />
  }

  if (String(activeId).startsWith('programs-detail:')) {
    const id = recordIdFromRoute(activeId)
    const item = items.find((row) => row.id === id)
    if (!item) {
      return (
        <EmptyState
          title="العنصر غير موجود"
          description="تعذر العثور على البرنامج أو الحقيبة المطلوبة."
          action={
            <Button variant="secondary" onClick={() => onNavigate('programs-manage')}>
              العودة إلى إدارة البرامج
            </Button>
          }
          className="min-h-[60vh]"
        />
      )
    }
    return <ProgramDetailsPage item={item} onNavigate={onNavigate} />
  }

  if (activeId === 'packages-manage') return <PackagesPage onNavigate={onNavigate} />
  if (activeId === 'partners-manage') return <PartnersPage onNavigate={onNavigate} />
  if (activeId === 'subjects-manage') return <SubjectsPage />
  if (activeId === 'teachers-manage') return <TeachersPage />
  if (activeId === 'expenses-manage') return <ExpensesHubPage onNavigate={onNavigate} />
  if (activeId === 'registration-settings') return <RegistrationSettingsPage onNavigate={onNavigate} />

  return <ProgramsPage onNavigate={onNavigate} />
}

function subtitleFor(activeId) {
  if (String(activeId).startsWith('programs-create')) return 'إنشاء سجل جديد'
  if (String(activeId).startsWith('programs-edit:')) return 'تعديل بيانات تشغيلية'
  if (String(activeId).startsWith('programs-detail:')) return 'عرض السجل'
  return 'وحدات الإدارة — ليست سجلات تشغيلية'
}

function AppShell() {
  const [activeId, setActiveId] = useState('home')
  const { items } = usePrograms()
  const inPrograms = isProgramsDeptRoute(activeId)

  return (
    <AppLayout
      activeId={activeId}
      onNavigate={setActiveId}
      headerSubtitle={inPrograms ? subtitleFor(activeId) : 'أهلاً بك مجدداً'}
      programs={items}
    >
      {activeId === 'home' ? (
        <Dashboard />
      ) : inPrograms ? (
        <ProgramsRouter activeId={activeId} onNavigate={setActiveId} />
      ) : (
        <EmptyState
          icon={Construction}
          title={findNavItem(activeId, items).label}
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

export default function App() {
  return (
    <ProgramsProvider>
      <AppShell />
    </ProgramsProvider>
  )
}
