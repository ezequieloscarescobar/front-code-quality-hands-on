export default function OrderItemsTable({ items }) {
  return (
    <table className="table">
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
        {items.map(item => (
          <tr key={item.productId}>
            <td>{item.productName}</td>
            <td className="text-muted">{item.productId}</td>
            <td>{item.quantity}</td>
            <td>${item.unitPrice.toFixed(2)}</td>
            <td>${item.total.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
