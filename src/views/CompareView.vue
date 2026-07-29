<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import CompareStats from '@/components/compare/CompareStats.vue'
import CompareProfileCard from '@/components/compare/CompareProfileCard.vue'
import VsDivider from '@/components/compare/VsDivider.vue'
import CompareBar from '@/components/compare/CompareBar.vue'
import { getDashboard } from '@/services/steamService'

const router = useRouter()
const profileOne = ref('')
const profileTwo = ref('')
const loading = ref(false)
const leftProfile = ref(null)
const rightProfile = ref(null)
const error = ref('')

const hasComparison = computed(() => leftProfile.value && rightProfile.value)

const comparisonData = computed(() => {
    if (!hasComparison.value) return null
    const l = leftProfile.value
    const r = rightProfile.value
    return {
        left: { name: l.profile.name, avatar: l.profile.avatar, games: l.library.totalGames, hours: l.stats.totalHours, steamId: l.profile.steamId },
        right: { name: r.profile.name, avatar: r.profile.avatar, games: r.library.totalGames, hours: r.stats.totalHours, steamId: r.profile.steamId }
    }
})

const compare = async () => {
    if (!profileOne.value || !profileTwo.value) {
        error.value = 'Por favor ingresa ambos SteamIDs'
        return
    }
    error.value = ''
    loading.value = true
    try {
        const [left, right] = await Promise.all([
            getDashboard(profileOne.value),
            getDashboard(profileTwo.value)
        ])
        leftProfile.value = left
        rightProfile.value = right
    } catch (err) {
        console.error(err)
        error.value = 'Error al cargar los perfiles. Verifica los SteamIDs.'
        leftProfile.value = null
        rightProfile.value = null
    } finally {
        loading.value = false
    }
}

const goBack = () => router.push('/')

// Formateadores
const formatHours = (hours) => {
    if (!hours || hours === 0) return '0'
    if (hours >= 1000) return `${(hours / 1000).toFixed(1)}k`
    if (hours >= 10) return `${Math.round(hours)}`
    return `${Math.round(hours * 10) / 10}`
}

const formatHoursWithUnit = (hours) => {
    if (!hours || hours === 0) return '0h'
    if (hours >= 1000) return `${(hours / 1000).toFixed(1)}k h`
    if (hours >= 10) return `${Math.round(hours)} h`
    return `${Math.round(hours * 10) / 10} h`
}

const formatHoursDiff = (left, right) => {
    const diff = left - right
    if (diff === 0) return 'Empate'
    const absDiff = Math.abs(diff)
    let formatted = absDiff >= 1000 ? `${(absDiff / 1000).toFixed(1)}k` :
        absDiff >= 10 ? `${Math.round(absDiff)}` :
            `${Math.round(absDiff * 10) / 10}`
    return diff > 0 ? `+${formatted} h` : `-${formatted} h`
}
</script>

<template>
    <div class="compare-view">
        <LoadingOverlay :show="loading" message="Cargando perfiles..." />

        <!-- Header -->
        <div class="view-header">
            <button class="back-btn" @click="goBack">← Volver</button>
            <h1>Comparador de perfiles</h1>
            <span class="header-hint">Compara estadísticas entre dos cuentas de Steam</span>
        </div>

        <!-- Inputs -->
        <div class="compare-card">
            <div class="compare-inputs">
                <div class="input-group">
                    <label class="input-label">🎮 Perfil 1</label>
                    <AppInput v-model="profileOne" placeholder="SteamID o URL del Perfil 1" @keyup.enter="compare" />
                </div>
                <div class="vs-badge">VS</div>
                <div class="input-group">
                    <label class="input-label">🎮 Perfil 2</label>
                    <AppInput v-model="profileTwo" placeholder="SteamID o URL del Perfil 2" @keyup.enter="compare" />
                </div>
            </div>
            <div class="compare-actions">
                <AppButton label="Comparar perfiles" :disabled="loading || !profileOne || !profileTwo"
                    @click="compare" />
                <span v-if="loading" class="loading-text">⏳ Cargando...</span>
            </div>
            <div v-if="error" class="error-message">❌ {{ error }}</div>
        </div>

        <!-- Resultados -->
        <div v-if="hasComparison && comparisonData" class="comparison-results">
            <div class="profile-vs-container">
                <CompareProfileCard :profile="comparisonData.left" side="left" />
                <VsDivider />
                <CompareProfileCard :profile="comparisonData.right" side="right" />
            </div>

            <div class="detailed-comparison">
                <h3>📊 Comparación detallada</h3>
                <div class="comparison-grid">
                    <CompareBar label="🎮 Juegos en biblioteca" :left-value="comparisonData.left.games"
                        :right-value="comparisonData.right.games" />
                    <CompareBar label="⏱️ Horas totales" :left-value="comparisonData.left.hours"
                        :right-value="comparisonData.right.hours"
                        :left-label="formatHoursWithUnit(comparisonData.left.hours)"
                        :right-label="formatHoursWithUnit(comparisonData.right.hours)" :format-diff="formatHoursDiff"
                        color-left="#66c0f4" color-right="#ff6b6b" />
                </div>

                <div class="winner-summary">
                    <div class="winner-card" :class="{ tie: comparisonData.left.games === comparisonData.right.games }">
                        <template v-if="comparisonData.left.games > comparisonData.right.games">
                            🏆 <strong>{{ comparisonData.left.name }}</strong> tiene más juegos
                        </template>
                        <template v-else-if="comparisonData.right.games > comparisonData.left.games">
                            🏆 <strong>{{ comparisonData.right.name }}</strong> tiene más juegos
                        </template>
                        <template v-else>🤝 ¡Empate en juegos!</template>
                    </div>
                </div>
            </div>

            <CompareStats v-if="leftProfile && rightProfile" :left="leftProfile" :right="rightProfile" />
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading && !hasComparison" class="empty-state">
            <p class="empty-title">Listo para comparar</p>
            <p class="empty-hint">Ingresa dos perfiles de Steam y haz clic en "Comparar perfiles"</p>
            <p class="empty-hint-small">Puedes usar SteamID, URL personalizada o enlace de perfil</p>
        </div>
    </div>
