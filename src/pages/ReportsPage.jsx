import { useState, useEffect } from 'react'
import { fetchReports } from '../api/ordersClient'
import StatusBadge from '../components/StatusBadge'

// Mapa de cupones duplicado (también existe en CreateOrderPage con el mismo nombre en español)
const COUPONS = { DESCUENTO10: 0.10, DESCUENTO20: 0.20, VERANO50: 0.50 }
const TAX_RATE = 0.21

export default function ReportsPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch propio, sin estado compartido con el resto de la app
  useEffect(() => {
    setLoading(true)
    fetchReports().then(data => {
      setOrders(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="loading">Cargando reportes...</div>

  const paid      = orders.filter(o => o.orderStatus === 'PAID')
  const pending   = orders.filter(o => o.orderStatus === 'PENDING')
  const confirmed = orders.filter(o => o.orderStatus === 'CONFIRMED')
  const cancelled = orders.filter(o => o.orderStatus === 'CANCELLED')

  const ingresoTotal = paid.reduce((sum, o) => sum + o.totalAmount, 0)

  // Calcula el IVA recaudado como totalAmount * 21% en lugar de usar o.taxAmount.
  // Esto sobreestima los impuestos porque el total ya incluye el IVA:
  //   correcto: (subtotal − descuento) × 0.21
  //   incorrecto: total × 0.21 = (subtotal − descuento) × 1.21 × 0.21
  const impuestosRecaudados = paid.reduce((sum, o) => sum + o.totalAmount * TAX_RATE, 0)

  const descuentosOtorgados = orders.reduce((sum, o) => sum + o.discountAmount, 0)

  return (
    <div className="page">
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Reportes</h1>

      <div>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Órdenes por estado
        </h2>
        <div className="cards-grid">
          <div className="card">
            <div className="card-label">Total órdenes</div>
            <div className="card-value">{orders.length}</div>
          </div>
          <div className="card card-pending">
            <div className="card-label">Pendientes</div>
            <div className="card-value">{pending.length}</div>
          </div>
          <div className="card card-confirmed">
            <div className="card-label">Confirmadas</div>
            <div className="card-value">{confirmed.length}</div>
          </div>
          <div className="card card-paid">
            <div className="card-label">Pagadas</div>
            <div className="card-value">{paid.length}</div>
          </div>
          <div className="card card-cancelled">
            <div className="card-label">Canceladas</div>
            <div className="card-value">{cancelled.length}</div>
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Ingresos (órdenes pagadas)
        </h2>
        <div className="cards-grid">
          <div className="card">
            <div className="card-label">Ingresos totales</div>
            <div className="card-value" style={{ fontSize: 22 }}>${ingresoTotal.toFixed(2)}</div>
          </div>
          <div className="card">
            <div className="card-label">IVA recaudado</div>
            <div className="card-value" style={{ fontSize: 22 }}>${impuestosRecaudados.toFixed(2)}</div>
          </div>
          <div className="card">
            <div className="card-label">Descuentos otorgados</div>
            <div className="card-value" style={{ fontSize: 22 }}>${descuentosOtorgados.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Detalle por orden
        </h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Subtotal</th>
              <th>Descuento</th>
              <th>IVA</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.orderId}>
                <td style={{ fontWeight: 600 }}>#{order.orderId}</td>
                <td>{order.clientName}</td>
                <td>
                  <StatusBadge status={order.orderStatus} />
                </td>
                <td>${order.subtotalAmount.toFixed(2)}</td>
                <td>
                  {order.discountAmount > 0
                    ? <span style={{ color: '#059669' }}>−${order.discountAmount.toFixed(2)}</span>
                    : <span className="text-muted">—</span>}
                </td>
                <td>${order.taxAmount.toFixed(2)}</td>
                <td style={{ fontWeight: 600 }}>${order.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
