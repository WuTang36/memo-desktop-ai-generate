import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoList } from '../../src/renderer/components/MemoList'
import type { Memo } from '../../src/renderer/types'

// Mock CodeMirror
vi.mock('@uiw/react-codemirror', () => ({
  default: ({ value, onChange, onKeyDown, placeholder }: any) => (
    <textarea
      data-testid="codemirror"
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
    />
  )
}))

const mockMemos: Memo[] = [
  {
    id: '1', title: '备忘一', content: '内容一', done: false,
    color: '', createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z', history: []
  },
  {
    id: '2', title: '备忘二', content: '内容二', done: true,
    color: '#fff9c4', createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z', history: []
  }
]

describe('MemoList', () => {
  it('空列表应该显示空状态', () => {
    render(
      <MemoList memos={[]} onToggleDone={vi.fn()} onDelete={vi.fn()} onUpdate={vi.fn()} />
    )
    expect(screen.getByText('还没有备忘，快来添加一条吧 ✨')).toBeInTheDocument()
  })

  it('应该渲染多个备忘卡片', () => {
    render(
      <MemoList memos={mockMemos} onToggleDone={vi.fn()} onDelete={vi.fn()} onUpdate={vi.fn()} />
    )
    expect(screen.getByText('备忘一')).toBeInTheDocument()
    expect(screen.getByText('备忘二')).toBeInTheDocument()
  })

  it('有备忘时不应显示空状态', () => {
    render(
      <MemoList memos={mockMemos} onToggleDone={vi.fn()} onDelete={vi.fn()} onUpdate={vi.fn()} />
    )
    expect(screen.queryByText('还没有备忘，快来添加一条吧 ✨')).not.toBeInTheDocument()
  })
})
