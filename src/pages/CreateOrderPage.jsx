import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../api/ordersClient'

const CUPONES = { DESCUENTO10: 0.10, DESCUENTO20: 0.20, VERANO50: 0.50 }
const TASA_IVA = 0.21

const ITEM_VACIO = { id: '', name: '', cantidad: 1, valor: 0 }

export default function CreateOrderPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ customer: '', mail: '', nombre: '', cupon: '' })
  const [items, setItems] = useState([{ ...ITEM_VACIO }])
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Cálculo de precios en vivo: lógica de negocio dentro del componente visual
  const subtotal = items.reduce((sum, item) => {
    return sum + (Number(item.cantidad) || 0) * (Number(item.valor) || 0)
  }, 0)
  const descuentoRate = CUPONES[formData.cupon] || 0
  const descuento = subtotal * descuentoRate
  const impuestos = (subtotal - descuento) * TASA_IVA
  const total = subtotal - descuento + impuestos

  // Validación de email definida como función local en el componente
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function handleFieldChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  function handleItemChange(index, field, value) {
    setItems(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  function addItem() {
    setItems(prev => [...prev, { ...ITEM_VACIO }])
  }

  function removeItem(index) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  // Validación escrita inline en el submit handler.
  // Parte de esta lógica se repite en la condición `disabled` del botón.
  async function handleSubmit(e) {
    e.preventDefault()
    const newErrors = {}

    if (!formData.customer.trim()) {
      newErrors.customer = 'El ID de cliente es requerido'
    }

    if (!formData.mail.trim()) {
      newErrors.mail = 'El email es requerido'
    } else if (!isValidEmail(formData.mail)) {
      newErrors.mail = 'El email no tiene un formato válido'
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (items.length === 0) {
      newErrors.items = 'Debe agregar al menos un ítem'
    } else {
      items.forEach((item, i) => {
        if (!item.id.trim()) newErrors[`item_${i}_id`] = `Ítem ${i + 1}: ID de producto requerido`
        if (!item.name.trim()) newErrors[`item_${i}_name`] = `Ítem ${i + 1}: nombre requerido`
        if (!item.cantidad || Number(item.cantidad) <= 0)
          newErrors[`item_${i}_cantidad`] = `Ítem ${i + 1}: cantidad debe ser mayor a 0`
        if (!item.valor || Number(item.valor) <= 0)
          newErrors[`item_${i}_valor`] = `Ítem ${i + 1}: precio debe ser mayor a 0`
      })
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        customer: formData.customer.trim(),
        mail: formData.mail.trim(),
        nombre: formData.nombre.trim(),
        productos: items.map(item => ({
          id: item.id.trim(),
          name: item.name.trim(),
          cantidad: Number(item.cantidad),
          valor: Number(item.valor),
        })),
        cupon: formData.cupon || null,
      }
      const created = await createOrder(payload)
      navigate(`/orders/${created.orderId}`)
    } catch (err) {
      setErrors({ submit: 'Error al crear la orden. Intente nuevamente.' })
    } finally {
      setSubmitting(false)
    }
  }

  // La condición de disabled repite parte de la validación del submit:
  // customer, mail, e isValidEmail están duplicados. No chequea `nombre`.
  // La verificación de ítems vacíos también aparece acá y en el handler.
  const isFormIncomplete =
    !formData.customer.trim() ||
    !formData.mail.trim() ||
    !isValidEmail(formData.mail) ||
    items.length === 0 ||
    items.some(
      item =>
        !item.id.trim() ||
        !item.name.trim() ||
        Number(item.cantidad) <= 0 ||
        Number(item.valor) <= 0
    )

  return (
    <div className="page">
      <div className="page-header">
        <h1>Nueva orden</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          ← Volver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-section">
          <h2>Datos del cliente</h2>
          <div className="form-row">
            <div className="form-group">
              <label>ID de cliente *</label>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleFieldChange}
                placeholder="cliente-001"
                className={errors.customer ? 'input-error' : ''}
              />
              {errors.customer && <span className="error-msg">{errors.customer}</span>}
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="text"
                name="mail"
                value={formData.mail}
                onChange={handleFieldChange}
                placeholder="nombre@empresa.com"
                className={errors.mail ? 'input-error' : ''}
              />
              {errors.mail && <span className="error-msg">{errors.mail}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleFieldChange}
                placeholder="Nombre y apellido"
                className={errors.nombre ? 'input-error' : ''}
              />
              {errors.nombre && <span className="error-msg">{errors.nombre}</span>}
            </div>
            <div className="form-group">
              <label>Cupón de descuento</label>
              <select name="cupon" value={formData.cupon} onChange={handleFieldChange}>
                <option value="">Sin cupón</option>
                <option value="DESCUENTO10">DESCUENTO10 — 10% off</option>
                <option value="DESCUENTO20">DESCUENTO20 — 20% off</option>
                <option value="VERANO50">VERANO50 — 50% off</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>Ítems</h2>
            <button type="button" className="btn btn-sm btn-secondary" onClick={addItem}>
              + Agregar ítem
            </button>
          </div>
          {errors.items && <div className="error-msg" style={{ marginBottom: 12 }}>{errors.items}</div>}

          {items.map((item, index) => (
            <div key={index} className="item-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label>ID producto</label>
                <input
                  type="text"
                  value={item.id}
                  onChange={e => handleItemChange(index, 'id', e.target.value)}
                  placeholder="PROD-001"
                  className={errors[`item_${index}_id`] ? 'input-error' : ''}
                />
                {errors[`item_${index}_id`] && (
                  <span className="error-msg">{errors[`item_${index}_id`]}</span>
                )}
              </div>
              <div className="form-group" style={{ flex: 2 }}>
                <label>Nombre del producto</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={e => handleItemChange(index, 'name', e.target.value)}
                  placeholder="Descripción"
                  className={errors[`item_${index}_name`] ? 'input-error' : ''}
                />
                {errors[`item_${index}_name`] && (
                  <span className="error-msg">{errors[`item_${index}_name`]}</span>
                )}
              </div>
              <div className="form-group form-group-sm">
                <label>Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={item.cantidad}
                  onChange={e => handleItemChange(index, 'cantidad', e.target.value)}
                  className={errors[`item_${index}_cantidad`] ? 'input-error' : ''}
                />
                {errors[`item_${index}_cantidad`] && (
                  <span className="error-msg">{errors[`item_${index}_cantidad`]}</span>
                )}
              </div>
              <div className="form-group form-group-sm">
                <label>Precio unit.</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={item.valor}
                  onChange={e => handleItemChange(index, 'valor', e.target.value)}
                  className={errors[`item_${index}_valor`] ? 'input-error' : ''}
                />
                {errors[`item_${index}_valor`] && (
                  <span className="error-msg">{errors[`item_${index}_valor`]}</span>
                )}
              </div>
              <div className="form-group form-group-sm">
                <label>Subtotal</label>
                <div className="item-total">
                  ${((Number(item.cantidad) || 0) * (Number(item.valor) || 0)).toFixed(2)}
                </div>
              </div>
              {items.length > 1 && (
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  style={{ marginTop: 22 }}
                  onClick={() => removeItem(index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="form-section price-summary">
          <h2>Resumen de precios</h2>
          <div className="price-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {descuento > 0 && (
            <div className="price-row discount">
              <span>Descuento ({formData.cupon})</span>
              <span>−${descuento.toFixed(2)}</span>
            </div>
          )}
          <div className="price-row">
            <span>IVA (21%)</span>
            <span>${impuestos.toFixed(2)}</span>
          </div>
          <div className="price-row total">
            <span>Total estimado</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {errors.submit && (
          <div className="error-banner">{errors.submit}</div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isFormIncomplete || submitting}
          >
            {submitting ? 'Creando orden...' : 'Crear orden'}
          </button>
        </div>
      </form>
    </div>
  )
}
