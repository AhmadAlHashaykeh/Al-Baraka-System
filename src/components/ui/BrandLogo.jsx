import { cn } from '../../lib/cn'
import logo from '../../assets/logo.png'

const boxSizes = {
  sm: 'h-9 w-9 min-h-9 min-w-9 p-[7px]',
  md: 'h-11 w-11 min-h-11 min-w-11 p-2',
  lg: 'h-14 w-14 min-h-14 min-w-14 p-2.5',
  xl: 'h-20 w-20 min-h-20 min-w-20 p-3.5',
}

const surfaces = {
  none: 'bg-transparent',
  soft: 'bg-white ring-1 ring-ink-200/80 shadow-soft',
  muted: 'bg-ink-50 ring-1 ring-ink-100',
  brand: 'bg-brand-500 shadow-brand',
  dark: 'bg-ink-900 shadow-soft',
  accent: 'bg-accent-400 shadow-accent',
}

/**
 * شعار مركز البركة (خلفية شفافة)
 * tone: color | white | auto
 * مربع ثابت + padding — بدون قصّ للشعار
 */
export default function BrandLogo({
  size = 'md',
  tone = 'auto',
  surface = 'soft',
  className,
  imgClassName,
}) {
  const onDark = surface === 'brand' || surface === 'dark' || surface === 'accent'
  const resolvedTone = tone === 'auto' ? (onDark ? 'white' : 'color') : tone

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-visible rounded-2xl box-border',
        boxSizes[size] ?? boxSizes.md,
        surfaces[surface] ?? surfaces.soft,
        className,
      )}
    >
      <img
        src={logo}
        alt="أكاديمية ومركز البركة"
        className={cn(
          'block h-full w-full object-contain object-center select-none',
          resolvedTone === 'white' && 'brightness-0 invert',
          imgClassName,
        )}
        draggable={false}
      />
    </span>
  )
}
