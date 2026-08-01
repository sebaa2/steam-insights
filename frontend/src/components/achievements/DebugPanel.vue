<!-- components/achievements/DebugPanel.vue -->
<script setup>
defineProps({
    show: Boolean,
    loading: Boolean,
    error: String,
    appId: String,
    debugInfo: Object,
    achievementsData: Object,
    isLoggedIn: Boolean,
    username: String,
    stats: Object
})
</script>

<template>
    <div v-if="show" class="debug-section">
        <div class="debug-header">
            <span class="debug-title">🔧 Información de Debug</span>
            <span class="debug-status" :class="{
                'status-loading': loading,
                'status-success': !loading && !error && achievementsData,
                'status-error': error
            }">
                {{ loading ? '⏳ Cargando...' : error ? '❌ Error' : '✅ OK' }}
            </span>
        </div>

        <div class="debug-grid">
            <div class="debug-item">
                <span class="debug-label">App ID:</span>
                <span class="debug-value">{{ appId }}</span>
            </div>
            <div class="debug-item">
                <span class="debug-label">Estado:</span>
                <span class="debug-value">{{ debugInfo.status }}</span>
            </div>
            <div class="debug-item">
                <span class="debug-label">Última petición:</span>
                <span class="debug-value">{{ debugInfo.lastRequest || 'N/A' }}</span>
            </div>
            <div class="debug-item">
                <span class="debug-label">Tiempo respuesta:</span>
                <span class="debug-value">{{ debugInfo.responseTime || 'N/A' }}</span>
            </div>
            <div class="debug-item">
                <span class="debug-label">Datos:</span>
                <span class="debug-value">{{ debugInfo.dataSize || 'N/A' }}</span>
            </div>
            <div class="debug-item">
                <span class="debug-label">Usuario logueado:</span>
                <span class="debug-value">{{ isLoggedIn ? '✅ Sí' : '❌ No' }}</span>
            </div>
            <div class="debug-item" v-if="username">
                <span class="debug-label">Usuario:</span>
                <span class="debug-value">{{ username }}</span>
            </div>
            <div class="debug-item" v-if="achievementsData">
                <span class="debug-label">Has User Data:</span>
                <span class="debug-value">{{ achievementsData.hasUserData ? '✅ Sí' : '❌ No' }}</span>
            </div>
            <div class="debug-item" v-if="achievementsData">
                <span class="debug-label">Total logros:</span>
                <span class="debug-value">{{ achievementsData.totalAchievements }}</span>
            </div>
        </div>

        <div v-if="debugInfo.errors.length > 0" class="debug-errors">
            <div class="debug-error-title">❌ Errores:</div>
            <div v-for="(err, index) in debugInfo.errors" :key="index" class="debug-error-item">
                {{ err }}
            </div>
        </div>

        <div v-if="achievementsData" class="debug-raw">
            <details>
                <summary>📄 Ver datos crudos (JSON)</summary>
                <pre>{{ JSON.stringify(achievementsData, null, 2) }}</pre>
            </details>
        </div>
    </div>
</template>

<style scoped>
.debug-section {
    background: #1a1a2a;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    border: 1px solid #2a3f52;
}

.debug-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #2a3f52;
}

.debug-title {
    font-weight: 600;
    color: #66c0f4;
    font-size: 1.1rem;
}

.debug-status {
    padding: 0.3rem 0.8rem;
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 600;
}

.status-loading {
    background: #4a3a1a;
    color: #ffd700;
}

.status-success {
    background: #1b5e20;
    color: #81c784;
}

.status-error {
    background: #4a2a3a;
    color: #ef5350;
}

.debug-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.5rem;
}

.debug-item {
    display: flex;
    flex-direction: column;
    padding: 0.3rem 0;
}

.debug-label {
    font-size: 0.7rem;
    color: #8b9aab;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.debug-value {
    font-size: 0.9rem;
    color: #e0e0e0;
    font-weight: 500;
}

.debug-errors {
    margin-top: 1rem;
    padding: 0.8rem;
    background: #2a1a1a;
    border-radius: 6px;
    border: 1px solid #4a2a2a;
}

.debug-error-title {
    color: #ef5350;
    font-weight: 600;
    margin-bottom: 0.3rem;
}

.debug-error-item {
    color: #ff6b6b;
    font-size: 0.85rem;
    padding: 0.2rem 0;
}

.debug-raw {
    margin-top: 1rem;
}

.debug-raw details {
    cursor: pointer;
}

.debug-raw summary {
    color: #66c0f4;
    font-weight: 500;
}

.debug-raw pre {
    background: #0a0a1a;
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 0.75rem;
    color: #8b9aab;
    margin-top: 0.5rem;
    max-height: 300px;
    overflow-y: auto;
}
</style>