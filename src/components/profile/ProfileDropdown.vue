<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

import ProfileDropdownHeader from './ProfileDropdownHeader.vue'
import ProfileDropdownMenu from './ProfileDropdownMenu.vue'

import { useProfileStore } from '@/stores/profileStore'

const router = useRouter()
const profileStore = useProfileStore()

const open = ref(false)

const dropdown = ref(null)

const profile = computed(() => {

    if (!profileStore.profile) return null

    return {
        avatar: profileStore.profile.avatar,
        name: profileStore.profile.name,
        games: profileStore.profile.totalGames ?? 0,
        hours: Math.round(profileStore.profile.totalHours ?? 0),
        steamId: profileStore.profile.steamId
    }

})

const toggle = () => {

    open.value = !open.value

}

const close = () => {

    open.value = false

}

const clickOutside = (event) => {

    if (
        dropdown.value &&
        !dropdown.value.contains(event.target)
    ) {
        close()
    }

}

onMounted(() => {

    document.addEventListener(
        'click',
        clickOutside
    )

})

onBeforeUnmount(() => {

    document.removeEventListener(
        'click',
        clickOutside
    )

})

const goDashboard = () => {

    router.push('/')

    close()

}

const goLibrary = () => {

    router.push(`/games/${profile.value.steamId}`)

    close()

}

const goAchievements = () => {

    // Lo implementaremos más adelante

    close()

}

const goCompare = () => {

    router.push('/compare')

    close()

}

const changeProfile = () => {

    profileStore.clearProfile()

    router.push('/')

    close()

}

const logout = () => {

    profileStore.clearProfile()

    sessionStorage.clear()

    localStorage.removeItem('steamId')

    router.push('/')

    close()

}
</script>

<template>

    <div class="dropdown" ref="dropdown">

        <button class="profile-button" @click.stop="toggle">

            <img v-if="profile" :src="profile.avatar" class="avatar">

            <span v-if="profile">
                {{ profile.name }}
            </span>

            ▼

        </button>

        <Transition name="dropdown">

            <div v-if="open && profile" class="dropdown-menu">

                <ProfileDropdownHeader :profile="profile" />

                <ProfileDropdownMenu @dashboard="goDashboard" @library="goLibrary" @achievements="goAchievements"
                    @compare="goCompare" @change-profile="changeProfile" @logout="logout" />

            </div>

        </Transition>

    </div>

</template>

<style scoped>
.dropdown {

    position: relative;

}

.profile-button {

    display: flex;

    align-items: center;

    gap: .75rem;

    background: none;

    border: none;

    color: white;

    cursor: pointer;

}

.avatar {

    width: 36px;

    height: 36px;

    border-radius: 50%;

}

.dropdown-menu {

    position: absolute;

    right: 0;

    top: calc(100% + .75rem);

    width: 300px;

    background: #16202d;

    border: 1px solid #2a3f52;

    border-radius: 12px;

    overflow: hidden;

    box-shadow: 0 12px 40px rgba(0, 0, 0, .35);

    z-index: 500;

}

.dropdown-enter-active,
.dropdown-leave-active {

    transition: .2s;

}

.dropdown-enter-from,
.dropdown-leave-to {

    opacity: 0;

    transform: translateY(-8px);

}
</style>