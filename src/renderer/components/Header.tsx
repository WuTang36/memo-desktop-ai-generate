import type { MemoStats } from '../types'

interface HeaderProps {
  stats: MemoStats
}

export function Header({ stats }: HeaderProps): JSX.Element {
  return (
    <header className="header">
      <div className="logo">
        <svg className="logo-icon" viewBox="0 0 40 40" width="32" height="32">
          <rect x="4" y="3" width="32" height="34" rx="4" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <rect x="4" y="3" width="32" height="8" rx="4" fill="currentColor" opacity="0.15" />
          <line x1="11" y1="16" x2="29" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="11" y1="21" x2="27" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="11" y1="26" x2="23" y2="26" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="logo-text">备忘录</span>
      </div>
      <div className="stats">
        <span>{stats.total}</span> 条备忘 · <span>{stats.done}</span> 条已完成
      </div>
    </header>
  )
}
