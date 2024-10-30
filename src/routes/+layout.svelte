<script>
  import { theme } from '$lib/stores/theme';
  import '$lib/styles/darkMode.css';
  import "../app.css";
  import logomark from "/src/logomark.png";
</script>

<div class="layout-container">
    <a href="/" class="fixed-logo">
        <img src={logomark} alt="X-Cashu Search Logo" />
    </a>
    
    <slot />
</div>

<style>
    .layout-container {
        position: relative;
        min-height: 100vh;
    }

    .fixed-logo {
        position: fixed;
        top: 24px;
        left: 24px;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .fixed-logo img {
        height: 36px;
        width: 36px;
        object-fit: contain;
    }

    @media (max-width: 640px) {
        .fixed-logo {
            top: 16px;
            left: 16px;
        }

        .fixed-logo img {
            height: 32px;
            width: 32px;
        }
    }
</style>
