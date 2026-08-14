import { useState, useRef, useEffect } from 'react'
import type { Memo } from '../types'

interface MemoCardProps {
  memo: Memo
  onToggleDone: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, title: string, content: string) => void
}

export function MemoCard({ memo, onToggleDone, onDelete, onUpdate }: MemoCardProps): JSX.Element {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(memo.title)
  const [editContent, setEditContent] = useState(memo.content)
  const contentInputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing) {
      contentInputRef.current?.focus()
    }
  }, [editing])

  const handleSave = (): void => {
    const trimmed = editContent.trim()
    if (!trimmed) return
    setEditing(false)
    onUpdate(memo.id, editTitle.trim(), trimmed)
  }

  const handleCancel = (): void => {
    setEditTitle(memo.title)
    setEditContent(memo.content)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSave()
    }
    if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const formatTime = (iso: string): string => {
    const d = new Date(iso)
    const pad = (n: number): string => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  const buildHistoryTitle = (history: Memo['history']): string => {
    return history.map((h, i) =>
      `第${i + 1}次: ${formatTime(h.time)}\n${h.title ? h.title + ': ' : ''}${h.content.substring(0, 40)}${h.content.length > 40 ? '...' : ''}`
    ).join('\n')
  }

  const hasHistory = memo.history && memo.history.length > 0
  const title = memo.title || '（无标题）'

  if (editing) {
    return (
      <div className="memo-card editing" data-id={memo.id}>
        <input
          type="text"
          className="edit-title-input"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          maxLength={100}
          placeholder="标题（可选）"
        />
        <textarea
          ref={contentInputRef}
          className="edit-content-input"
          value={editContent}
          onChange={e => setEditContent(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          maxLength={500}
        />
        <div className="edit-actions">
          <button className="btn btn-sm btn-success" onClick={handleSave}>保存</button>
          <button className="btn btn-sm btn-warning" onClick={handleCancel}>取消</button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`memo-card${memo.done ? ' done' : ''}`}
      style={memo.color ? { background: memo.color } : undefined}
      data-id={memo.id}
    >
      <div className="memo-title memo-title-display">{escapeHtml(title)}</div>
      <div className="memo-body">{escapeHtml(memo.content)}</div>
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
        <button className="btn btn-sm btn-edit" onClick={() => setEditing(true)}>
          ✎ 编辑
        </button>
        <button className="btn btn-sm btn-danger btn-delete" onClick={() => onDelete(memo.id)}>
          ✕ 删除
        </button>
      </div>
    </div>
  )
}

function escapeHtml(str: string): string {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}
