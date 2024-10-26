<script>
  import { onMount } from "svelte";
  import SvgQR from "@svelte-put/qr/svg/QR.svelte";
  import { copyToClipboard } from "@svelte-put/copy";
  import bolt11Decoder from "light-bolt11-decoder";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { goto } from "$app/navigation";
  import lock_key from "$lib/shared/store/store";
  import mint_url from "$lib/shared/store/mint_url";
  import cost_per_search from "$lib/shared/store/cost";
  import { getBalance, getProofs, writeProofs } from "$lib/shared/utils";
  import { CashuMint, CashuWallet, MintQuoteState } from "@cashu/cashu-ts";
  import logomark from "/src/logomark.png";

  /** @type {import("@cashu/cashu-ts").AmountPreference} */

  /** @type {string} */
  let data = "";

  /** @type {number} */
  let balance = 0;

  /**
   * @typedef {Object} InfoResult
   * @property {string} mint
   * @property {string} pubkey
   * @property {number} sats_per_search
   */

  /**
   * @typedef {Object} AcceptableP2PK
   * @property {Array.<string>} conditions
   * @property {string} data
   */

  /** @type {number} */
  let selectedSearches = 0;
  /** @type {number} */
  let selectedCost = 0;

  /** @type {number} */
  let invoice_amount = 0;

  async function getInfo() {
    /** @type {InfoResult} */
    let info = await fetch(`${PUBLIC_API_URL}/info`, {}).then((r) => r.json());

    console.log(info);

    $lock_key = info.pubkey;
    $mint_url = info.mint;
  }

  let isLoading = false;

  onMount(async () => {
    if ($mint_url != undefined) {
      console.log(typeof $mint_url);
      balance = getBalance();
      await getInfo();
    }
  });

  /**
   * Extracts the amount in satoshis from a BOLT11 lightning invoice
   * @param {string} invoice - The BOLT11 encoded lightning invoice
   * @returns {number} The amount in satoshis (converted from millisatoshis)
   * @throws {Error} If the invoice cannot be decoded or is invalid
   * @example
   * const invoice = "lnbc...";
   * const sats = getAmountFromInvoice(invoice);
   * // sats = 1000
   */
  export const getAmountFromInvoice = (invoice) => {
    // Decode the invoice
    const decodedInvoice = bolt11Decoder.decode(invoice);
    // Extract the amount from the decoded invoice and convert from msats to sats
    const amount = Number(decodedInvoice.sections[2].value / 1000);
    return Math.ceil(amount);
  };

  /**
   * @param {number} searches
   */
  async function handleTopUp(searches) {
    if (mint_url != null && $cost_per_search !== undefined) {
      console.log("Attempting to top up for searches ", searches);
      console.log($mint_url);

      selectedSearches = searches;

      const mint = new CashuMint($mint_url);
      let keysets = await mint.getKeys();
      let matchingKeyset = keysets.keysets.find((key) => key.unit === "search");
      const wallet = new CashuWallet(mint, {
        unit: "search",
        keys: matchingKeyset,
      });

      // Create the mint quote

      /** @type {import("@cashu/cashu-ts").MintQuoteResponse} */
      let mintQuote = await wallet.createMintQuote(searches);
      isLoading = false; // Hide the spinner once we have the invoice

      data = mintQuote.request;
      invoice_amount = getAmountFromInvoice(data);

      // Polling function to check the mint quote state
      /**
       * Polls the mint quote state until it's paid or maximum attempts are reached
       * @param {string} quote - The mint quote identifier to check
       * @param {number} [interval=3000] - Polling interval in milliseconds
       * @param {number} [maxAttempts=100] - Maximum number of polling attempts
       * @returns {Promise<import("@cashu/cashu-ts").MintQuoteResponse>} The checked mint quote object when paid
       * @throws {Error} If mint quote is not paid within max attempts
       */
      async function pollMintQuote(quote, interval = 3000, maxAttempts = 100) {
        let attempts = 0;

        while (attempts < maxAttempts) {
          const mintQuoteChecked = await wallet.checkMintQuote(quote);
          if (mintQuoteChecked.state === MintQuoteState.PAID) {
            return mintQuoteChecked;
          }
          await new Promise((resolve) => setTimeout(resolve, interval)); // Delay
          attempts++;
        }

        throw new Error("Mint quote not paid within the allowed attempts.");
      }

      try {
        // Poll until the mint quote is paid
        const mintQuoteChecked = await pollMintQuote(mintQuote.quote);

        if (mintQuoteChecked.state === MintQuoteState.PAID) {
          let keys = wallet.keys;
          const options = {
            preference: [{ amount: 1, count: searches }],
            pubkey: $lock_key,
            keysetId: keys.id,
          };

          // Mint the tokens
          const { proofs } = await wallet.mintTokens(
            searches,
            mintQuote.quote,
            options,
          );

          let current_proofs = getProofs();

          const combinedList = [...current_proofs, ...proofs];
          writeProofs(combinedList);
          goto("/");
        }
      } catch (error) {
        console.error("Error while topping up: ", error);
      }
    }
    isLoading = false; // Ensure spinner is hidden if there's an error
  }

  /**
   * @param {number} amount
   */
  function amount_disabled(amount) {
    if (amount > 20) {
      return true;
    }
    return false;
  }

  /**
   * @param {string} text
   */
  export function customCopy(text) {
    copyToClipboard(text);
  }

  function goBack() {
    goto("/");
  }
