import type { Check } from './types'

export function statusText(check: Check | undefined): string {
  if (check === undefined) {
    return 'Не проверялся'
  }
  if (check.ok) {
    return `Работает · ${check.ms} мс`
  }
  return `Не открывается · ${check.status || check.error}`
}