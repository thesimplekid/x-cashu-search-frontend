<script>
  import { goto } from "$app/navigation";
  import Footer from "../../components/Footer.svelte";
  import Toast from "../../components/Toast.svelte";

  let words = Array(12).fill('');
  let errorMessage = '';

  function goBack() {
    goto("/");
  }

  async function handleRecover() {
    try {
      // Get text from clipboard
      const clipboardText = await navigator.clipboard.readText();
      
      // Split the text by spaces and clean up any extra whitespace
      const pastedWords = clipboardText.trim().split(/\s+/);

      // Validate we have exactly 12 words
      if (pastedWords.length !== 12) {
        errorMessage = 'Please paste exactly 12 words';
        return;
      }

      // Update the words array
      words = pastedWords;
    } catch (error) {
      errorMessage = 'Unable to access clipboard. Please grant clipboard permission.';
      console.error('Clipboard error:', error);
    }
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

    {#if errorMessage}
      <p class="text-red-500 mt-2 text-center">{errorMessage}</p>
    {/if}

    <button 
      class="recovery-button"
      on:click={handleRecover}
    >
      Paste Recovery Phrase
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

  .recovery-button {
    background-color: #1a1a1a;
    color: white;
    border: none;
    border-radius: 9999px;
    padding: 16px 32px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(26, 26, 26, 0.2);
    width: 100%;
    max-width: 300px;
    position: relative;
    overflow: hidden;
  }

  .recovery-button:hover {
    background-color: #2a2a2a;
    box-shadow: 0 4px 8px rgba(26, 26, 26, 0.3);
  }

  .recovery-button:focus {
    outline: none;
    box-shadow:
      0 0 0 2px rgba(255, 255, 255, 0.5),
      0 4px 8px rgba(26, 26, 26, 0.3);
  }

  .recovery-button::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #4285f4, #34a853, #fbbc05, #ea4335);
    z-index: -1;
    filter: blur(5px);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .recovery-button:hover::before {
    opacity: 0.5;
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

    .recovery-button {
      width: 80%;
      max-width: 250px;
      padding: 14px 28px;
      font-size: 16px;
    }
  }
</style> 