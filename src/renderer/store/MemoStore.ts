import type { Memo, MemoStats, MemoListener, HistoryEntry } from '../types'

export class MemoStore {
  private storageKey: string
  private memos: Memo[]
  private listeners: MemoListener[]
  private _storageAvailable: boolean

  constructor(storageKey = 'memo-app-data') {
    this.storageKey = storageKey
    this.memos = []
    this.listeners = []
    this._storageAvailable = false
    this._load()
  }

  private _load(): void {
    try {
      const raw = localStorage.getItem(this.storageKey)
      this.memos = raw ? JSON.parse(raw) : []
      this._storageAvailable = true
    } catch (e) {
      console.warn('[MemoStore] localStorage 不可用，数据仅保存在内存中', e)
      this.memos = []
      this._storageAvailable = false
    }
  }

  private _save(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.memos))
      this._storageAvailable = true
    } catch (e) {
      console.warn('[MemoStore] localStorage 写入失败', e)
      this._storageAvailable = false
    }
    this._notify()
  }

  isStorageAvailable(): boolean {
    return this._storageAvailable
  }

  private _notify(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.memos)
      } catch (e) {
        console.error(e)
      }
    }
  }

  onChange(fn: MemoListener): () => void {
    this.listeners.push(fn)
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn)
    }
  }

  add(title: string, content: string, color?: string): Memo {
    const now = new Date().toISOString()
    const memo: Memo = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      title: (title || '').trim(),
      content: (content || '').trim(),
      done: false,
      color: color || '',
      createdAt: now,
      updatedAt: now,
      history: []
    }
    this.memos.unshift(memo)
    this._save()
    return memo
  }

  update(id: string, updates: Partial<Pick<Memo, 'title' | 'content' | 'done' | 'color'>>): Memo | null {
    const idx = this.memos.findIndex(m => m.id === id)
    if (idx === -1) return null

    const old = this.memos[idx]
    if (!old.history) old.history = []
    const entry: HistoryEntry = {
      title: old.title,
      content: old.content,
      time: old.updatedAt
    }
    old.history.push(entry)

    this.memos[idx] = { ...old, ...updates, updatedAt: new Date().toISOString() }
    this._save()
    return this.memos[idx]
  }

  remove(id: string): boolean {
    const idx = this.memos.findIndex(m => m.id === id)
    if (idx === -1) return false
    this.memos.splice(idx, 1)
    this._save()
    return true
  }

  toggleDone(id: string): Memo | null {
    const memo = this.memos.find(m => m.id === id)
    if (!memo) return null
    return this.update(id, { done: !memo.done })
  }

  getAll(): Memo[] {
    return [...this.memos]
  }

  search(query: string): Memo[] {
    const q = (query || '').trim().toLowerCase()
    if (!q) return this.getAll()
    return this.memos.filter(m =>
      m.title.toLowerCase().includes(q) || m.content.toLowerCase().includes(q)
    )
  }

  getStats(): MemoStats {
    return {
      total: this.memos.length,
      done: this.memos.filter(m => m.done).length
    }
  }

  clear(): void {
    this.memos = []
    this._save()
  }
}
