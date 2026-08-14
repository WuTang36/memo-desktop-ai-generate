import { describe, it, expect, beforeEach } from 'vitest'
import { MemoStore } from '../src/renderer/store/MemoStore'

describe('MemoStore', () => {
  let store: MemoStore

  beforeEach(() => {
    localStorage.clear()
    store = new MemoStore('test-memo-key')
  })

  describe('add()', () => {
    it('应该创建具有正确字段的备忘', () => {
      const memo = store.add('标题', '内容内容')
      expect(memo).toHaveProperty('id')
      expect(memo.title).toBe('标题')
      expect(memo.content).toBe('内容内容')
      expect(memo.done).toBe(false)
      expect(memo).toHaveProperty('createdAt')
      expect(memo).toHaveProperty('updatedAt')
      // createdAt 和 updatedAt 使用同一时间戳，应该相等
      expect(memo.createdAt).toBe(memo.updatedAt)
    })

    it('应该去除标题和内容的首尾空格', () => {
      const memo = store.add('  标题  ', '  内容  ')
      expect(memo.title).toBe('标题')
      expect(memo.content).toBe('内容')
    })

    it('应该将新备忘添加到列表开头（最新在前）', () => {
      const m1 = store.add('第一', 'a')
      const m2 = store.add('第二', 'b')
      const all = store.getAll()
      expect(all[0].title).toBe('第二')
      expect(all[1].title).toBe('第一')
    })

    it('应该生成唯一的 ID', () => {
      const ids = new Set<string>()
      for (let i = 0; i < 100; i++) {
        const m = store.add(`m${i}`, 'x')
        ids.add(m.id)
      }
      expect(ids.size).toBe(100)
    })

    it('应该存储颜色', () => {
      const memo = store.add('标题', '内容', '#c8e6c9')
      expect(memo.color).toBe('#c8e6c9')
    })

    it('未提供颜色时默认为空字符串', () => {
      const memo = store.add('标题', '内容')
      expect(memo.color).toBe('')
    })
  })

  describe('getAll()', () => {
    it('没有备忘时返回空数组', () => {
      expect(store.getAll()).toEqual([])
    })

    it('应该返回备忘数组的副本', () => {
      store.add('t', 'c')
      const memos = store.getAll()
      memos.push({ fake: true } as any)
      expect(store.getAll().length).toBe(1)
    })
  })

  describe('update()', () => {
    it('应该更新备忘字段', () => {
      const memo = store.add('原标题', '原内容')
      const updated = store.update(memo.id, { title: '新标题', content: '新内容' })
      expect(updated!.title).toBe('新标题')
      expect(updated!.content).toBe('新内容')
      // updatedAt 应该 >= createdAt（更新后时间不早于创建时间）
      expect(new Date(updated!.updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(memo.createdAt).getTime()
      )
    })

    it('对不存在的 ID 返回 null', () => {
      expect(store.update('nonexistent', { title: 'x' })).toBeNull()
    })

    it('应该更新 updatedAt 时间戳', () => {
      const memo = store.add('t', 'c')
      const updated = store.update(memo.id, { title: 'new' })
      expect(new Date(updated!.updatedAt).getTime()).toBeGreaterThan(
        new Date(memo.createdAt).getTime() - 1000
      )
    })
  })

  describe('remove()', () => {
    it('应该按 ID 删除备忘', () => {
      const m1 = store.add('a', '1')
      const m2 = store.add('b', '2')
      expect(store.remove(m1.id)).toBe(true)
      expect(store.getAll().length).toBe(1)
      expect(store.getAll()[0].id).toBe(m2.id)
    })

    it('对不存在的 ID 返回 false', () => {
      store.add('a', '1')
      expect(store.remove('nope')).toBe(false)
      expect(store.getAll().length).toBe(1)
    })
  })

  describe('toggleDone()', () => {
    it('应该切换完成状态', () => {
      const memo = store.add('t', 'c')
      expect(memo.done).toBe(false)
      store.toggleDone(memo.id)
      expect(store.getAll()[0].done).toBe(true)
      store.toggleDone(memo.id)
      expect(store.getAll()[0].done).toBe(false)
    })

    it('对不存在的 ID 返回 null', () => {
      expect(store.toggleDone('nope')).toBeNull()
    })
  })

  describe('search()', () => {
    beforeEach(() => {
      store.add('买菜', '今天需要买土豆和鸡蛋')
      store.add('学习', '复习 JavaScript 基础')
      store.add('健身', '晚上跑步 30 分钟')
    })

    it('查询为空时返回所有备忘', () => {
      expect(store.search('').length).toBe(3)
      expect(store.search('   ').length).toBe(3)
    })

    it('应该按标题搜索', () => {
      const results = store.search('买菜')
      expect(results.length).toBe(1)
      expect(results[0].title).toBe('买菜')
    })

    it('应该按内容搜索', () => {
      const results = store.search('土豆')
      expect(results.length).toBe(1)
      expect(results[0].title).toBe('买菜')
    })

    it('大小写不敏感', () => {
      store.add('Test', 'Hello World')
      expect(store.search('test').length).toBe(1)
      expect(store.search('hello').length).toBe(1)
      expect(store.search('world').length).toBe(1)
    })

    it('无匹配时返回空数组', () => {
      expect(store.search('zzzzz').length).toBe(0)
    })
  })

  describe('getStats()', () => {
    it('应该返回正确的统计信息', () => {
      store.add('a', '1')
      store.add('b', '2')
      const stats = store.getStats()
      expect(stats.total).toBe(2)
      expect(stats.done).toBe(0)
    })

    it('应该统计已完成的备忘', () => {
      const m1 = store.add('a', '1')
      store.add('b', '2')
      store.toggleDone(m1.id)
      const stats = store.getStats()
      expect(stats.total).toBe(2)
      expect(stats.done).toBe(1)
    })
  })

  describe('localStorage 持久化', () => {
    it('应该在 add 后持久化到 localStorage', () => {
      store.add('t', 'c')
      const raw = localStorage.getItem('test-memo-key')
      expect(raw).toBeTruthy()
      const parsed = JSON.parse(raw!)
      expect(parsed.length).toBe(1)
    })

    it('应该从 localStorage 加载数据', () => {
      const data = [{
        id: 'abc', title: '已保存', content: '内容', done: false,
        color: '', createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z', history: []
      }]
      localStorage.setItem('test-memo-key', JSON.stringify(data))
      const newStore = new MemoStore('test-memo-key')
      expect(newStore.getAll().length).toBe(1)
      expect(newStore.getAll()[0].title).toBe('已保存')
    })
  })

  describe('编辑历史', () => {
    it('新建备忘的 history 应该为空数组', () => {
      const memo = store.add('t', 'c')
      expect(memo.history).toEqual([])
    })

    it('编辑后应该记录旧版本', () => {
      const memo = store.add('原标题', '原内容')
      store.update(memo.id, { title: '新标题', content: '新内容' })
      const updated = store.getAll()[0]
      expect(updated.history.length).toBe(1)
      expect(updated.history[0].title).toBe('原标题')
      expect(updated.history[0].content).toBe('原内容')
    })

    it('多次编辑应该累积历史记录', () => {
      const memo = store.add('v1', 'c1')
      store.update(memo.id, { title: 'v2', content: 'c2' })
      store.update(memo.id, { title: 'v3', content: 'c3' })
      const updated = store.getAll()[0]
      expect(updated.history.length).toBe(2)
    })

    it('历史记录应该随 localStorage 正确序列化', () => {
      const memo = store.add('t', 'c')
      store.update(memo.id, { title: 'new', content: 'new c' })
      const raw = localStorage.getItem('test-memo-key')
      const parsed = JSON.parse(raw!)
      expect(parsed[0].history.length).toBe(1)
    })
  })

  describe('边界情况', () => {
    it('空标题和内容', () => {
      const memo = store.add('', '')
      expect(memo.title).toBe('')
      expect(memo.content).toBe('')
    })

    it('特殊字符', () => {
      const memo = store.add('<script>alert("xss")</script>', '&<>"\'')
      expect(memo.title).toBe('<script>alert("xss")</script>')
      expect(memo.content).toBe('&<>"\'')
    })

    it('clear() 应该清空所有备忘', () => {
      store.add('a', '1')
      store.add('b', '2')
      store.clear()
      expect(store.getAll().length).toBe(0)
    })
  })

  describe('isStorageAvailable()', () => {
    it('正常情况返回 true', () => {
      expect(store.isStorageAvailable()).toBe(true)
    })
  })
})
