import { useState, useMemo, useEffect } from 'react'
import { MemoStore } from './store/MemoStore'
import { StoreProvider } from './hooks/useMemoStore'
import { Header } from './components/Header'
import { StatusBar } from './components/StatusBar'
import { SearchBar } from './components/SearchBar'
import { MemoForm } from './components/MemoForm'
import { MemoList } from './components/MemoList'

export function App(): JSX.Element {
  const [store] = useState(() => new MemoStore())
  return (
    <StoreProvider value={store}>
      <AppInner store={store} />
    </StoreProvider>
  )
}

interface AppInnerProps {
  store: MemoStore
}

function AppInner({ store }: AppInnerProps): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')
  const [tick, setTick] = useState(0)

  useEffect(() => {
    return store.onChange(() => setTick(n => n + 1))
  }, [store])

  const filteredMemos = useMemo(() => store.search(searchQuery), [searchQuery, tick])
  const stats = useMemo(() => store.getStats(), [tick])

  const handleAdd = (title: string, content: string, color: string): void => {
    store.add(title, content, color)
  }

  return (
    <div className="container">
      <Header stats={stats} />
      <StatusBar storageAvailable={store.isStorageAvailable()} />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <MemoForm onAdd={handleAdd} />
      <MemoList
        memos={filteredMemos}
        onToggleDone={(id) => store.toggleDone(id)}
        onDelete={(id) => store.remove(id)}
        onUpdate={(id, title, content) => store.update(id, { title, content })}
      />
    </div>
  )
}
