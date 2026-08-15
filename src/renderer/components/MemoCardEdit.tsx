import { useRef, useEffect } from 'react'
import { MarkdownEditor } from './MarkdownEditor'
import type { Memo } from '../types'

interface MemoCardEditProps {
  memo: Memo
  editTitle: string
  editContent: string
  onTitleChange: (title: string) => void
  onContentChange: (content: string) => void
  onSave: () => void
  onCancel: () => void
}

export function MemoCardEdit({
  memo,
  editTitle,
  editContent,
  onTitleChange,
  onContentChange,
  onSave,
  onCancel
}: MemoCardEditProps): JSX.Element {
  const contentInputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    contentInputRef.current?.focus()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      onSave()
    }
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div className="memo-card editing" data-id={memo.id}>
      <input
        type="text"
        className="edit-title-input"
        value={editTitle}
        onChange={e => onTitleChange(e.target.value)}
        maxLength={100}
        placeholder="标题（可选）"
      />
      <MarkdownEditor
        value={editContent}
        onChange={onContentChange}
        onKeyDown={handleKeyDown}
        placeholder="写点什么...（支持 Markdown）"
        maxLength={500}
      />
      <div className="edit-actions">
        <button className="btn btn-sm btn-success" onClick={onSave}>
          保存
        </button>
        <button className="btn btn-sm btn-warning" onClick={onCancel}>
          取消
        </button>
      </div>
    </div>
  )
}
