/** Tiny class-name joiner — keeps components readable without extra deps. */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
