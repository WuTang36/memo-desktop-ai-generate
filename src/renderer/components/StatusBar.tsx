interface StatusBarProps {
  storageAvailable: boolean
}

export function StatusBar({ storageAvailable }: StatusBarProps): JSX.Element | null {
  if (storageAvailable) return null
  return (
    <div className="status-bar" role="alert">
      ⚠️ 本地存储不可用，刷新后数据将丢失
    </div>
  )
}
