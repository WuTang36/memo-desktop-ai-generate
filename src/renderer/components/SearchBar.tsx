interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps): JSX.Element {
  return (
    <div className="toolbar">
      <input
        type="text"
        className="search-input"
        placeholder="搜索备忘录..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button
          className="btn btn-sm"
          onClick={() => onChange('')}
          style={{ display: 'inline-flex' }}
        >
          ✕
        </button>
      )}
    </div>
  )
}
