export function detectSteamInput(value) {
  value = value.trim()

  if (/^\d{17}$/.test(value)) {
    return {
      type: 'steamid',
      value,
    }
  }

  if (value.includes('/profiles/')) {
    const id = value.split('/profiles/')[1].split('/')[0]

    return {
      type: 'steamid',
      value: id,
    }
  }

  if (value.includes('/id/')) {
    const id = value.split('/id/')[1].split('/')[0]

    return {
      type: 'vanity',
      value: id,
    }
  }

  return {
    type: 'vanity',
    value,
  }
}
