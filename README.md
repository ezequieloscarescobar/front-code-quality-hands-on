# Orders Dashboard

Interfaz web interna para el equipo de operaciones. Permite gestionar órdenes de compra: listar, crear, confirmar, pagar y cancelar órdenes, además de consultar métricas del sistema.

## Dominio

Las órdenes siguen el ciclo de vida `PENDING → CONFIRMED → PAID`, con posibilidad de llegar a `CANCELLED` desde cualquier estado no terminal.

**Cupones disponibles:** `DESCUENTO10` (10%), `DESCUENTO20` (20%), `VERANO50` (50%).  
**Impuestos:** 21% sobre el subtotal con descuento aplicado.

## Cómo correr la aplicación

```bash
npm install
npm run dev
```

La aplicación arranca en `http://localhost:5173`. No requiere backend ni variables de entorno; los datos son gestionados por un cliente mock autocontenido.

## Pantallas

| Ruta | Descripción |
|---|---|
| `/` | Listado de órdenes con filtros por estado y cliente |
| `/orders/new` | Formulario para crear una nueva orden |
| `/orders/:id` | Detalle de orden con acciones disponibles |
| `/reports` | Métricas e ingresos del sistema |

## Próximos features

El equipo de producto tiene pendientes las siguientes incorporaciones al dashboard:

- **Órdenes programadas (`SCHEDULED_ORDER`):** un nuevo estado que permite agendar una orden para procesamiento futuro, con fecha y hora de ejecución. Implica nuevas transiciones de estado y acciones en la vista de detalle.
- **Cupones por campaña:** se planea reemplazar el set fijo de cupones por cupones configurables desde backoffice (ej. `NAVIDAD25`, `BFRIDAY30`), con porcentajes y vigencias variables.
- **Cancelación masiva:** posibilidad de seleccionar múltiples órdenes desde el listado y cancelarlas en un solo paso.
