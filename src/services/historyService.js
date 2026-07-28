const STORAGE_KEY = 'steam-history'

export function getHistory() {
  const history = sessionStorage.getItem(STORAGE_KEY)

  return history ? JSON.parse(history) : []
}

export function saveHistory(profile) {
  let history = getHistory()

  // Eliminar si ya existe
  history = history.filter(
    (item) => item.steamId !== profile.steamId
  )

  history.unshift({
    steamId: profile.steamId,
    name: profile.name,
    avatar: profile.avatar,
    searchedAt: Date.now(),
  })

  // Máximo 10 perfiles
  history = history.slice(0, 10)

  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(history)
  )
}

export function clearHistory() {
  sessionStorage.removeItem(STORAGE_KEY)
}