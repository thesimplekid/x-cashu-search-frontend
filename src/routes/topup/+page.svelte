<script>
  import { onMount } from "svelte";
  import SvgQR from "@svelte-put/qr/svg/QR.svelte";
  import { copyToClipboard } from "@svelte-put/copy";
  import bolt11Decoder from "light-bolt11-decoder";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { goto } from "$app/navigation";
  import mint_url from "$lib/shared/store/mint_url";
  import {
    addPendingQuote,
    getBalance,
    getKeysetCounts,
    getPendingQuotes,
    getProofs,
    removePendingQuote,
    setKeysetCounts,
    writePendingQuotes,
    writeProofs,
  } from "$lib/shared/utils";
  import { CashuMint, CashuWallet, MintQuoteState } from "@cashu/cashu-ts";
  import Footer from "../../components/Footer.svelte";
  import { showToast } from "$lib/stores/toast";
  import Toast from "../../components/Toast.svelte";
  import seed from "$lib/shared/store/wallet";

  /** @type {import("@cashu/cashu-ts").AmountPreference} */

  /** @type {string} */
  let data = "";

  /** @type {number} */
  let balance = 0;

  /**
   * @typedef {Object} InfoResult
   * @property {string} mint
   */

  /** @type {number} */
  let selectedSearches = 0;

  /** @type {number} */
  let invoice_amount = 0;

  async function getInfo() {
    /** @type {InfoResult} */
    let info = await fetch(`${PUBLIC_API_URL}/info`, {}).then((r) => r.json());

    $mint_url = info.mint;
  }

  let isLoading = false;

  onMount(async () => {
    if ($mint_url != undefined) {
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
    if (mint_url != null) {
      console.log("Attempting to top up for searches ", searches);

      selectedSearches = searches;

      const mint = new CashuMint($mint_url);
      let keysets = await mint.getKeys();
      let matchingKeyset = keysets.keysets.find((key) => key.unit === "xsr");

      const wallet = new CashuWallet(mint, {
        unit: "xsr",
        keys: matchingKeyset,
        mnemonicOrSeed: $seed,
      });

      // Create the mint quote

      /** @type {import("@cashu/cashu-ts").MintQuoteResponse} */
      let mintQuote = await wallet.createMintQuote(searches);
      isLoading = false; // Hide the spinner once we have the invoice

      const quote = {
        id: mintQuote.quote,
        amount: searches,
        date: new Date().toISOString(),
        mint: $mint_url,
        expiry: mintQuote.expiry,
        invoice: mintQuote.request,
      };

      addPendingQuote(quote);

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

          let keyset_counts = getKeysetCounts();

          let keyset_count = keyset_counts[keys.id] || 0;

          const options = {
            preference: [{ amount: 1, count: searches }],
            keysetId: keys.id,
            counter: keyset_count,
          };

          // Mint the tokens
          const { proofs } = await wallet.mintTokens(
            searches,
            mintQuote.quote,
            options,
          );

          let new_count = keyset_count + proofs.length;

          keyset_counts[keys.id] = new_count;

          setKeysetCounts(keyset_counts);

          let current_proofs = getProofs();

          const combinedList = [...current_proofs, ...proofs];
          writeProofs(combinedList);
          removePendingQuote(mintQuote.quote);
          goto("/");
        }
      } catch (error) {
        console.error("Error while topping up: ", error);
      }
    }
    isLoading = false; // Ensure spinner is hidden if there's an error
  }

  /**
   * @param {string} text
   */
  export function customCopy(text) {
    copyToClipboard(text);
    showToast("Invoice copied to clipboard.");
  }

  function goBack() {
    goto("/");
  }
</script>

<!-- Update the main container div to use the new gradient background -->
<div
  class="min-h-screen flex flex-col text-gray-800 relative gradient-background"
>
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
              class="top-up-button"
            >
              <div class="text-lg">{search_count} Searches</div>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </main>

  <Footer />
  <Toast />
</div>

<style>
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
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 8px;
    background: #f7931a;
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

  .qr-info {
    text-align: center;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: 600;
  }
</style>
