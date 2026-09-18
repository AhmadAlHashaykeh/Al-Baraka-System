import { useMemo, useState } from 'react'
import {
  ArrowUpLeft,
  ArrowDownLeft,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  Clock3,
  Filter,
  GraduationCap,
  Layers,
  MoveLeft,
  Plus,
  RefreshCw,
  Search,
  Wallet,
  XCircle,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Button from '../components/ui/Button'
import Card, { CardBody, CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import BrandLogo from '../components/ui/BrandLogo'
import CountUp from '../components/ui/CountUp'
import Input from '../components/ui/Input'
import Dropdown from '../components/ui/Dropdown'
import Modal from '../components/ui/Modal'
import Table, { TBody, TD, TH, THead, TR } from '../components/ui/Table'
import { cn } from '../lib/cn'

/* ------------------------------------------------------------------ KPIs */

const HERO = {
  label: 'الطلاب النشطون',
  value: 486,
  delta: '+12%',
  up: true,
  hint: 'عرض التفاصيل',
}

const KPI_CARDS = [
  {
    label: 'البرامج التدريبية',
    value: 24,
    delta: '+2',
    up: true,
    hint: 'عرض التفاصيل',
  },
]

const REVENUE_OPTIONS = ['الكل', 'برنامج تدريبي 01', 'برنامج تدريبي 02']

const REVENUE_BY_PROGRAM = {
  الكل: {
    amount: 38200,
    delta: -3,
    up: false,
    spark: [32, 36, 34, 40, 38, 42, 39, 38],
  },
  'برنامج تدريبي 01': {
    amount: 22400,
    delta: 5,
    up: true,
    spark: [18, 20, 19, 22, 21, 24, 23, 22],
  },
  'برنامج تدريبي 02': {
    amount: 15800,
    delta: -8,
    up: false,
    spark: [14, 16, 15, 18, 17, 18, 16, 16],
  },
}

function RevenueSparkline({ values, up }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const w = 120
  const h = 36
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w
      const y = h - ((v - min) / range) * (h - 4) - 2
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-[120px]" aria-hidden="true">
      <polyline
        fill="none"
        stroke={up ? 'var(--color-success-500)' : 'var(--color-danger-500)'}
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

/* ----------------------------------------------------------- Mini panels */

const PANELS = [
  { code: 'P01', label: 'برنامج تدريبي 01', value: '186', status: 'نشط', ok: true, icon: GraduationCap },
  { code: 'P02', label: 'برنامج تدريبي 02', value: '142', status: 'نشط', ok: true, icon: Layers },
  { code: 'REG', label: 'التسجيلات', value: '57', status: 'هذا الشهر', ok: true, icon: ClipboardList },
  { code: 'FIN', label: 'المالية', value: '12', status: 'معلّق', ok: false, icon: Wallet },
]

/* ---------------------------------------------------------------- Chart */

/** بيانات تسجيلات شهرية تجريبية — سنة 2026 كاملة */
const REGISTRATIONS_SERIES = [
  { month: 1, year: 2026, enrollments: 42 },
  { month: 2, year: 2026, enrollments: 55 },
  { month: 3, year: 2026, enrollments: 48 },
  { month: 4, year: 2026, enrollments: 70 },
  { month: 5, year: 2026, enrollments: 52 },
  { month: 6, year: 2026, enrollments: 90 },
  { month: 7, year: 2026, enrollments: 68 },
  { month: 8, year: 2026, enrollments: 58 },
  { month: 9, year: 2026, enrollments: 64 },
  { month: 10, year: 2026, enrollments: 72 },
  { month: 11, year: 2026, enrollments: 61 },
  { month: 12, year: 2026, enrollments: 77 },
]

const CHART_PERIODS = {
  'آخر 3 أشهر': 3,
  'آخر 6 أشهر': 6,
  'آخر 8 أشهر': 8,
  'هذه السنة': 12,
}

function buildChartData(series) {
  return series.map((row, i) => {
    const prev = i > 0 ? series[i - 1].enrollments : row.enrollments
    const growth = i === 0 ? 0 : Math.round(((row.enrollments - prev) / prev) * 100)
    return {
      ...row,
      growth,
      label: `${row.month}/${row.year}`,
    }
  })
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  const up = point.growth >= 0

  return (
    <div className="min-w-[148px] rounded-2xl bg-ink-900 px-3.5 py-3 text-white shadow-pop">
      <p className="text-[10px] font-bold text-white/45">{point.label}</p>
      <div className="mt-2 flex items-center justify-between gap-6 text-xs">
        <span className="text-white/55">التسجيلات</span>
        <span className="font-black tabular-nums">{point.enrollments}</span>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-6 text-xs">
        <span className="text-white/55">النمو</span>
        <span className={cn('font-black tabular-nums', up ? 'text-accent-400' : 'text-danger-500')}>
          {up ? '+' : ''}
          {point.growth}%
        </span>
      </div>
    </div>
  )
}

function RegistrationsChart({ period = 'آخر 8 أشهر' }) {
  const data = useMemo(() => {
    const count = CHART_PERIODS[period] ?? 8
    const slice = REGISTRATIONS_SERIES.slice(-count)
    return buildChartData(slice)
  }, [period])

  return (
    <div dir="ltr" className="h-56 w-full sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 16, left: -8, bottom: 8 }}>
          <defs>
            <linearGradient id="enrollFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f9bc15" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#f9bc15" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#ebedf3" strokeDasharray="3 6" vertical={false} />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8b93a8', fontSize: data.length > 8 ? 10 : 11, fontWeight: 600 }}
            dy={8}
            interval={0}
            minTickGap={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8b93a8', fontSize: 11, fontWeight: 600 }}
            width={36}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: '#2b3e9e', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area
            type="monotone"
            dataKey="enrollments"
            stroke="#f9bc15"
            strokeWidth={2.5}
            fill="url(#enrollFill)"
            activeDot={{
              r: 6,
              fill: '#2b3e9e',
              stroke: '#fff',
              strokeWidth: 2,
            }}
            dot={{ r: 3.5, fill: '#f9bc15', strokeWidth: 0 }}
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ------------------------------------------------------------ Table */

const ENROLLMENTS = [
  { name: 'رنيم الخصاونة', program: 'برنامج تدريبي 01', date: '2026/09/15', time: '10:24 ص', status: 'مؤكد', amount: '1,200 د.أ' },
  { name: 'أحمد الزعبي', program: 'برنامج تدريبي 02', date: '2026/09/14', time: '02:10 م', status: 'قيد المراجعة', amount: '950 د.أ' },
  { name: 'دانا العبادي', program: 'برنامج تدريبي 01', date: '2026/09/13', time: '11:05 ص', status: 'مؤكد', amount: '1,200 د.أ' },
  { name: 'محمود الشطناوي', program: 'برنامج تدريبي 02', date: '2026/09/12', time: '09:40 ص', status: 'ملغي', amount: '—' },
  { name: 'هبة المجالي', program: 'برنامج تدريبي 01', date: '2026/09/11', time: '04:22 م', status: 'مؤكد', amount: '1,200 د.أ' },
]

const STATUS_META = {
  مؤكد: { variant: 'success', icon: CheckCircle2 },
  'قيد المراجعة': { variant: 'accent', icon: Clock3 },
  ملغي: { variant: 'danger', icon: XCircle },
}

/* ================================================================= Page */

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false)
  const [revenueProgram, setRevenueProgram] = useState('الكل')
  const [chartPeriod, setChartPeriod] = useState('آخر 8 أشهر')
  const revenue = REVENUE_BY_PROGRAM[revenueProgram]

  return (
    <div className="flex flex-col gap-6">
      {/* Page toolbar */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            نظرة عامة
          </h2>
          <p className="mt-1 text-sm text-ink-400">
            ملخص أداء المركز — بيانات تجريبية لأغراض العرض
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Dropdown
            options={['هذا الشهر', 'آخر 3 أشهر', 'هذه السنة']}
            className="w-[148px]"
          />
          <Button variant="outline" icon={RefreshCw}>
            تحديث
          </Button>
          <Button icon={Plus} variant="accent" onClick={() => setModalOpen(true)}>
            إضافة طالب جديد
          </Button>
        </div>
      </div>

      {/* Hero KPI row — like OripioFin balance cards */}
      <div className="relative z-20 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Primary brand card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-500 to-brand-400 p-6 text-white shadow-brand">
          <div className="absolute -end-8 -top-8 size-32 rounded-full bg-accent-400/20" />
          <div className="absolute -bottom-10 -start-6 size-28 rounded-full bg-black/10" />
          <div className="relative">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <BrandLogo size="sm" tone="white" surface="none" className="rounded-xl bg-white/15" />
                <p className="text-sm font-medium text-white/80">{HERO.label}</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-400 px-2.5 py-0.5 text-[11px] font-bold text-brand-950">
                <ArrowUpLeft className="size-3" />
                {HERO.delta}
              </span>
            </div>
            <p className="num-display mt-6 text-5xl sm:text-[52px]">
              <CountUp value={HERO.value} />
            </p>
            <button
              type="button"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-bold text-accent-300 transition-opacity hover:opacity-100 opacity-90"
            >
              {HERO.hint}
              <MoveLeft className="size-3.5" />
            </button>
          </div>
        </div>

        {KPI_CARDS.map((card) => (
          <Card key={card.label} className="p-6">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-ink-400">{card.label}</p>
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold',
                  card.up ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700',
                )}
              >
                {card.up ? <ArrowUpLeft className="size-3" /> : <ArrowDownLeft className="size-3" />}
                {card.delta}
              </span>
            </div>
            <p className="num-display mt-6 text-4xl text-ink-900 sm:text-[42px]">
              <CountUp value={card.value} />
            </p>
            <button
              type="button"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-bold text-ink-500 transition-colors hover:text-brand-700"
            >
              {card.hint}
              <MoveLeft className="size-3.5" />
            </button>
          </Card>
        ))}

        {/* Monthly revenue — same rhythm as other KPI cards */}
        <Card className="relative z-30 flex flex-col overflow-visible p-6">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-ink-400">الإيرادات الشهرية</p>
            <span
              className={cn(
                'inline-flex shrink-0 items-center gap-1 rounded-2xl px-2.5 py-0.5 text-[11px] font-bold',
                revenue.up ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700',
              )}
            >
              {revenue.up ? <ArrowUpLeft className="size-3" /> : <ArrowDownLeft className="size-3" />}
              {revenue.up ? '+' : ''}
              {revenue.delta}%
            </span>
          </div>

          <div className="mt-6 flex items-end justify-between gap-3">
            <p className="num-display text-4xl text-ink-900 sm:text-[42px]">
              <CountUp key={revenueProgram} value={revenue.amount} suffix=" د.أ" />
            </p>
            <RevenueSparkline values={revenue.spark} up={revenue.up} />
          </div>

          <div className="mt-auto border-t border-ink-100 pt-4">
            <div className="flex items-center justify-between gap-3">
              <span className="shrink-0 text-[11px] font-bold text-ink-400">البرنامج</span>
              <Dropdown
                size="sm"
                options={REVENUE_OPTIONS}
                value={revenueProgram}
                onChange={setRevenueProgram}
                className="min-w-0 flex-1"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Middle: panels + chart */}
      <div className="relative z-0 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-5">
          <CardHeader
            title="البرامج والحالة"
            subtitle="نظرة سريعة على الوحدات النشطة"
            action={
              <Button variant="ghost" size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
                جديد
              </Button>
            }
          />
          <CardBody className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PANELS.map((p) => {
              const Icon = p.icon
              return (
                <div
                  key={p.code}
                  className="rounded-2xl border border-ink-100 bg-ink-50/60 p-4 transition-colors hover:bg-ink-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-white shadow-soft">
                      <Icon className="size-4 text-brand-500" strokeWidth={2} />
                    </span>
                    <span
                      className={cn(
                        'text-[11px] font-bold',
                        p.ok ? 'text-success-700' : 'text-danger-700',
                      )}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="mt-3 text-xs font-bold text-ink-400">{p.code}</p>
                  <p className="mt-0.5 truncate text-sm font-extrabold text-ink-900">{p.label}</p>
                  <p className="num-display mt-2 text-2xl text-ink-900">{p.value}</p>
                </div>
              )
            })}
          </CardBody>
        </Card>

        <Card className="relative z-0 overflow-visible xl:col-span-7">
          <CardHeader
            title="التسجيلات الشهرية"
            subtitle="تدفق التسجيلات خلال الأشهر الماضية"
            action={
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Dropdown
                  size="sm"
                  options={Object.keys(CHART_PERIODS)}
                  value={chartPeriod}
                  onChange={setChartPeriod}
                  className="w-[132px]"
                />
                <Badge variant="accent" icon={CircleDot}>
                  مباشر
                </Badge>
              </div>
            }
          />
          <CardBody className="pt-4">
            <RegistrationsChart period={chartPeriod} />
          </CardBody>
        </Card>
      </div>

      {/* Recent activities table */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-6 py-4">
          <div>
            <h3 className="text-base font-extrabold text-ink-900">أحدث التسجيلات</h3>
            <p className="mt-0.5 text-xs text-ink-400">آخر العمليات في دائرة التسجيل</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute start-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-400" />
              <input
                type="search"
                placeholder="بحث…"
                className="h-9 w-40 rounded-full border border-ink-200 bg-ink-50 pe-3 ps-9 text-xs text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:outline-none sm:w-48"
              />
            </div>
            <Button variant="outline" size="sm" icon={Filter}>
              تصفية
            </Button>
          </div>
        </div>

        <Table>
          <THead>
            <TR hover={false}>
              <TH>المتدرب</TH>
              <TH>البرنامج</TH>
              <TH>التاريخ</TH>
              <TH>الوقت</TH>
              <TH>الحالة</TH>
              <TH className="text-end">المبلغ</TH>
            </TR>
          </THead>
          <TBody>
            {ENROLLMENTS.map((row) => (
              <TR key={row.name + row.date}>
                <TD>
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                      {row.name.slice(0, 1)}
                    </span>
                    <span className="font-bold text-ink-900">{row.name}</span>
                  </div>
                </TD>
                <TD>{row.program}</TD>
                <TD className="tabular-nums text-ink-400">{row.date}</TD>
                <TD className="tabular-nums text-ink-400">{row.time}</TD>
                <TD>
                  <Badge
                    variant={STATUS_META[row.status].variant}
                    icon={STATUS_META[row.status].icon}
                  >
                    {row.status}
                  </Badge>
                </TD>
                <TD className="text-end font-bold tabular-nums">{row.amount}</TD>
              </TR>
            ))}
          </TBody>
        </Table>

        <div className="flex items-center justify-between border-t border-ink-100 px-6 py-3.5">
          <p className="text-xs text-ink-400">عرض 5 من أصل 57 تسجيلاً</p>
          <Button variant="ghost" size="sm" iconEnd={MoveLeft}>
            عرض الكل
          </Button>
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="إضافة طالب جديد"
        subtitle="نموذج تجريبي لعرض مكونات الإدخال"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              إلغاء
            </Button>
            <Button icon={Plus} onClick={() => setModalOpen(false)}>
              حفظ الطالب
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input id="trainee-name" label="اسم الطالب" placeholder="الاسم الكامل" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="trainee-phone"
              label="رقم الجوال"
              placeholder="05xxxxxxxx"
              dir="ltr"
              inputClassName="text-end"
            />
            <Dropdown
              label="البرنامج التدريبي"
              options={['برنامج تدريبي 01', 'برنامج تدريبي 02']}
            />
          </div>
          <Input
            id="trainee-notes"
            label="ملاحظات"
            placeholder="ملاحظات إضافية (اختياري)"
            hint="هذه الواجهة للعرض فقط ولا تقوم بحفظ البيانات"
          />
        </div>
      </Modal>
    </div>
  )
}
