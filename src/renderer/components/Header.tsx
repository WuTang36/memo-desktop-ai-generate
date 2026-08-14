import type { MemoStats } from '../types'

interface HeaderProps {
  stats: MemoStats
}

export function Header({ stats }: HeaderProps): JSX.Element {
  return (
    <header className="header">
      <div className="logo">
        <svg className="logo-icon" viewBox="0 0 512 512" width="36" height="36">
          <defs>
            <linearGradient id="logoBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4a90d9"/>
              <stop offset="100%" stopColor="#2c6fce"/>
            </linearGradient>
            <linearGradient id="logoPaper" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff"/>
              <stop offset="100%" stopColor="#f4f5f9"/>
            </linearGradient>
            <filter id="logoShadow" x="-8%" y="-4%" width="116%" height="112%">
              <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#1a1a2e" floodOpacity="0.18"/>
            </filter>
          </defs>
          <rect x="32" y="32" width="448" height="448" rx="100" ry="100" fill="url(#logoBg)"/>
          <g filter="url(#logoShadow)">
            <rect x="120" y="90" width="272" height="320" rx="22" ry="22" fill="url(#logoPaper)"/>
            <rect x="120" y="90" width="272" height="14" rx="7" ry="7" fill="#4a90d9"/>
            <text x="148" y="160" fontFamily="-apple-system, sans-serif" fontSize="28" fontWeight="700" fill="#4a90d9" opacity="0.8">#</text>
            <line x1="148" y1="180" x2="364" y2="180" stroke="#e2e5ee" strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="148" y1="214" x2="350" y2="214" stroke="#e2e5ee" strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="148" y1="248" x2="364" y2="248" stroke="#e2e5ee" strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="148" y1="282" x2="310" y2="282" stroke="#e2e5ee" strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="148" y1="316" x2="364" y2="316" stroke="#e2e5ee" strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="148" y1="350" x2="280" y2="350" stroke="#e2e5ee" strokeWidth="3.5" strokeLinecap="round"/>
            <circle cx="386" cy="350" r="19" fill="#27ae60"/>
            <polyline points="377,350 383,357 396,341" fill="none" stroke="#fff" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        </svg>
        <span className="logo-text">备忘录</span>
      </div>
      <div className="stats">
        <span>{stats.total}</span> 条备忘 · <span>{stats.done}</span> 条已完成
      </div>
    </header>
  )
}
