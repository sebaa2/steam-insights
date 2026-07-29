<!-- src/components/compare/VsDivider.vue -->
<template>
    <div class="vs-center">
        <div class="vs-circle">
            <span>VS</span>
        </div>
        <div class="vs-line"></div>
    </div>
</template>

<style scoped>
.vs-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 0.5rem;
}

.vs-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #66c0f4, #1a9fff);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: white;
    font-size: 1.2rem;
    box-shadow: 0 4px 20px rgba(102, 192, 244, 0.3);
}

.vs-line {
    flex: 1;
    width: 2px;
    background: linear-gradient(180deg, #66c0f4, transparent);
    min-height: 20px;
}

@media (max-width: 768px) {
    .vs-center {
        flex-direction: row;
        padding: 0.5rem 0;
        width: 100%;
    }

    .vs-line {
        flex: 1;
        height: 2px;
        min-height: 0;
        min-width: 20px;
        background: linear-gradient(90deg, #66c0f4, transparent);
    }
}
</style>