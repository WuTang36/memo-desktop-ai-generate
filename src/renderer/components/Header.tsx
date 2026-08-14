import type { MemoStats } from '../types'

interface HeaderProps {
  stats: MemoStats
}

export function Header({ stats }: HeaderProps): JSX.Element {
  return (
    <header className="header">
      <div className="logo">
        <svg className="logo-icon" viewBox="0 0 40 40" width="32" height="32">
          <rect x="6" y="4" width="28" height="32" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <line x1="12" y1="12" x2="28" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="18" x2="24" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="24" x2="20" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="logo-text">备忘录</span>
      </div>
      <div className="stats">
        <span>{stats.total}</span> 条备忘 · <span>{stats.done}</span> 条已完成
      </div>
    </header>
  )
}
