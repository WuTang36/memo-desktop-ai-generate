import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../../src/renderer/App'

describe('App 集成测试', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('应该渲染完整应用', () => {
    render(<App />)
    expect(screen.getByText('备忘录')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('写点什么...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('搜索备忘录...')).toBeInTheDocument()
  })

  it('初始状态显示空状态', () => {
    render(<App />)
    expect(screen.getByText('还没有备忘，快来添加一条吧 ✨')).toBeInTheDocument()
  })

  it('添加备忘后应显示在列表中', async () => {
    render(<App />)
    const contentInput = screen.getByPlaceholderText('写点什么...')
    await userEvent.type(contentInput, '新备忘内容')
    fireEvent.submit(screen.getByRole('button', { name: '添加' }).closest('form')!)

    expect(await screen.findByText('新备忘内容')).toBeInTheDocument()
  })

  it('添加备忘后统计应更新', async () => {
    render(<App />)
    const contentInput = screen.getByPlaceholderText('写点什么...')
    await userEvent.type(contentInput, '统计测试')
    fireEvent.submit(screen.getByRole('button', { name: '添加' }).closest('form')!)

    // 统计区域应显示 1 条
    const statsEl = screen.getByText(/条备忘/)
    expect(statsEl.textContent).toContain('1')
  })

  it('可以删除备忘', async () => {
    render(<App />)
    const contentInput = screen.getByPlaceholderText('写点什么...')
    await userEvent.type(contentInput, '要删除的内容')
    fireEvent.submit(screen.getByRole('button', { name: '添加' }).closest('form')!)

    const deleteBtn = await screen.findByText('✕ 删除')
    await userEvent.click(deleteBtn)

    expect(screen.getByText('还没有备忘，快来添加一条吧 ✨')).toBeInTheDocument()
  })

  it('可以标记完备忘', async () => {
    render(<App />)
    const contentInput = screen.getByPlaceholderText('写点什么...')
    await userEvent.type(contentInput, '完成测试')
    fireEvent.submit(screen.getByRole('button', { name: '添加' }).closest('form')!)

    const doneBtn = await screen.findByText('✓ 完成')
    await userEvent.click(doneBtn)

    expect(await screen.findByText('↩ 取消完成')).toBeInTheDocument()
  })

  it('搜索功能应过滤备忘', async () => {
    render(<App />)
    // 添加两条备忘
    const contentInput = screen.getByPlaceholderText('写点什么...')
    await userEvent.type(contentInput, '苹果')
    fireEvent.submit(screen.getByRole('button', { name: '添加' }).closest('form')!)
    await userEvent.type(contentInput, '香蕉')
    fireEvent.submit(screen.getByRole('button', { name: '添加' }).closest('form')!)

    // 搜索
    const searchInput = screen.getByPlaceholderText('搜索备忘录...')
    await userEvent.type(searchInput, '苹果')

    expect(screen.getByText('苹果')).toBeInTheDocument()
    expect(screen.queryByText('香蕉')).not.toBeInTheDocument()
  })
})
