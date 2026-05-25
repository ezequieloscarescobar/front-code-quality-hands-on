// Cliente mock autocontenido que simula el orders-service.
// El estado vive en este array en memoria. Cada pantalla hace su propio fetch
// y guarda una copia local en React — eso habilita la desincronización entre vistas.

let nextId = 11

const orders = [
  {
    orderId: 1,
    orderStatus: 'PENDING',
    clientId: 'cliente-001',
    clientEmail: 'juan.garcia@empresa.com',
    clientName: 'Juan García',
    subtotalAmount: 1100.00,
    discountAmount: 0.00,
    taxAmount: 231.00,
    totalAmount: 1331.00,
    orderItems: [
      { productId: 'PROD-LAP', productName: 'Laptop Lenovo ThinkPad', quantity: 1, unitPrice: 1100.00, total: 1100.00 }
    ],
    creationDate: '2024-03-01T10:00:00.000Z',
    paymentReference: null
  },
  {
    orderId: 2,
    orderStatus: 'PENDING',
    clientId: 'cliente-002',
    clientEmail: 'maria.lopez@corp.com',
    clientName: 'María López',
    subtotalAmount: 950.00,
    discountAmount: 95.00,
    taxAmount: 179.55,
    totalAmount: 1034.55,
    orderItems: [
      { productId: 'PROD-MON', productName: 'Monitor Samsung 27"', quantity: 1, unitPrice: 800.00, total: 800.00 },
      { productId: 'PROD-KEY', productName: 'Teclado Mecánico', quantity: 1, unitPrice: 150.00, total: 150.00 }
    ],
    creationDate: '2024-03-02T11:30:00.000Z',
    paymentReference: null
  },
  {
    orderId: 3,
    orderStatus: 'CONFIRMED',
    clientId: 'cliente-001',
    clientEmail: 'juan.garcia@empresa.com',
    clientName: 'Juan García',
    subtotalAmount: 1200.00,
    discountAmount: 240.00,
    taxAmount: 201.60,
    totalAmount: 1161.60,
    orderItems: [
      { productId: 'PROD-PHN', productName: 'iPhone 15 Pro', quantity: 1, unitPrice: 1200.00, total: 1200.00 }
    ],
    creationDate: '2024-03-03T09:15:00.000Z',
    paymentReference: null
  },
  {
    orderId: 4,
    orderStatus: 'CONFIRMED',
    clientId: 'cliente-003',
    clientEmail: 'carlos.ruiz@startup.io',
    clientName: 'Carlos Ruiz',
    subtotalAmount: 380.00,
    discountAmount: 190.00,
    taxAmount: 39.90,
    totalAmount: 229.90,
    orderItems: [
      { productId: 'PROD-HEAD', productName: 'Auriculares Sony WH-1000XM5', quantity: 1, unitPrice: 300.00, total: 300.00 },
      { productId: 'PROD-MSE', productName: 'Mouse Inalámbrico Logitech', quantity: 2, unitPrice: 40.00, total: 80.00 }
    ],
    creationDate: '2024-03-04T14:00:00.000Z',
    paymentReference: null
  },
  {
    orderId: 5,
    orderStatus: 'PAID',
    clientId: 'cliente-002',
    clientEmail: 'maria.lopez@corp.com',
    clientName: 'María López',
    subtotalAmount: 1500.00,
    discountAmount: 150.00,
    taxAmount: 283.50,
    totalAmount: 1633.50,
    orderItems: [
      { productId: 'PROD-CAM', productName: 'Cámara Canon EOS R50', quantity: 1, unitPrice: 1500.00, total: 1500.00 }
    ],
    creationDate: '2024-03-05T16:45:00.000Z',
    paymentReference: 'PAY-2024-001'
  },
  {
    orderId: 6,
    orderStatus: 'PAID',
    clientId: 'cliente-004',
    clientEmail: 'ana.torres@logistica.com',
    clientName: 'Ana Torres',
    subtotalAmount: 2000.00,
    discountAmount: 1000.00,
    taxAmount: 210.00,
    totalAmount: 1210.00,
    orderItems: [
      { productId: 'PROD-TV', productName: 'Smart TV Samsung 55"', quantity: 1, unitPrice: 2000.00, total: 2000.00 }
    ],
    creationDate: '2024-03-06T10:30:00.000Z',
    paymentReference: 'PAY-2024-002'
  },
  {
    orderId: 7,
    orderStatus: 'CANCELLED',
    clientId: 'cliente-003',
    clientEmail: 'carlos.ruiz@startup.io',
    clientName: 'Carlos Ruiz',
    subtotalAmount: 400.00,
    discountAmount: 0.00,
    taxAmount: 84.00,
    totalAmount: 484.00,
    orderItems: [
      { productId: 'PROD-PRT', productName: 'Impresora HP LaserJet Pro', quantity: 1, unitPrice: 400.00, total: 400.00 }
    ],
    creationDate: '2024-03-07T08:00:00.000Z',
    paymentReference: null
  },
  {
    orderId: 8,
    orderStatus: 'CANCELLED',
    clientId: 'cliente-001',
    clientEmail: 'juan.garcia@empresa.com',
    clientName: 'Juan García',
    subtotalAmount: 300.00,
    discountAmount: 60.00,
    taxAmount: 50.40,
    totalAmount: 290.40,
    orderItems: [
      { productId: 'PROD-SPK', productName: 'Parlante JBL Charge 5', quantity: 1, unitPrice: 250.00, total: 250.00 },
      { productId: 'PROD-CBL', productName: 'Cable HDMI 2m', quantity: 2, unitPrice: 25.00, total: 50.00 }
    ],
    creationDate: '2024-03-08T12:00:00.000Z',
    paymentReference: null
  },
  {
    orderId: 9,
    orderStatus: 'PENDING',
    clientId: 'cliente-004',
    clientEmail: 'ana.torres@logistica.com',
    clientName: 'Ana Torres',
    subtotalAmount: 700.00,
    discountAmount: 0.00,
    taxAmount: 147.00,
    totalAmount: 847.00,
    orderItems: [
      { productId: 'PROD-TAB', productName: 'Tablet iPad Air 11"', quantity: 1, unitPrice: 700.00, total: 700.00 }
    ],
    creationDate: '2024-03-09T15:30:00.000Z',
    paymentReference: null
  },
  {
    orderId: 10,
    orderStatus: 'CONFIRMED',
    clientId: 'cliente-005',
    clientEmail: 'pedro.mendez@networks.net',
    clientName: 'Pedro Méndez',
    subtotalAmount: 300.00,
    discountAmount: 0.00,
    taxAmount: 63.00,
    totalAmount: 363.00,
    orderItems: [
      { productId: 'PROD-RTR', productName: 'Router TP-Link AX3000', quantity: 1, unitPrice: 180.00, total: 180.00 },
      { productId: 'PROD-SWT', productName: 'Switch Gigabit 8 puertos', quantity: 1, unitPrice: 120.00, total: 120.00 }
    ],
    creationDate: '2024-03-10T11:00:00.000Z',
    paymentReference: null
  }
]

