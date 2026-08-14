import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoForm } from '../../src/renderer/components/MemoForm'

describe('MemoForm', () => {
  let onAdd: ReturnType<typeof vi.fn>

  beforeEach(() => {
    onAdd = vi.fn()
  })

  it('应该渲染表单元素', () => {
    render(<MemoForm onAdd={onAdd} />)
    expect(screen.getByPlaceholderText('标题（可选）')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('写点什么...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '添加' })).toBeInTheDocument()
  })

  it('提交时应该调用 onAdd', async () => {
    render(<MemoForm onAdd={onAdd} />)
    const contentInput = screen.getByPlaceholderText('写点什么...')
    await userEvent.type(contentInput, '测试内容')
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
    const contentInput = screen.getByPlaceholderText('写点什么...')
    await userEvent.type(contentInput, '你好')
    // 两个中文字符 = 2
    expect(screen.getByText('2/500')).toBeInTheDocument()
  })

  it('字符超过 450 时应显示警告样式', async () => {
    render(<MemoForm onAdd={onAdd} />)
    const contentInput = screen.getByPlaceholderText('写点什么...')
    const longText = 'a'.repeat(455)
    await userEvent.type(contentInput, longText)
    const charCount = screen.getByText('455/500')
    expect(charCount.className).toContain('warn')
  })

  it('Enter 键应提交表单', async () => {
    render(<MemoForm onAdd={onAdd} />)
    const contentInput = screen.getByPlaceholderText('写点什么...')
    await userEvent.type(contentInput, '测试内容')
    fireEvent.keyDown(contentInput, { key: 'Enter', shiftKey: false })
    expect(onAdd).toHaveBeenCalledWith('', '测试内容', '')
  })

  it('提交后应该清空表单', async () => {
    render(<MemoForm onAdd={onAdd} />)
    const titleInput = screen.getByPlaceholderText('标题（可选）')
    const contentInput = screen.getByPlaceholderText('写点什么...')

    await userEvent.type(titleInput, '标题')
    await userEvent.type(contentInput, '内容')
    fireEvent.submit(screen.getByRole('button', { name: '添加' }).closest('form')!)

    expect(onAdd).toHaveBeenCalledWith('标题', '内容', '')
    expect(titleInput).toHaveValue('')
    expect(contentInput).toHaveValue('')
  })
})