</script>

<!-- Update the main container div to use the new gradient background -->
<div
  class="min-h-screen flex flex-col text-gray-800 relative gradient-background"
>
  <!-- Updated Home link -->
  <a href="/" class="home-link">
    <img src={logomark} alt="X-Cashu Search Logo" />
  </a>

  <main class="flex-grow flex flex-col justify-start items-center px-4 py-8">
    <div class="header-container">
      <button class="back-button" on:click={goBack}>×</button>
      <div class="main-heading-container">
        <h1 class="main-heading">
          Top Up
          <div class="heading-underline"></div>
        </h1>
      </div>
    </div>

    <div class="text-2xl font-semibold text-gray-900 mt-2 mb-4">
      You have {balance} searches left
    </div>

    <p class="text-xl text-gray-600 mb-6">
      Zap your account with sats to unlock more premium searches.
    </p>

    <div class="qr-container mt-2">
      {#if isLoading}
        <div class="spinner-container">
          <div class="spinner"></div>
        </div>
      {:else if data !== ""}
        <div class="flex flex-col items-center space-y-4">
          <div class="qr-info">
            Purchasing {selectedSearches} searches for {invoice_amount} sats
          </div>
          <div class="bg-[#f3f4f6] p-4 rounded-lg shadow-md">
            <SvgQR {data} width="300" height="300" />
          </div>
          <button
            type="button"
            class="copy-invoice-button"
            on:click={() => customCopy(data)}>Copy Invoice</button
          >
        </div>
      {:else}
        <div class="top-up-grid">
          {#each [1, 5, 10, 20, 35, 50] as search_count}
            <button
              on:click={() => handleTopUp(search_count)}
              disabled={amount_disabled(search_count)}
              class="top-up-button"
              class:disabled={amount_disabled(search_count)}
            >
              <div class="text-lg">{search_count} Searches</div>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </main>

  <!-- Add this horizontal line container above the footer -->
  <div class="horizontal-line-container">
    <div class="fading-line"></div>
  </div>

  <!-- Updated Footer -->
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-left">
        <div class="footer-text">
          <span class="footer-brand-name">Athenut</span>
        </div>
        <p class="footer-description">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
      <div class="footer-right">
        <a href="https://github.com/thesimplekid/x-cashu-search" target="_blank" rel="noopener noreferrer" class="github-link">
          <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" class="github-icon">
            <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
        </a>
      </div>
    </div>
    <!-- Remove the black bar -->
  </footer>
</div>

<style>
  .home-link {
    position: absolute;
    top: 1rem;
    left: 2rem;
    z-index: 10;
  }

  .home-link img {
    height: 40px; /* Adjust this value to match your desired logo size */
    width: auto;
    transition: opacity 0.3s ease;
  }

  .home-link:hover img {
    opacity: 0.8;
  }

  .top-up-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .top-up-button {
    background-color: #f0f2f5; /* Lighter shade, closer to white */
    color: #374151;
    border: none;
    border-radius: 8px;
    padding: 20px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 120px;
  }

  .top-up-button:hover {
    background-color: #e5e7eb; /* Slightly darker on hover, but still light */
  }

  .top-up-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); /* Light blue focus ring */
  }

  .top-up-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .top-up-button.disabled:hover {
    background-color: #e2e4e9; /* Keep the original background color for disabled state */
  }

  .glow-button {
    color: #1a1a1a;
    border: 2px solid #1a1a1a;
    background-color: transparent;
    box-shadow: none;
  }

  .glow-button:hover {
    background-color: rgba(26, 26, 26, 0.1);
    box-shadow: 0 0 10px rgba(26, 26, 26, 0.3);
  }

  .glow-button:focus {
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.3);
  }

  .spinner-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  }

  .spinner-container::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.2;
    mix-blend-mode: soft-light;
    pointer-events: none;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(26, 26, 26, 0.1);
    border-top: 3px solid #1a1a1a;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    position: relative;
    z-index: 1;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

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
    z-index: 2; /* Ensure the button is above other elements */
  }

  .back-button:hover {
    color: #1a1a1a;
  }

  .main-heading-container {
    position: relative;
    width: 100%; /* Ensure the container takes full width */
    text-align: center; /* Center the heading */
  }

  .main-heading {
    position: relative;
    z-index: 1;
    font-size: 3rem;
    font-weight: bold;
    color: #1a1a1a;
    display: inline-block; /* Allow the underline to match the text width */
  }

  .heading-underline {
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 100%;
    height: 12px;
    background-color: #e5e7eb;
    transform: skew(-12deg);
  }

  .copy-invoice-button {
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

  .copy-invoice-button:hover {
    background-color: #2a2a2a;
    box-shadow: 0 4px 8px rgba(26, 26, 26, 0.3);
  }

  .copy-invoice-button:focus {
    outline: none;
    box-shadow:
      0 0 0 2px rgba(255, 255, 255, 0.5),
      0 4px 8px rgba(26, 26, 26, 0.3);
  }

  .copy-invoice-button::before {
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

  .copy-invoice-button:hover::before {
    opacity: 0.5;
  }

  .qr-container {
    min-height: 300px; /* Reduced height */
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* Changed from center to flex-start */
    align-items: center;
    position: relative;
  }

  /* Update these footer styles */
  .footer {
    background-color: #ffffff;
    color: #1a1a1a;
    padding: 32px 0;
    font-weight: 400;
    position: relative;
    margin-top: 0;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0 24px;
  }

  .footer-left {
    max-width: 300px;
  }

  .footer-text {
    margin-bottom: 16px;
  }

  .footer-brand-name {
    font-size: 18px;
    font-weight: 500;
    color: #1a1a1a;
  }

  .footer-description {
    font-size: 14px;
    line-height: 1.5;
    color: #4a5568;
  }

  .footer-right {
    display: flex;
    align-items: center;
  }

  .github-link {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s ease;
  }

  .github-link:hover {
    opacity: 0.7;
  }

  .github-icon {
    fill: #1a1a1a;
  }

  /* Add this new style for the horizontal line */
  .horizontal-line-container {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: auto;
  }

  .fading-line {
    width: 80%;
    max-width: 1000px;
    height: 1px;
    background: linear-gradient(
      to right,
      rgba(229, 231, 235, 0),
      rgba(229, 231, 235, 1) 20%,
      rgba(229, 231, 235, 1) 80%,
      rgba(229, 231, 235, 0)
    );
  }

  .qr-info {
    text-align: center;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: 600;
  }
</style>

