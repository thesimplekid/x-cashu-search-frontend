<script>
  import { goto } from "$app/navigation";
  import seed from "$lib/shared/store/wallet";
  import mint_url from "$lib/shared/store/mint_url";
  import { CashuMint, CashuWallet } from "@cashu/cashu-ts";
  import Footer from "../../components/Footer.svelte";
  import Toast from "../../components/Toast.svelte";
  import { getProofs, writeProofs } from "$lib/shared/utils";
  import { onMount } from "svelte";
  import { theme } from "$lib/stores/theme";

  let words = Array(12).fill("");
  let errorMessage = "";

  /** @type {CashuWallet|null} */
  let wallet = null;

  $: isComplete = words.every((word) => word.trim().length > 0);

  // Initialize wallet instance
  async function initializeWallet() {
    const mint = new CashuMint($mint_url);
    let keysets = await mint.getKeys();
    let matchingKeyset = keysets.keysets.find((key) => key.unit === "xsr");
    wallet = new CashuWallet(mint, {
      unit: "xsr",
      keys: matchingKeyset,
      mnemonicOrSeed: $seed,
    });
    return wallet;
  }

  /**
   * Checks the state of an array of proofs
   * @param {Array<import("@cashu/cashu-ts").Proof>} proofs - Vector of Proof objects to check
   * @returns {Promise<void>}
   */
  async function checkProofState(proofs) {
    if (!wallet) {
      await initializeWallet();
    }

    if (!wallet) {
      throw new Error("Failed to initialize wallet");
    }

    // Get unspent proofs
    let spentProofs = await wallet.checkProofsSpent(proofs);
    // Filter the original proofs array to remove spent ones
    let unspentProofs = proofs.filter(
      (proof) =>
        !spentProofs.some((spentProof) => proof.secret === spentProof.secret),
    );
    console.log("Restored ", unspentProofs.length, " proofs");
    let current_proofs = getProofs();
    // Create combined list with unique proofs based on secret
    const combinedList = [
      ...current_proofs,
      ...unspentProofs.filter(
        (newProof) =>
          !current_proofs.some(
            (existingProof) => existingProof.secret === newProof.secret,
          ),
      ),
    ];

    writeProofs(combinedList);
  }

  async function handleRestore() {
    $seed = words.join(" ");
    let empty_batches = 0;
    let start_counter = 0;
    let end_counter = 99;

    // Initialize wallet once at the start
    if (!wallet) {
      await initializeWallet();
    }

    if (!wallet) {
      throw new Error("Failed to initialize wallet");
    }

    while (empty_batches < 3) {
      console.log("Restoring wallet with words:", words);
      let restores = await wallet.restore(start_counter, end_counter);
      console.log("Received ", restores.proofs.length, " signatures from mint");
      start_counter += 100;
      end_counter += 100;
      if (restores.proofs.length === 0) {
        empty_batches += 1;
      }
      await checkProofState(restores.proofs);
    }
  }

  function goBack() {
    goto("/");
  }

  async function handleRecover() {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const pastedWords = clipboardText.trim().split(/\s+/);

      if (pastedWords.length !== 12) {
        errorMessage = "Please paste exactly 12 words";
        return;
      }

      words = pastedWords;
    } catch (error) {
      errorMessage =
        "Unable to access clipboard. Please grant clipboard permission.";
      console.error("Clipboard error:", error);
    }
  }

  onMount(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    theme.set(savedTheme);
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
  class="min-h-screen flex flex-col text-gray-800 relative gradient-background dark:bg-[var(--bg-primary)]"
>
  <main class="flex-grow flex flex-col justify-start items-center px-4 py-8">
    <div class="header-container">
      <h1 class="text-4xl font-bold mb-2 text-gray-800 main-heading">
        Recovery
      </h1>
      <div class="controls-container">
        <button class="back-button" on:click={goBack}>×</button>
      </div>
    </div>

    <p class="text-xl text-gray-600 dark:text-gray-300 mb-6">
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

    <button class="recovery-button-secondary mb-4" on:click={handleRecover}>
      Paste Recovery Phrase
    </button>

    <button
      class="recovery-button {!isComplete ? 'disabled' : ''}"
      on:click={handleRestore}
      disabled={!isComplete}
    >
      Restore Wallet
    </button>
  </main>

  <Footer />
  <Toast />
</div>

<style>
  .header-container {
    position: relative;
    margin-bottom: 2rem;
    width: 100%;
    max-width: 800px;
    text-align: center;
  }

  .main-heading {
    display: inline-block;
    position: relative;
  }

  .controls-container {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .back-button {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    padding: 0 0.5rem;
    color: var(--text-primary);
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

  .recovery-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #666;
  }

  .recovery-button.disabled:hover {
    background-color: #666;
    box-shadow: 0 2px 4px rgba(26, 26, 26, 0.2);
  }

  .recovery-button.disabled::before {
    display: none;
  }

  .mb-4 {
    margin-bottom: 1rem;
  }

  .recovery-button-secondary {
    background-color: transparent;
    color: #666;
    border: none;
    border-radius: 9999px;
    padding: 16px 32px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    max-width: 300px;
  }

  .recovery-button-secondary:hover {
    color: #1a1a1a;
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

    .recovery-button-secondary {
      width: 80%;
      max-width: 250px;
      padding: 14px 28px;
      font-size: 16px;
    }
  }

  :global(.dark) {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --bg-hover: #3a3a3a;
    --text-primary: #ffffff;
    --text-secondary: #a0aec0;
    --text-hover: #f0f0f0;
    --border-color: #333;
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

  :global(.dark) .recovery-button {
    background-color: #2d2d2d;
  }

  :global(.dark) .recovery-button-secondary {
    color: #a0aec0;
  }

  :global(.dark) .recovery-button-secondary:hover {
    color: #ffffff;
  }

  :global(.dark) .back-button {
    color: #ffffff !important;
  }
</style>
