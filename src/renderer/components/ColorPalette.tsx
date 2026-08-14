interface ColorPaletteProps {
  selectedColor: string
  onSelect: (color: string) => void
}

const COLORS = [
  { value: '', className: 'color-swatch-none', label: '无' },
  { value: '#ffffff', label: '白色' },
  { value: '#fff9c4', label: '黄色' },
  { value: '#c8e6c9', label: '绿色' },
  { value: '#bbdefb', label: '蓝色' },
  { value: '#f8bbd0', label: '粉色' },
  { value: '#e1bee7', label: '紫色' },
  { value: '#ffe0b2', label: '橙色' },
  { value: '#b2dfdb', label: '青色' }
]

export function ColorPalette({ selectedColor, onSelect }: ColorPaletteProps): JSX.Element {
  return (
    <div className="color-palette">
      <span className="color-palette-label">背景色：</span>
      <span
        className="color-preview"
        style={{ background: selectedColor || '#fff' }}
      />
      {COLORS.map(c => (
        <span
          key={c.value}
          className={`${c.value === '' ? 'color-swatch-none' : 'color-swatch'}${selectedColor === c.value ? ' selected' : ''}`}
          style={c.value ? { background: c.value } : undefined}
          data-color={c.value}
          onClick={() => onSelect(c.value)}
          title={c.label}
        />
      ))}
    </div>
  )
}