function randomDelay() {
  return new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300))
}

function cloneOrder(order) {
  return { ...order, orderItems: order.orderItems.map(i => ({ ...i })) }
}

export async function fetchOrders() {
  await randomDelay()
  return orders.map(cloneOrder)
}

export async function fetchOrderById(id) {
  await randomDelay()
  const order = orders.find(o => o.orderId === Number(id))
  if (!order) throw new Error(`Orden ${id} no encontrada`)
  return cloneOrder(order)
}

export async function createOrder(payload) {
  await randomDelay()

  const COUPONS = { DESCUENTO10: 0.10, DESCUENTO20: 0.20, VERANO50: 0.50 }
  const TAX_RATE = 0.21

  const items = payload.productos.map(p => ({
    productId: p.id,
    productName: p.name,
    quantity: Number(p.cantidad),
    unitPrice: Number(p.valor),
    total: Number(p.cantidad) * Number(p.valor)
  }))

  const subtotal = items.reduce((sum, i) => sum + i.total, 0)
  const discountRate = payload.cupon ? (COUPONS[payload.cupon] || 0) : 0
  const discount = subtotal * discountRate
  const tax = (subtotal - discount) * TAX_RATE
  const total = subtotal - discount + tax

  const newOrder = {
    orderId: nextId++,
    orderStatus: 'PENDING',
    clientId: payload.customer,
    clientEmail: payload.mail,
    clientName: payload.nombre,
    subtotalAmount: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discount * 100) / 100,
    taxAmount: Math.round(tax * 100) / 100,
    totalAmount: Math.round(total * 100) / 100,
    orderItems: items,
    creationDate: new Date().toISOString(),
    paymentReference: null
  }

  orders.push(newOrder)
  return cloneOrder(newOrder)
}

export async function confirmOrder(id) {
  await randomDelay()
  const order = orders.find(o => o.orderId === Number(id))
  if (!order) throw new Error(`Orden ${id} no encontrada`)
  if (order.orderStatus !== 'PENDING') throw new Error('Solo se pueden confirmar órdenes PENDING')
  order.orderStatus = 'CONFIRMED'
  return cloneOrder(order)
}

export async function payOrder(id, method) {
  await randomDelay()
  const order = orders.find(o => o.orderId === Number(id))
  if (!order) throw new Error(`Orden ${id} no encontrada`)
  if (order.orderStatus !== 'PENDING' && order.orderStatus !== 'CONFIRMED') {
    throw new Error('Solo se pueden pagar órdenes PENDING o CONFIRMED')
  }
  order.orderStatus = 'PAID'
  order.paymentReference = `PAY-${Date.now()}`
  return cloneOrder(order)
}

export async function cancelOrder(id) {
  await randomDelay()
  const order = orders.find(o => o.orderId === Number(id))
  if (!order) throw new Error(`Orden ${id} no encontrada`)
  if (order.orderStatus === 'CANCELLED') throw new Error('La orden ya está cancelada')
  order.orderStatus = 'CANCELLED'
  return cloneOrder(order)
}

export async function fetchReports() {
  await randomDelay()
  return orders.map(cloneOrder)
}
