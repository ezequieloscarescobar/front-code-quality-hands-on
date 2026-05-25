import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchOrderById, confirmOrder, payOrder, cancelOrder } from '../api/ordersClient'

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState(null)

  // Sin cleanup: si el usuario navega rápido entre órdenes, el setState
  // puede ejecutarse sobre un componente ya desmontado.
  useEffect(() => {
    setLoading(true)
    setError(null)
    setOrder(null)
    fetchOrderById(id)
      .then(data => {
        setOrder(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  async function handleConfirm() {
    setActionLoading(true)
    setActionError(null)
    try {
      const updated = await confirmOrder(id)
      setOrder(updated)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  async function handlePay() {
    setActionLoading(true)
    setActionError(null)
    try {
      const updated = await payOrder(id, 'CARD')
      setOrder(updated)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleCancel() {
    if (!window.confirm('¿Seguro que desea cancelar esta orden?')) return
    setActionLoading(true)
    setActionError(null)
    try {
      const updated = await cancelOrder(id)
      setOrder(updated)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  // Versión local de status → estilo. Usa fondo sutil en lugar del badge sólido de StatusBadge.
  // Labels en masculino ("Confirmado") vs StatusBadge ("Confirmada").
  function getStatusStyle(status) {
    const map = {
      PENDING:   { background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' },
      CONFIRMED: { background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' },
      PAID:      { background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' },
      CANCELLED: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' },
    }
    return map[status] || { background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db' }
  }

  function getStatusLabel(status) {
    const labels = {
      PENDING: 'Pendiente',
      CONFIRMED: 'Confirmado',
      PAID: 'Pagado',
      CANCELLED: 'Cancelado',
    }
    return labels[status] || status
  }

  if (loading) return <div className="loading">Cargando orden...</div>
  if (error) return <div className="page"><div className="error-banner">{error}</div></div>
  if (!order) return null

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <h1>Orden #{order.orderId}</h1>
          <span
            style={{
              ...getStatusStyle(order.orderStatus),
              padding: '4px 14px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {getStatusLabel(order.orderStatus)}
          </span>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          ← Volver al listado
        </button>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h2>Cliente</h2>
          <div className="detail-row">
            <span>ID</span>
            <span>{order.clientId}</span>
          </div>
          <div className="detail-row">
            <span>Nombre</span>
            <span>{order.clientName}</span>
          </div>
          <div className="detail-row">
            <span>Email</span>
            <span>{order.clientEmail}</span>
          </div>
        </div>

        <div className="detail-card">
          <h2>Información de la orden</h2>
          <div className="detail-row">
            <span>Fecha de creación</span>
            <span>{new Date(order.creationDate).toLocaleString('es-AR')}</span>
          </div>
          <div className="detail-row">
            <span>Estado</span>
            <span>{getStatusLabel(order.orderStatus)}</span>
          </div>
          {order.paymentReference && (
            <div className="detail-row">
              <span>Referencia de pago</span>
              <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{order.paymentReference}</span>
            </div>
          )}
        </div>
      </div>

      <div className="section">
        <h2>Ítems de la orden</h2>
        <table className="table" style={{ border: 'none' }}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>ID</th>
              <th>Cantidad</th>
              <th>Precio unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map(item => (
              <tr key={item.productId}>
                <td style={{ fontWeight: 500 }}>{item.productName}</td>
                <td className="text-muted">{item.productId}</td>
                <td>{item.quantity}</td>
                <td>${item.unitPrice.toFixed(2)}</td>
                <td style={{ fontWeight: 600 }}>${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section price-summary">
        <h2>Desglose económico</h2>
        <div className="price-row">
          <span>Subtotal</span>
          <span>${order.subtotalAmount.toFixed(2)}</span>
        </div>
        {order.discountAmount > 0 && (
          <div className="price-row discount">
            <span>Descuento aplicado</span>
            <span>−${order.discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="price-row">
          <span>IVA (21%)</span>
          <span>${order.taxAmount.toFixed(2)}</span>
        </div>
        <div className="price-row total">
          <span>Total</span>
          <span>${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {order.orderStatus !== 'CANCELLED' && (
        <div className="section">
          <h2>Acciones disponibles</h2>
          {actionError && (
            <div className="error-banner" style={{ marginBottom: 14 }}>{actionError}</div>
          )}
          <div className="actions-row">
            {order.orderStatus === 'PENDING' && (
              <button
                className="btn btn-secondary"
                onClick={handleConfirm}
                disabled={actionLoading}
              >
                Confirmar orden
              </button>
            )}
            {(order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED') && (
              <button
                className="btn btn-primary"
                onClick={handlePay}
                disabled={actionLoading}
              >
                Registrar pago
              </button>
            )}
            {order.orderStatus !== 'CANCELLED' && (
              <button
                className="btn btn-danger"
                onClick={handleCancel}
                disabled={actionLoading}
              >
                {order.orderStatus === 'PAID' ? 'Cancelar y reembolsar' : 'Cancelar orden'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
