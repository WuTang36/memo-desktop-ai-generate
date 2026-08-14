import { createContext, useContext, useSyncExternalStore, useCallback } from 'react'
import { MemoStore } from '../store/MemoStore'
import type { Memo, MemoStats } from '../types'

const StoreContext = createContext<MemoStore | null>(null)

export const StoreProvider = StoreContext.Provider

export function useMemoStore(): {
  memos: Memo[]
  stats: MemoStats
  searchQuery: string
  setSearchQuery: (q: string) => void
  add: (title: string, content: string, color?: string) => Memo
  update: (id: string, updates: Partial<Pick<Memo, 'title' | 'content' | 'done' | 'color'>>) => Memo | null
  remove: (id: string) => boolean
  toggleDone: (id: string) => Memo | null
  search: (query: string) => Memo[]
  store: MemoStore
} {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useMemoStore must be used within a StoreProvider')

  const memos = useSyncExternalStore(
    useCallback((cb: () => void) => store.onChange(cb), [store]),
    () => store.getAll()
  )

  const stats = useSyncExternalStore(
    useCallback((cb: () => void) => store.onChange(cb), [store]),
    () => store.getStats()
  )

  const add = useCallback((title: string, content: string, color?: string) => {
    return store.add(title, content, color)
  }, [store])

  const update = useCallback((id: string, updates: Partial<Pick<Memo, 'title' | 'content' | 'done' | 'color'>>) => {
    return store.update(id, updates)
  }, [store])

  const remove = useCallback((id: string) => {
    return store.remove(id)
  }, [store])

  const toggleDone = useCallback((id: string) => {
    return store.toggleDone(id)
  }, [store])

  const search = useCallback((query: string) => {
    return store.search(query)
  }, [store])

  return {
    memos,
    stats,
    searchQuery: '',
    setSearchQuery: () => {},
    add,
    update,
    remove,
    toggleDone,
    search,
    store
  }
}
