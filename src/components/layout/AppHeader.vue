<template>
    <header class="header">
        <div class="header-content">
            <router-link to="/" class="logo">
                <span class="logo-icon">🎮</span>
                <span class="logo-text">Steam Insights</span>
            </router-link>

        </div>
    </header>
</template>

<style scoped>
.header {
    background: linear-gradient(135deg, #1a2a3a 0%, #0d1b2a 100%);
    border-bottom: 2px solid #1a9fff33;
    padding: 0 2rem;
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    transition: transform 0.2s ease;
}

.logo:hover {
    transform: scale(1.05);
}

.logo-icon {
    font-size: 2rem;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-4px);
    }
}

.logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #66c0f4, #1a9fff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
}

.nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
}

.nav-link {
    color: var(--steam-text-secondary);
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.3s ease;
    padding: 0.5rem 0;
    position: relative;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #66c0f4, #1a9fff);
    transition: width 0.3s ease;
}

.nav-link:hover {
    color: var(--steam-text);
}

.nav-link:hover::after {
    width: 100%;
}

.nav-link.router-link-active {
    color: #66c0f4;
}

.nav-link.router-link-active::after {
    width: 100%;
}

/* Responsive */
@media (max-width: 600px) {
    .header {
        padding: 0 1rem;
    }

    .header-content {
        height: 60px;
    }

    .logo-text {
        font-size: 1.2rem;
    }

    .logo-icon {
        font-size: 1.5rem;
    }

    .nav-link {
        font-size: 0.85rem;
    }
}

@media (max-width: 400px) {
    .logo-text {
        font-size: 1rem;
    }

    .logo-icon {
        font-size: 1.3rem;
    }
}
</style>