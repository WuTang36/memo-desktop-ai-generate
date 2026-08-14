import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoForm } from '../../src/renderer/components/MemoForm'

// CodeMirror 在 jsdom 中需要特殊处理，mock 掉
vi.mock('@uiw/react-codemirror', () => ({
  default: ({ value, onChange, onKeyDown, placeholder, autoFocus }: any) => (
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

describe('MemoForm', () => {
  let onAdd: ReturnType<typeof vi.fn>

  beforeEach(() => {
    onAdd = vi.fn()
  })

  it('应该渲染表单元素', () => {
    render(<MemoForm onAdd={onAdd} />)
    expect(screen.getByPlaceholderText('标题（可选）')).toBeInTheDocument()
    expect(screen.getByTestId('codemirror')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '添加' })).toBeInTheDocument()
  })

  it('提交时应该调用 onAdd', async () => {
    render(<MemoForm onAdd={onAdd} />)
    const editor = screen.getByTestId('codemirror')
    await userEvent.type(editor, '测试内容')
    fireEvent.submit(screen.getByRole('button', { name: '添加' }).closest('form')!)
    expect(onAdd).toHaveBeenCalledWith('', '测试内容', '')
  })

  it('空内容不应提交', async () => {
    render(<MemoForm onAdd={onAdd} />)
    fireEvent.submit(screen.getByRole('button', { name: '添加' }).closest('form')!)
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('应该显示字符计数', async () => {
    render(<MemoForm onAdd={onAdd} />)
    const editor = screen.getByTestId('codemirror')
    await userEvent.type(editor, '你好')
    expect(screen.getByText('2/500')).toBeInTheDocument()
  })

  it('字符超过 450 时应显示警告样式', async () => {
    render(<MemoForm onAdd={onAdd} />)
    const editor = screen.getByTestId('codemirror')
    const longText = 'a'.repeat(455)
    await userEvent.type(editor, longText)
    const charCount = screen.getByText('455/500')
    expect(charCount.className).toContain('warn')
  })

  it('Enter 键应提交表单', async () => {
    render(<MemoForm onAdd={onAdd} />)
    const editor = screen.getByTestId('codemirror')
    await userEvent.type(editor, '测试内容')
    fireEvent.keyDown(editor, { key: 'Enter', shiftKey: false })
    expect(onAdd).toHaveBeenCalledWith('', '测试内容', '')
  })

  it('提交后应该清空表单', async () => {
    render(<MemoForm onAdd={onAdd} />)
    const titleInput = screen.getByPlaceholderText('标题（可选）')
    const editor = screen.getByTestId('codemirror')

    await userEvent.type(titleInput, '标题')
    await userEvent.type(editor, '内容')
    fireEvent.submit(screen.getByRole('button', { name: '添加' }).closest('form')!)

    expect(onAdd).toHaveBeenCalledWith('标题', '内容', '')
    expect(titleInput).toHaveValue('')
    expect(editor).toHaveValue('')
  })
})
