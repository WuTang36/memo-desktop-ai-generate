import { useState, useCallback } from 'react'
import { ColorPalette } from './ColorPalette'
import { MarkdownEditor } from './MarkdownEditor'

interface MemoFormProps {
  onAdd: (title: string, content: string, color: string) => void
}

export function MemoForm({ onAdd }: MemoFormProps): JSX.Element {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState('')

  const handleSubmit = useCallback(
    (e: React.FormEvent): void => {
      e.preventDefault()
      const trimmed = content.trim()
      if (!trimmed) return
      onAdd(title, trimmed, color)
      setTitle('')
      setContent('')
      setColor('')
    },
    [title, content, color, onAdd]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent): void => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit(e as unknown as React.FormEvent)
      }
    },
    [handleSubmit]
  )

  return (
    <form className="memo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="input-title"
        placeholder="标题（可选）"
        value={title}
        onChange={e => setTitle(e.target.value)}
        maxLength={100}
      />
      <MarkdownEditor
        value={content}
        onChange={setContent}
        onKeyDown={handleKeyDown}
        placeholder="写点什么...（支持 Markdown）"
        maxLength={500}
        autoFocus
      />
      <div className="form-footer">
        <button type="submit" className="btn btn-primary">
          添加
        </button>
      </div>
      <ColorPalette selectedColor={color} onSelect={setColor} />
    </form>
  )
}
