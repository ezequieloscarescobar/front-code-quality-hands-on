const STATUS_CONFIG = {
  PENDING:   { label: 'Pendiente',  color: '#f59e0b' },
  CONFIRMED: { label: 'Confirmada', color: '#3b82f6' },
  PAID:      { label: 'Pagada',     color: '#10b981' },
  CANCELLED: { label: 'Cancelada',  color: '#ef4444' },
}

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, color: '#6b7280' }
  return (
    <span
      className="status-badge"
      style={{ backgroundColor: config.color }}
    >
      {config.label}
    </span>
  )
}
