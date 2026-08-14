import { useState, useRef, useEffect } from 'react'
import { ColorPalette } from './ColorPalette'

interface MemoFormProps {
  onAdd: (title: string, content: string, color: string) => void
}

export function MemoForm({ onAdd }: MemoFormProps): JSX.Element {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState('')
  const contentRef = useRef<HTMLTextAreaElement>(null)

  const charCount = content.length
  const isOverLimit = charCount > 500

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed || isOverLimit) return
    onAdd(title, trimmed, color)
    setTitle('')
    setContent('')
    setColor('')
    contentRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  useEffect(() => {
    contentRef.current?.focus()
  }, [])

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
      <textarea
        ref={contentRef}
        className="input-content"
        placeholder="写点什么..."
        value={content}
        onChange={e => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        maxLength={500}
        required
      />
      <div className="form-footer">
        <span className={`char-count${charCount > 450 ? ' warn' : ''}`}>
          {charCount}/500
        </span>
        <button type="submit" className="btn btn-primary" disabled={isOverLimit}>
          添加
        </button>
      </div>
      <ColorPalette selectedColor={color} onSelect={setColor} />
    </form>
  )
}
