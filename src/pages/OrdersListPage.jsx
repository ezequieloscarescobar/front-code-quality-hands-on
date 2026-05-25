import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchOrders } from '../api/ordersClient'

// Status helpers defined inline — ligeras diferencias con StatusBadge:
// colores distintos (#2563eb vs #3b82f6, #059669 vs #10b981)
// y labels en masculino ("Confirmado") vs el femenino de StatusBadge ("Confirmada")
function getStatusColor(status) {
  if (status === 'PENDING') return '#f59e0b'
  if (status === 'CONFIRMED') return '#2563eb'
  if (status === 'PAID') return '#059669'
  if (status === 'CANCELLED') return '#ef4444'
  return '#6b7280'
}

function getStatusLabel(status) {
  if (status === 'PENDING') return 'Pendiente'
  if (status === 'CONFIRMED') return 'Confirmado'
  if (status === 'PAID') return 'Pagado'
  if (status === 'CANCELLED') return 'Cancelado'
  return status
}

export default function OrdersListPage() {
  const navigate = useNavigate()
  const [allOrders, setAllOrders] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterClient, setFilterClient] = useState('')
  const [summaryStats, setSummaryStats] = useState({ total: 0, pending: 0, paid: 0 })

  // Solo corre al montar — no vuelve a fetchear al regresar desde el Detalle.
  // Si el usuario confirmó/pagó una orden allá, acá seguirá mostrando el estado viejo.
  useEffect(() => {
    setLoading(true)
    fetchOrders().then(data => {
      setAllOrders(data)
      setOrders(data)
      // Derivación de stats mezclada dentro del mismo effect de fetching
      setSummaryStats({
        total: data.length,
        pending: data.filter(o => o.orderStatus === 'PENDING').length,
        paid: data.filter(o => o.orderStatus === 'PAID').length,
      })
      setLoading(false)
    })
  }, [])

  // Re-fetchea cada vez que cambia el filtro de estado, en lugar de
  // filtrar sobre allOrders que ya está en memoria
  useEffect(() => {
    if (allOrders.length === 0) return
    fetchOrders().then(data => {
      const filtered = data.filter(o => {
        if (filterStatus && o.orderStatus !== filterStatus) return false
        if (filterClient && !o.clientId.toLowerCase().includes(filterClient.toLowerCase())) return false
        return true
      })
      setOrders(filtered)
    })
  }, [filterStatus]) // filterClient no está en las deps → no reacciona a cambios de texto

  function handleFilterClient(e) {
    const value = e.target.value
    setFilterClient(value)
    // Filtra manualmente en memoria al tipear — inconsistente con el effect de status
    const filtered = allOrders.filter(o => {
      if (filterStatus && o.orderStatus !== filterStatus) return false
      if (!o.clientId.toLowerCase().includes(value.toLowerCase())) return false
      return true
    })
    setOrders(filtered)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Órdenes</h1>
        <button className="btn btn-primary" onClick={() => navigate('/orders/new')}>
          + Nueva orden
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <div className="card" style={{ flex: 1 }}>
          <div className="card-label">Total</div>
          <div className="card-value">{summaryStats.total}</div>
        </div>
        <div className="card card-pending" style={{ flex: 1 }}>
          <div className="card-label">Pendientes</div>
          <div className="card-value">{summaryStats.pending}</div>
        </div>
        <div className="card card-paid" style={{ flex: 1 }}>
          <div className="card-label">Pagadas</div>
          <div className="card-value">{summaryStats.paid}</div>
        </div>
      </div>

      <div className="filters">
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="">Todos los estados</option>
          <option value="PENDING">Pendiente</option>
          <option value="CONFIRMED">Confirmada</option>
          <option value="PAID">Pagada</option>
          <option value="CANCELLED">Cancelada</option>
        </select>
        <input
          type="text"
          placeholder="Filtrar por ID de cliente..."
          value={filterClient}
          onChange={handleFilterClient}
          className="filter-input"
        />
      </div>

      {loading ? (
        <div className="loading">Cargando órdenes...</div>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Fecha</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.orderId}>
                  <td>
                    <span style={{ fontWeight: 600 }}>#{order.orderId}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{order.clientName}</div>
                    <div className="text-muted">{order.clientId}</div>
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                    >
                      {getStatusLabel(order.orderStatus)}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>${order.totalAmount.toFixed(2)}</td>
                  <td className="text-muted">
                    {new Date(order.creationDate).toLocaleDateString('es-AR')}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => navigate(`/orders/${order.orderId}`)}
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="empty-state">No se encontraron órdenes con los filtros aplicados.</div>
          )}
        </>
      )}
    </div>
  )
}
