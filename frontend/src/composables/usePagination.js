import { ref, computed, watch } from 'vue'

export function usePagination(items, itemsPerPage = 20) {
  const currentPage = ref(1)

  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(items.value.length / itemsPerPage))
  })

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage

    return items.value.slice(start, end)
  })

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  watch(items, () => {
    currentPage.value = 1
  })

  return {
    currentPage,

    totalPages,

    paginatedItems,

    nextPage,

    previousPage,

    goToPage,
  }
}
