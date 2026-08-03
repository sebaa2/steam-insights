<!-- components/achievements/DebugMenu.vue -->
<template>
    <div v-if="show" class="debug-overlay" @click.self="close">
        <div class="debug-menu">
            <div class="debug-header">
                <span class="debug-title">🔧 Debug Menu</span>
                <button @click="close" class="debug-close">✕</button>
            </div>

            <div class="debug-content">
                <!-- Información -->
                <div class="debug-section">
                    <h4>📊 Información</h4>
                    <div class="debug-info">
                        <p><strong>App ID:</strong> {{ appId }}</p>
                        <p><strong>Juego:</strong> {{ gameName }}</p>
                        <p><strong>Usuario:</strong> {{ username || 'No logueado' }}</p>
                        <p><strong>Logros:</strong> {{ stats.total }} total, {{ stats.achieved }} conseguidos</p>
                        <p><strong>Progreso:</strong> {{ stats.percentage }}%</p>
                    </div>
                </div>

                <!-- Acciones -->
                <div class="debug-section">
                    <h4>⚡ Acciones</h4>
                    <div class="debug-actions">
                        <button @click="reloadData" class="debug-btn">🔄 Recargar datos</button>
                        <button @click="toggleFilters" class="debug-btn">📊 Filtros</button>
                        <button @click="exportData" class="debug-btn">📥 Exportar JSON</button>
                        <button @click="copyDebugInfo" class="debug-btn">📋 Copiar info</button>
                        <button @click="toggleDarkMode" class="debug-btn">🌙 Tema oscuro</button>
                    </div>
                </div>

                <!-- Datos crudos -->
                <div class="debug-section">
                    <details>
                        <summary>📄 Datos crudos (JSON)</summary>
                        <pre>{{ JSON.stringify(achievementsData, null, 2) }}</pre>
                    </details>
                </div>

                <!-- Estadísticas -->
                <div class="debug-section" v-if="achievementsData?.achievements">
                    <h4>📈 Estadísticas</h4>
                    <div class="debug-stats">
                        <div class="stat-item">
                            <span class="stat-label">Conseguidos:</span>
                            <span class="stat-value" style="color: #4caf50;">{{ stats.achieved }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Pendientes:</span>
                            <span class="stat-value" style="color: #ef5350;">{{ stats.total - stats.achieved }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Ocultos:</span>
                            <span class="stat-value" style="color: #ffd700;">
                                {{achievementsData.achievements.filter(a => a.hidden).length}}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="debug-footer">
                    <span class="debug-version">v1.0 - Konami Code activado</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    show: Boolean,
    appId: String,
    gameName: String,
    username: String,
    stats: Object,
    achievementsData: Object
})

const emit = defineEmits(['close', 'reload'])

const isDark = ref(true)

const close = () => emit('close')
const reloadData = () => emit('reload')

const toggleFilters = () => {
    document.querySelector('.filters')?.classList?.toggle('hidden')
}

const exportData = () => {
    if (!props.achievementsData) return
    const data = JSON.stringify(props.achievementsData, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `achievements-${props.appId}.json`
    a.click()
    URL.revokeObjectURL(url)
}

const copyDebugInfo = () => {
    const info = {
        appId: props.appId,
        gameName: props.gameName,
        username: props.username,
        stats: props.stats,
        totalAchievements: props.achievementsData?.totalAchievements || 0
    }
    navigator.clipboard?.writeText(JSON.stringify(info, null, 2))
}

const toggleDarkMode = () => {
    isDark.value = !isDark.value
    document.documentElement.style.filter = isDark.value ? 'none' : 'invert(1)'
}
</script>

<style scoped src="./DebugMenu.css"></style>