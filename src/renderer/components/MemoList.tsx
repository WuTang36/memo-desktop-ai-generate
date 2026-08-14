import type { Memo } from '../types'
import { MemoCard } from './MemoCard'

interface MemoListProps {
  memos: Memo[]
  onToggleDone: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, title: string, content: string) => void
}

export function MemoList({ memos, onToggleDone, onDelete, onUpdate }: MemoListProps): JSX.Element {
  if (memos.length === 0) {
    return (
      <div className="empty-state">
        <p>还没有备忘，快来添加一条吧 ✨</p>
      </div>
    )
  }

  return (
    <div className="memo-list">
      {memos.map(memo => (
        <MemoCard
          key={memo.id}
          memo={memo}
          onToggleDone={onToggleDone}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  )
}
