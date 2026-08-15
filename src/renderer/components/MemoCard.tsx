import { useState, useCallback } from 'react'
import { MemoCardEdit } from './MemoCardEdit'
import { MemoCardView } from './MemoCardView'
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

  const handleSave = useCallback((): void => {
    const trimmed = editContent.trim()
    if (!trimmed) return
    setEditing(false)
    onUpdate(memo.id, editTitle.trim(), trimmed)
  }, [editContent, editTitle, memo.id, onUpdate])

  const handleCancel = useCallback((): void => {
    setEditTitle(memo.title)
    setEditContent(memo.content)
    setEditing(false)
  }, [memo.title, memo.content])

  if (editing) {
    return (
      <MemoCardEdit
        memo={memo}
        editTitle={editTitle}
        editContent={editContent}
        onTitleChange={setEditTitle}
        onContentChange={setEditContent}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    )
  }

  return (
    <MemoCardView
      memo={memo}
      onToggleDone={onToggleDone}
      onDelete={onDelete}
      onEdit={() => setEditing(true)}
    />
  )
}
