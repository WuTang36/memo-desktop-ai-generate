export interface HistoryEntry {
  title: string
  content: string
  time: string
}

export interface Memo {
  id: string
  title: string
  content: string
  done: boolean
  color: string
  createdAt: string
  updatedAt: string
  history: HistoryEntry[]
}

export interface MemoStats {
  total: number
  done: number
}

export type MemoListener = (memos: Memo[]) => void
