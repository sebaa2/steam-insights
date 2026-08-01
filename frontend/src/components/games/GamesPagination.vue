<script setup>
const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },

    totalPages: {
        type: Number,
        required: true
    }
})

const emit = defineEmits([
    'change-page'
])

const goTo = (page) => {

    if (
        page >= 1 &&
        page <= props.totalPages &&
        page !== props.currentPage
    ) {
        emit('change-page', page)
    }

}
</script>

<template>

    <div v-if="totalPages > 1" class="pagination">

        <button class="page-btn" :disabled="currentPage === 1" @click="goTo(currentPage - 1)">
            ←
        </button>

        <button v-for="page in totalPages" :key="page" class="page-btn" :class="{ active: page === currentPage }"
            @click="goTo(page)">
            {{ page }}
        </button>

        <button class="page-btn" :disabled="currentPage === totalPages" @click="goTo(currentPage + 1)">
            →
        </button>

    </div>

</template>

<style scoped>
.pagination {

    display: flex;

    justify-content: center;

    align-items: center;

    gap: .5rem;

    margin: 2rem 0;

    flex-wrap: wrap;

}

.page-btn {

    width: 40px;

    height: 40px;

    border: none;

    border-radius: 8px;

    background: #1a2a3a;

    color: white;

    cursor: pointer;

    transition: .2s;

}

.page-btn:hover:not(:disabled) {

    background: #66c0f4;

    color: #171a21;

}

.page-btn.active {

    background: #66c0f4;

    color: #171a21;

    font-weight: 700;

}

.page-btn:disabled {

    opacity: .4;

    cursor: not-allowed;

}
</style>