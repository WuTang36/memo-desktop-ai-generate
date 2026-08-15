import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../../src/renderer/App'

interface MockCodeMirrorProps {
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  placeholder?: string
  autoFocus?: boolean
}

vi.mock('@uiw/react-codemirror', () => ({
  default: ({ value, onChange, onKeyDown, placeholder, autoFocus }: MockCodeMirrorProps) => (
    <textarea
      data-testid="codemirror"
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      autoFocus={autoFocus}
    />
  )
}))

describe('App 集成测试', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('应该渲染完整应用', () => {
    render(<App />)
    expect(screen.getByText('备忘录')).toBeInTheDocument()
    expect(screen.getByTestId('codemirror')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('搜索备忘录...')).toBeInTheDocument()
  })

  it('初始状态显示空状态', () => {
    render(<App />)
    expect(screen.getByText('还没有备忘，快来添加一条吧 ✨')).toBeInTheDocument()
  })

  it('添加备忘后应显示在列表中', async () => {
    render(<App />)
    const editor = screen.getByTestId('codemirror')
    await userEvent.type(editor, '新备忘内容')
    fireEvent.submit(screen.getByRole('button', { name: '添加' }).closest('form')!)

    expect(await screen.findByText('新备忘内容')).toBeInTheDocument()
  })

  it('添加备忘后统计应更新', async () => {
    render(<App />)
    const editor = screen.getByTestId('codemirror')
    await userEvent.type(editor, '统计测试')
    fireEvent.submit(screen.getByRole('button', { name: '添加' }).closest('form')!)

    const statsEl = screen.getByText(/条备忘/)
    expect(statsEl.textContent).toContain('1')
  })

  it('可以删除备忘', async () => {
    render(<App />)
    const editor = screen.getByTestId('codemirror')
    await userEvent.type(editor, '要删除的内容')
    fireEvent.submit(screen.getByRole('button', { name: '添加' }).closest('form')!)

    const deleteBtn = await screen.findByText('✕ 删除')
    await userEvent.click(deleteBtn)

    expect(screen.getByText('还没有备忘，快来添加一条吧 ✨')).toBeInTheDocument()
  })

  it('可以标记完备忘', async () => {
    render(<App />)
    const editor = screen.getByTestId('codemirror')
    await userEvent.type(editor, '完成测试')
    fireEvent.submit(screen.getByRole('button', { name: '添加' }).closest('form')!)

    const doneBtn = await screen.findByText('✓ 完成')
    await userEvent.click(doneBtn)

    expect(await screen.findByText('↩ 取消完成')).toBeInTheDocument()
  })

  it('搜索功能应过滤备忘', async () => {
    render(<App />)
    const editor = screen.getByTestId('codemirror')
    await userEvent.type(editor, '苹果')
    fireEvent.submit(screen.getByRole('button', { name: '添加' }).closest('form')!)
    await userEvent.clear(editor)
    await userEvent.type(editor, '香蕉')
    fireEvent.submit(screen.getByRole('button', { name: '添加' }).closest('form')!)

    const searchInput = screen.getByPlaceholderText('搜索备忘录...')
    await userEvent.type(searchInput, '苹果')

    expect(screen.getByText('苹果')).toBeInTheDocument()
    expect(screen.queryByText('香蕉')).not.toBeInTheDocument()
  })
})
