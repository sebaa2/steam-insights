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
import { useCompareFormatters } from '@/composables/useCompareFormatters'
import { useCompareWinner } from '@/composables/useCompareWinner'
import './CompareView.css'
import { useCommonGames } from '@/composables/useCommonGames'
import { useTopGamesComparison } from '@/composables/useTopGamesComparison'
import CompareTopGames from '@/components/compare/CompareTopGames.vue'
import CompareCommonGames from '@/components/compare/CompareCommonGames.vue'

const router = useRouter()
const { formatHoursDiff } = useCompareFormatters()
const { getOverallWinner } = useCompareWinner()

// State
const profileOne = ref('')
const profileTwo = ref('')
const loading = ref(false)
const leftProfile = ref(null)
const rightProfile = ref(null)
const error = ref('')

// Computed
const hasComparison = computed(() => leftProfile.value && rightProfile.value)

const comparisonData = computed(() => {
    if (!hasComparison.value) return null
    const l = leftProfile.value
    const r = rightProfile.value

    return {
        left: {
            name: l.profile.name,
            avatar: l.profile.avatar,
            steamId: l.profile.steamId,
            games: l.library.totalGames,
            hours: l.stats.totalHours,
            averageHours: l.stats.averageHours,
            completion: l.stats.completion,
            neverPlayed: l.stats.neverPlayed
        },
        right: {
            name: r.profile.name,
            avatar: r.profile.avatar,
            steamId: r.profile.steamId,
            games: r.library.totalGames,
            hours: r.stats.totalHours,
            averageHours: r.stats.averageHours,
            completion: r.stats.completion,
            neverPlayed: r.stats.neverPlayed
        }
    }
})

const winnerSummary = computed(() => {
    if (!hasComparison.value) return null
    return getOverallWinner(leftProfile.value, rightProfile.value)
})

const {
    commonGames,
    similarity
} = useCommonGames(
    leftProfile,
    rightProfile
)

const {
    topGames
} = useTopGamesComparison(
    leftProfile,
    rightProfile
)

// Methods
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

// Métricas para las barras
const metrics = computed(() => {
    if (!hasComparison.value) return []
    return [
        { label: 'Total juegos', left: leftProfile.value.library.totalGames, right: rightProfile.value.library.totalGames },
        { label: 'Horas jugadas', left: leftProfile.value.stats.totalHours, right: rightProfile.value.stats.totalHours },
        { label: 'Promedio horas', left: leftProfile.value.stats.averageHours, right: rightProfile.value.stats.averageHours },
        { label: 'Sin jugar', left: leftProfile.value.stats.neverPlayed, right: rightProfile.value.stats.neverPlayed, reversed: true },
        { label: 'Completitud', left: leftProfile.value.stats.completion, right: rightProfile.value.stats.completion }
    ]
})
const topGamesComparison = computed(() => {
    if (!hasComparison.value) return []

    const leftTop = leftProfile.value.stats.topFive || []
    const rightTop = rightProfile.value.stats.topFive || []

    return leftTop.map(leftGame => ({
        left: leftGame,
        right: rightTop.find(game => game.id === leftGame.id) || null
    }))
})
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
            <!-- Banner del ganador -->
            <div v-if="winnerSummary" class="winner-banner" :class="{
                'winner-left': winnerSummary.winner === 'left',
                'winner-right': winnerSummary.winner === 'right',
                'winner-tie': winnerSummary.winner === 'tie'
            }">
                <template v-if="winnerSummary.winner === 'left'">
                    🏆 <strong>{{ winnerSummary.name }}</strong> gana la comparación
                    ({{ winnerSummary.leftWins }} - {{ winnerSummary.rightWins }})
                </template>
                <template v-else-if="winnerSummary.winner === 'right'">
                    🏆 <strong>{{ winnerSummary.name }}</strong> gana la comparación
                    ({{ winnerSummary.rightWins }} - {{ winnerSummary.leftWins }})
                </template>
                <template v-else>
                    🤝 ¡Empate técnico! ({{ winnerSummary.leftWins }} - {{ winnerSummary.rightWins }})
                </template>
            </div>
            <CompareTopGames :games="topGamesComparison" :left-name="comparisonData.left.name"
                :right-name="comparisonData.right.name" />
            <!-- Perfiles -->
            <div class="profile-vs-container">
                <CompareProfileCard :profile="comparisonData.left" side="left" />
                <VsDivider />
                <CompareProfileCard :profile="comparisonData.right" side="right" />
            </div>

            <!-- Comparativa visual -->
            <div class="visual-comparison">
                <h3 class="section-title">📊 Comparativa visual</h3>
                <div class="visual-grid">
                    <CompareBar v-for="metric in metrics" :key="metric.label" :label="metric.label"
                        :leftValue="metric.left" :rightValue="metric.right" :isReversed="metric.reversed || false"
                        colorLeft="#66c0f4" colorRight="#ff6b6b" />
                </div>
            </div>

            <!-- Tabla detallada -->
            <CompareStats v-if="leftProfile && rightProfile" :left="leftProfile" :right="rightProfile" />
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading && !hasComparison" class="empty-state">
            <div class="empty-icon">🎮</div>
            <p class="empty-title">Listo para comparar</p>
            <p class="empty-hint">Ingresa dos perfiles de Steam y haz clic en "Comparar perfiles"</p>
            <p class="empty-hint-small">Puedes usar SteamID, URL personalizada o enlace de perfil</p>
        </div>
        <!--   <CompareCommonGames :games="commonGames" :similarity="similarity" /> -->
    </div>
</template>