export function formatHours(hours) {
  return Number(hours).toLocaleString('es-CL', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
}