export default function ToggleButton({ onClick, style, text, active = false }: { style?: React.CSSProperties, text?: string, active?: boolean, onClick?: () => void }) {
  return (
    <button
      style={style}
      onClick={onClick}
      className={active ? "toggle-button toggle-button_active" : "toggle-button"}>
      {text}
    </button>
  )
}