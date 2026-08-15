import ReactMarkdown from 'react-markdown'
import { formatTime, buildHistoryTitle } from '../utils/format'
import type { Memo } from '../types'

interface MemoCardViewProps {
  memo: Memo
  onToggleDone: (id: string) => void
  onDelete: (id: string) => void
  onEdit: () => void
}

export function MemoCardView({ memo, onToggleDone, onDelete, onEdit }: MemoCardViewProps): JSX.Element {
  const displayTitle = memo.title || '（无标题）'
  const hasHistory = memo.history && memo.history.length > 0

  return (
    <div
      className={`memo-card${memo.done ? ' done' : ''}`}
      style={memo.color ? { background: memo.color } : undefined}
      data-id={memo.id}
    >
      <div className="memo-title">{displayTitle}</div>
      <div className="memo-body">
        <ReactMarkdown>{memo.content}</ReactMarkdown>
      </div>
      <div className="memo-meta">
        <span className="memo-time">创建于 {formatTime(memo.createdAt)}</span>
        {hasHistory && (
          <span className="memo-time memo-edit-time">· 最近编辑于 {formatTime(memo.updatedAt)}</span>
        )}
        {hasHistory && (
          <span className="history-badge" title={buildHistoryTitle(memo.history)}>
            <svg className="history-icon" viewBox="0 0 16 16" width="12" height="12" style={{ verticalAlign: 'middle' }}>
              <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <polyline points="8,4 8,8 11,10" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            编辑过 {memo.history.length} 次
          </span>
        )}
      </div>
      <div className="memo-actions">
        <button className="btn btn-sm btn-toggle" onClick={() => onToggleDone(memo.id)}>
          {memo.done ? '↩ 取消完成' : '✓ 完成'}
        </button>
        <button className="btn btn-sm btn-edit" onClick={onEdit}>
          ✎ 编辑
        </button>
        <button className="btn btn-sm btn-danger btn-delete" onClick={() => onDelete(memo.id)}>
          ✕ 删除
        </button>
      </div>
    </div>
  )
}