</template>

<style scoped>
.compare-view {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.view-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--steam-border);
}

.back-btn {
    padding: 0.5rem 1.25rem;
    background: var(--steam-surface);
    color: var(--steam-text);
    border: 1px solid var(--steam-border);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
}

.back-btn:hover {
    background: #2a3f52;
    transform: translateX(-2px);
    border-color: var(--steam-primary);
}

.view-header h1 {
    margin: 0;
    font-size: 1.8rem;
    color: var(--steam-text);
}

.header-hint {
    color: var(--steam-text-secondary);
    font-size: 0.95rem;
}

.compare-card {
    background: var(--steam-surface);
    border-radius: 12px;
    padding: 2rem;
    border: 1px solid var(--steam-border);
}

.compare-inputs {
    display: flex;
    gap: 1rem;
    align-items: flex-end;
    margin-bottom: 1.5rem;
}

.input-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.input-label {
    color: var(--steam-text-secondary);
    font-size: 0.9rem;
    font-weight: 500;
}

.vs-badge {
    font-size: 1.2rem;
    font-weight: 700;
    color: #66c0f4;
    padding: 0 0.5rem;
    align-self: center;
    margin-bottom: 0.25rem;
}

.compare-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.loading-text {
    color: var(--steam-text-secondary);
    font-size: 0.9rem;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.error-message {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    background: rgba(220, 53, 69, 0.15);
    border: 1px solid #dc3545;
    border-radius: 8px;
    color: #ff6b6b;
}

.comparison-results {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.profile-vs-container {
    display: flex;
    align-items: stretch;
    gap: 1rem;
    background: var(--steam-surface);
    border-radius: 12px;
    padding: 2rem;
    border: 1px solid var(--steam-border);
}

.detailed-comparison {
    background: var(--steam-surface);
    border-radius: 12px;
    padding: 2rem;
    border: 1px solid var(--steam-border);
}

.detailed-comparison h3 {
    margin: 0 0 1.5rem 0;
    color: var(--steam-text);
}

.comparison-grid {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.winner-summary {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--steam-border);
}

.winner-card {
    padding: 1rem 1.5rem;
    background: rgba(102, 192, 244, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(102, 192, 244, 0.2);
    text-align: center;
    color: var(--steam-text);
}

.winner-card.tie {
    background: rgba(255, 217, 61, 0.1);
    border-color: rgba(255, 217, 61, 0.2);
}

.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: var(--steam-surface);
    border-radius: 12px;
    border: 1px dashed var(--steam-border);
}

.empty-title {
    color: var(--steam-text);
    font-size: 1.3rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
}

.empty-hint {
    color: var(--steam-text-secondary);
    font-size: 1rem;
    margin: 0;
}

.empty-hint-small {
    color: var(--steam-text-secondary);
    font-size: 0.85rem;
    margin: 0.5rem 0 0 0;
    opacity: 0.7;
}

@media (max-width: 768px) {
    .compare-inputs {
        flex-direction: column;
        align-items: stretch;
    }

    .vs-badge {
        align-self: center;
        padding: 0.5rem 0;
    }

    .profile-vs-container {
        flex-direction: column;
        align-items: center;
        padding: 1.5rem;
    }

    .profile-card-compare {
        width: 100%;
        max-width: 300px;
    }

    .view-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .header-hint {
        font-size: 0.85rem;
    }
}

@media (max-width: 480px) {
    .compare-card {
        padding: 1rem;
    }

    .detailed-comparison {
        padding: 1rem;
    }
}
</style>