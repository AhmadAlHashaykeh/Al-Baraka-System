import { useEffect, useRef, useState } from 'react'

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

/**
 * Animates a number from 0 → value on mount (and when value changes).
 */
export default function CountUp({
  value,
  duration = 1100,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}) {
  const target = Number(value) || 0
  const [display, setDisplay] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      setDisplay(target)
      return undefined
    }

    const start = performance.now()
    const from = 0

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const next = from + (target - from) * easeOutCubic(t)
      setDisplay(next)
      if (t < 1) frame.current = requestAnimationFrame(tick)
    }

    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [target, duration])

  const formatted = display.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
