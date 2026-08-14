import { useState, useCallback } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import ReactMarkdown from 'react-markdown'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  placeholder?: string
  maxLength?: number
  autoFocus?: boolean
}

type Mode = 'edit' | 'preview'

export function MarkdownEditor({
  value,
  onChange,
  onKeyDown,
  placeholder = '写点什么...',
  maxLength = 500,
  autoFocus = false
}: MarkdownEditorProps): JSX.Element {
  const [mode, setMode] = useState<Mode>('edit')

  const handleChange = useCallback(
    (val: string) => {
      if (val.length <= maxLength) {
        onChange(val)
      }
    },
    [onChange, maxLength]
  )

  const charCount = value.length

  return (
    <div className="markdown-editor">
      <div className="md-editor-header">
        <div className="md-mode-toggle">
          <button
            type="button"
            className={`md-mode-btn${mode === 'edit' ? ' active' : ''}`}
            onClick={() => setMode('edit')}
          >
            编辑
          </button>
          <button
            type="button"
            className={`md-mode-btn${mode === 'preview' ? ' active' : ''}`}
            onClick={() => setMode('preview')}
          >
            预览
          </button>
        </div>
        <span className={`md-char-count${charCount > maxLength * 0.9 ? ' warn' : ''}`}>
          {charCount}/{maxLength}
        </span>
      </div>

      {mode === 'edit' ? (
        <div className="md-editor-pane" onKeyDown={onKeyDown}>
          <CodeMirror
            value={value}
            onChange={handleChange}
            extensions={[markdown()]}
            placeholder={placeholder}
            autoFocus={autoFocus}
            basicSetup={{
              lineNumbers: false,
              foldGutter: false,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: false
            }}
            height="120px"
          />
        </div>
      ) : (
        <div className="md-preview-pane">
          {value.trim() ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <span className="md-preview-empty">暂无内容</span>
          )}
        </div>
      )}
    </div>
  )
}
