<script>
  import { goto } from "$app/navigation";
  import Footer from "../../components/Footer.svelte";
  import { copyToClipboard } from "@svelte-put/copy";
  import { showToast } from "$lib/stores/toast";
  import Toast from "../../components/Toast.svelte";
  import seed from "$lib/shared/store/wallet";
  import { onMount } from "svelte";
  import { theme } from "$lib/stores/theme";

  // Sample words (these should come from your app's logic later)
  const words = $seed.trim().split(/\s+/);

  function goBack() {
    goto("/");
  }

  function handleCopyPhrase() {
    copyToClipboard($seed);
    showToast("Recovery phrase copied to clipboard.");
  }

  onMount(() => {
    // Get theme from localStorage
    const savedTheme = localStorage.getItem("theme") || "light";
    // Update the theme store
    theme.set(savedTheme);
    // Apply dark mode class if needed
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  });

  // Subscribe to theme changes
  $: if ($theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
</script>

<div
  class="min-h-screen flex flex-col text-gray-800 relative gradient-background"
>
  <main class="flex-grow flex flex-col justify-start items-center px-4 py-8">
    <div class="header-container">
      <button class="back-button" on:click={goBack}>×</button>
      <div class="main-heading-container">
        <h1 class="main-heading">
          Backup
          <div class="heading-underline"></div>
        </h1>
      </div>
    </div>

    <p class="text-xl text-gray-600 mb-6">
      Save your secret recovery phrase in a secure place that only you control.
    </p>

    <div class="seed-container">
      {#each words as word, i}
        <div class="seed-word">
          <span class="word-number">{i + 1}</span>
          <span class="word-text">{word}</span>
          <div class="underline"></div>
        </div>
      {/each}
    </div>

    <button class="copy-button" on:click={handleCopyPhrase}>
      Copy Recovery Phrase
    </button>
  </main>

  <Footer />
  <Toast />
</div>

<style>
  .header-container {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    position: relative;
  }

  .back-button {
    position: absolute;
    left: -40px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-primary, #374151);
    cursor: pointer;
    transition: color 0.3s ease;
    padding: 0;
    line-height: 1;
    z-index: 2;
  }

  .back-button:hover {
    color: var(--text-secondary, #1a1a1a);
  }

  .main-heading-container {
    position: relative;
    width: 100%;
    text-align: center;
  }

  .main-heading {
    position: relative;
    z-index: 1;
    font-size: 3rem;
    font-weight: bold;
    color: var(--text-primary, #1a1a1a);
    display: inline-block;
  }

  .heading-underline {
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 8px;
    background: #f7931a;
  }

  .seed-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    padding: 1rem;
    background: #1a1a1a;
    border-radius: 24px;
    margin-bottom: 2rem;
    width: 100%;
    max-width: 800px;
    background: #1a1a1a;
  }

  .seed-word {
    padding: 0.25rem 0;
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .word-number {
    color: #666;
    font-size: 1.1rem;
    font-weight: 500;
    min-width: 1.5rem;
  }

  .word-text {
    font-size: 1rem;
    color: white;
  }

  .underline {
    position: absolute;
    bottom: 0;
    left: 2.5rem;
    right: 0;
    height: 1px;
    background: var(--border-color, #333);
  }

  .copy-button {
    background-color: transparent;
    color: var(--text-secondary);
    border: none;
    padding: 16px 32px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.3s ease;
    width: auto;
    max-width: none;
  }

  .copy-button:hover {
    color: var(--text-primary);
  }

  .copy-button:focus {
    outline: none;
  }

  @media (max-width: 640px) {
    .seed-container {
      grid-template-columns: repeat(2, 1fr);
      padding: 1rem;
      gap: 0.75rem;
    }

    .seed-word {
      padding: 0.25rem 0;
    }

    .word-number {
      font-size: 0.9rem;
      min-width: 1.2rem;
    }

    .word-text {
      font-size: 1rem;
    }

    .underline {
      left: 2rem;
    }

    .main-heading {
      font-size: 2rem;
    }
  }

  :global(.dark) main {
    background-color: var(--bg-primary);
  }

  :global(.dark) .seed-container {
    background-color: #2d2d2d !important;
  }

  :global(.dark) .word-number {
    color: #a0aec0 !important;
  }

  :global(.dark) .word-text {
    color: #ffffff !important;
  }

  :global(.dark) .main-heading {
    color: #ffffff !important;
  }

  :global(.dark) .copy-button {
    color: #a0aec0 !important;
  }

  :global(.dark) .copy-button:hover {
    color: #ffffff !important;
  }

  :global(.dark) .back-button {
    color: #ffffff !important;
  }
</style>
