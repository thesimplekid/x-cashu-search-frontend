<script>
    import { toast } from '$lib/stores/toast';
</script>

<div class="toast-container" class:visible={$toast.visible}>
    <div class="toast-message">
        {$toast.message}
    </div>
</div>

<style>
    .toast-container {
        position: fixed;
        top: 2rem;
        left: 50%;
        transform: translateX(-50%) translateY(-100%);
        background-color: #F7931A;
        color: #FFFFFF;
        padding: 0.75rem 1.5rem;
        border-radius: 9999px;
        z-index: 50;
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
    }

    .visible {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }

    .toast-message {
        font-size: 0.875rem;
        font-weight: 500;
    }
</style> 