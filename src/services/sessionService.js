// services/sessionService.js
import { useProfileStore } from '@/stores/profileStore'

/**
 * Servicio para manejar la sesión de forma centralizada
 * Sin modificar los archivos existentes
 */
export const sessionService = {
  /**
   * Obtener el Steam ID del perfil actual
   */
  getSteamId() {
    const profileStore = useProfileStore()
    return profileStore.profile?.steamId || null
  },

  /**
   * Verificar si hay un usuario logueado
   */
  isLoggedIn() {
    const profileStore = useProfileStore()
    return !!profileStore.profile?.steamId
  },

  /**
   * Obtener el perfil completo
   */
  getProfile() {
    const profileStore = useProfileStore()
    return profileStore.profile
  },

  /**
   * Obtener el nombre del usuario
   */
  getUsername() {
    const profileStore = useProfileStore()
    return profileStore.profile?.name || null
  }
}