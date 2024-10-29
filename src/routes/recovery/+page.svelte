<script>
  import { goto } from "$app/navigation";
  import Footer from "../../components/Footer.svelte";
  import Toast from "../../components/Toast.svelte";

  let words = Array(12).fill('');

  function goBack() {
    goto("/");
  }

  function handleRecover() {
    // Functionality to be implemented later
    console.log('Recovery words:', words);
  }
</script>

<div class="min-h-screen flex flex-col text-gray-800 relative gradient-background">
  <main class="flex-grow flex flex-col justify-start items-center px-4 py-8">
    <div class="header-container">
      <button class="back-button" on:click={goBack}>×</button>
      <div class="main-heading-container">
        <h1 class="main-heading">
          Recovery
          <div class="heading-underline"></div>
        </h1>
      </div>
    </div>

    <p class="text-xl text-gray-600 mb-6">
      Enter your 12-word recovery phrase to restore your searches.
    </p>

    <div class="seed-container">
      {#each words as word, i}
        <div class="seed-word">
          <span class="word-number">{i + 1}</span>
          <input
            type="text"
            class="word-text"
            bind:value={words[i]}
            placeholder="Enter word"
          />
          <div class="underline"></div>
        </div>
      {/each}
    </div>

    <button 
      class="copy-button"
      on:click={handleRecover}
    >
      Recover Wallet
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
    color: #374151;
    cursor: pointer;
    transition: color 0.3s ease;
    padding: 0;
    line-height: 1;
    z-index: 2;
  }

  .back-button:hover {
    color: #1a1a1a;
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
    color: #1a1a1a;
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
    gap: 1.5rem;
    padding: 2rem;
    background: #1a1a1a;
    border-radius: 24px;
    margin-bottom: 2rem;
    width: 100%;
    max-width: 800px;
  }

  .seed-word {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0;
  }

  .word-number {
    color: #666;
    font-size: 1.1rem;
    font-weight: 500;
    min-width: 1.5rem;
  }

  .word-text {
    color: white;
    font-size: 1.2rem;
    font-weight: 500;
    background: transparent;
    border: none;
    width: 100%;
  }

  .word-text:focus {
    outline: none;
  }

  .word-text::placeholder {
    color: #666;
    opacity: 0.5;
  }

  .underline {
    position: absolute;
    bottom: 0;
    left: 2.5rem;
    right: 0;
    height: 1px;
    background: #333;
  }

  .copy-button {
    background-color: transparent;
    color: #4a5568;
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
    color: #2d3748;
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
</style> 