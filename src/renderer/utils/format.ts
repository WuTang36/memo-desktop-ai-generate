import type { Memo } from '../types'

export function formatTime(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number): string => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function buildHistoryTitle(history: Memo['history']): string {
  return history
    .map(
      (h, i) =>
        `第${i + 1}次: ${formatTime(h.time)}\n${h.title ? h.title + ': ' : ''}${h.content.substring(0, 40)}${h.content.length > 40 ? '...' : ''}`
    )
    .join('\n')
}
