<!-- src/components/compare/CompareBar.vue -->
<script setup>
defineProps({
    label: {
        type: String,
        required: true
    },
    leftValue: {
        type: [Number, String],
        required: true
    },
    rightValue: {
        type: [Number, String],
        required: true
    },
    leftLabel: {
        type: String,
        default: ''
    },
    rightLabel: {
        type: String,
        default: ''
    },
    formatDiff: {
        type: Function,
        default: null
    },
    colorLeft: {
        type: String,
        default: '#66c0f4'
    },
    colorRight: {
        type: String,
        default: '#ff6b6b'
    }
})

const getWinner = (left, right) => {
    if (left === right) return 'empate'
    return left > right ? 'left' : 'right'
}

const getDiff = (left, right) => {
    const diff = left - right
    if (diff === 0) return 'Empate'
    return diff > 0 ? `+${Math.abs(diff)}` : `-${Math.abs(diff)}`
}
</script>

<template>
    <div class="comparison-item">
        <span class="comparison-label">{{ label }}</span>
        <div class="comparison-bars">
            <div class="bar-container">
                <div class="bar-left" :style="{
                    width: `${(leftValue / Math.max(leftValue, rightValue)) * 100}%`,
                    backgroundColor: colorLeft
                }">
                    {{ leftLabel || leftValue }}
                </div>
            </div>
            <div class="bar-container">
                <div class="bar-right" :style="{
                    width: `${(rightValue / Math.max(leftValue, rightValue)) * 100}%`,
                    backgroundColor: colorRight
                }">
                    {{ rightLabel || rightValue }}
                </div>
            </div>
        </div>
        <div class="comparison-diff">
            <span class="diff-label">Diferencia:</span>
            <span class="diff-value" :class="{
                'diff-positive': getWinner(leftValue, rightValue) === 'left',
                'diff-negative': getWinner(leftValue, rightValue) === 'right',
                'diff-tie': getWinner(leftValue, rightValue) === 'empate'
            }">
                {{ formatDiff ? formatDiff(leftValue, rightValue) : getDiff(leftValue, rightValue) }}
            </span>
        </div>
    </div>
</template>

<style scoped>
.comparison-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.comparison-label {
    color: var(--steam-text-secondary);
    font-weight: 500;
    font-size: 0.95rem;
}

.comparison-bars {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.bar-container {
    width: 100%;
    height: 32px;
    background: var(--steam-dark);
    border-radius: 6px;
    overflow: hidden;
    position: relative;
}

.bar-left,
.bar-right {
    height: 100%;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 0.75rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: white;
    transition: width 0.5s ease;
    min-width: 40px;
}

.comparison-diff {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
}

.diff-label {
    color: var(--steam-text-secondary);
}

.diff-positive {
    color: #4caf50;
    font-weight: 600;
}

.diff-negative {
    color: #ff6b6b;
    font-weight: 600;
}

.diff-tie {
    color: #ffd93d;
    font-weight: 600;
}

@media (max-width: 480px) {

    .bar-left,
    .bar-right {
        font-size: 0.7rem;
        padding-right: 0.4rem;
    }

    .bar-container {
        height: 26px;
    }
}
</style>