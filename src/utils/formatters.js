export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('es-AR')
}
