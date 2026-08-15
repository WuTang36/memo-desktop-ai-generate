import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoCard } from '../../src/renderer/components/MemoCard'
import type { Memo } from '../../src/renderer/types'

interface MockCodeMirrorProps {
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  placeholder?: string
}

vi.mock('@uiw/react-codemirror', () => ({
  default: ({ value, onChange, onKeyDown, placeholder }: MockCodeMirrorProps) => (
    <textarea
      data-testid="codemirror"
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
    />
  )
}))

const mockMemo: Memo = {
  id: 'test-123',
  title: '测试标题',
  content: '测试内容',
  done: false,
  color: '',
  createdAt: '2024-01-15T08:00:00.000Z',
  updatedAt: '2024-01-15T08:00:00.000Z',
  history: []
}

describe('MemoCard', () => {
  let onToggleDone: ReturnType<typeof vi.fn>
  let onDelete: ReturnType<typeof vi.fn>
  let onUpdate: ReturnType<typeof vi.fn>

  beforeEach(() => {
    onToggleDone = vi.fn()
    onDelete = vi.fn()
    onUpdate = vi.fn()
  })

  it('应该渲染备忘标题和内容', () => {
    render(<MemoCard memo={mockMemo} onToggleDone={onToggleDone} onDelete={onDelete} onUpdate={onUpdate} />)
    expect(screen.getByText('测试标题')).toBeInTheDocument()
    expect(screen.getByText('测试内容')).toBeInTheDocument()
  })

  it('无标题时显示默认文案', () => {
    const noTitle = { ...mockMemo, title: '' }
    render(<MemoCard memo={noTitle} onToggleDone={onToggleDone} onDelete={onDelete} onUpdate={onUpdate} />)
    expect(screen.getByText('（无标题）')).toBeInTheDocument()
  })

  it('完成状态应应用 done 样式', () => {
    const doneMemo = { ...mockMemo, done: true }
    render(<MemoCard memo={doneMemo} onToggleDone={onToggleDone} onDelete={onDelete} onUpdate={onUpdate} />)
    expect(screen.getByText('↩ 取消完成')).toBeInTheDocument()
  })

  it('点击完成按钮应调用 onToggleDone', async () => {
    render(<MemoCard memo={mockMemo} onToggleDone={onToggleDone} onDelete={onDelete} onUpdate={onUpdate} />)
    await userEvent.click(screen.getByText('✓ 完成'))
    expect(onToggleDone).toHaveBeenCalledWith('test-123')
  })

  it('点击删除按钮应调用 onDelete', async () => {
    render(<MemoCard memo={mockMemo} onToggleDone={onToggleDone} onDelete={onDelete} onUpdate={onUpdate} />)
    await userEvent.click(screen.getByText('✕ 删除'))
    expect(onDelete).toHaveBeenCalledWith('test-123')
  })

  it('点击编辑按钮应进入编辑模式', async () => {
    render(<MemoCard memo={mockMemo} onToggleDone={onToggleDone} onDelete={onDelete} onUpdate={onUpdate} />)
    await userEvent.click(screen.getByText('✎ 编辑'))
    expect(screen.getByText('保存')).toBeInTheDocument()
    expect(screen.getByText('取消')).toBeInTheDocument()
  })

  it('编辑模式下保存应调用 onUpdate', async () => {
    render(<MemoCard memo={mockMemo} onToggleDone={onToggleDone} onDelete={onDelete} onUpdate={onUpdate} />)
    await userEvent.click(screen.getByText('✎ 编辑'))
    const editor = screen.getByTestId('codemirror')
    await userEvent.clear(editor)
    await userEvent.type(editor, '新内容')
    await userEvent.click(screen.getByText('保存'))
    expect(onUpdate).toHaveBeenCalledWith('test-123', '测试标题', '新内容')
  })

  it('编辑模式下取消应退出编辑模式', async () => {
    render(<MemoCard memo={mockMemo} onToggleDone={onToggleDone} onDelete={onDelete} onUpdate={onUpdate} />)
    await userEvent.click(screen.getByText('✎ 编辑'))
    await userEvent.click(screen.getByText('取消'))
    expect(screen.queryByText('保存')).not.toBeInTheDocument()
  })

  it('有编辑历史时应显示编辑次数', () => {
    const withHistory = {
      ...mockMemo,
      history: [
        { title: '旧标题', content: '旧内容', time: '2024-01-15T07:00:00.000Z' },
        { title: '更旧标题', content: '更旧内容', time: '2024-01-15T06:00:00.000Z' }
      ]
    }
    render(<MemoCard memo={withHistory} onToggleDone={onToggleDone} onDelete={onDelete} onUpdate={onUpdate} />)
    expect(screen.getByText('编辑过 2 次')).toBeInTheDocument()
  })

  it('Ctrl+Enter 编辑模式下应保存', async () => {
    render(<MemoCard memo={mockMemo} onToggleDone={onToggleDone} onDelete={onDelete} onUpdate={onUpdate} />)
    await userEvent.click(screen.getByText('✎ 编辑'))
    const editor = screen.getByTestId('codemirror')
    await userEvent.clear(editor)
    await userEvent.type(editor, 'Ctrl+Enter 测试')
    fireEvent.keyDown(editor, { key: 'Enter', ctrlKey: true })
    expect(onUpdate).toHaveBeenCalledWith('test-123', '测试标题', 'Ctrl+Enter 测试')
  })

  it('Esc 编辑模式下应取消', async () => {
    render(<MemoCard memo={mockMemo} onToggleDone={onToggleDone} onDelete={onDelete} onUpdate={onUpdate} />)
    await userEvent.click(screen.getByText('✎ 编辑'))
    const editor = screen.getByTestId('codemirror')
    await userEvent.clear(editor)
    await userEvent.type(editor, '修改但取消')
    fireEvent.keyDown(editor, { key: 'Escape' })
    expect(screen.queryByText('保存')).not.toBeInTheDocument()
    expect(screen.getByText('测试内容')).toBeInTheDocument()
  })
})
