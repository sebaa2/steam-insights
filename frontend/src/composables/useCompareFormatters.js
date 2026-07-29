// src/composables/useCompareFormatters.js
export function useCompareFormatters() {
  const formatHours = (hours) => {
    const h = Number(hours) || 0
    if (h === 0) return '0'
    if (h >= 1000) return `${(h / 1000).toFixed(1)}k`
    if (h >= 10) return `${Math.round(h)}`
    return `${Math.round(h * 10) / 10}`
  }

  const formatHoursWithUnit = (hours) => {
    const h = Number(hours) || 0
    if (h === 0) return '0h'
    if (h >= 1000) return `${(h / 1000).toFixed(1)}k h`
    if (h >= 10) return `${Math.round(h)} h`
    return `${Math.round(h * 10) / 10} h`
  }

  const formatHoursDiff = (left, right) => {
    const l = Number(left) || 0
    const r = Number(right) || 0
    const diff = l - r

    if (diff === 0) return 'Empate'

    const absDiff = Math.abs(diff)
    let formatted

    if (absDiff >= 1000) {
      formatted = `${(absDiff / 1000).toFixed(1)}k`
    } else if (absDiff >= 10) {
      formatted = `${Math.round(absDiff)}`
    } else {
      formatted = `${Math.round(absDiff * 10) / 10}`
    }

    const sign = diff > 0 ? '+' : '-'
    return `${sign}${formatted} h`
  }

  const formatNumber = (value) => {
    const num = Number(value) || 0
    return Math.round(num).toLocaleString()
  }

  const formatPercentage = (value) => {
    const num = Number(value) || 0
    return `${Math.round(num)}%`
  }

  const formatAverage = (value) => {
    const num = Number(value) || 0
    return `${Math.round(num * 10) / 10} h`
  }

  return {
    formatHours,
    formatHoursWithUnit,
    formatHoursDiff,
    formatNumber,
    formatPercentage,
    formatAverage,
  }
}
