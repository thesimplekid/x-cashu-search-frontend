<script>
  import { onMount } from "svelte";
  import SvgQR from "@svelte-put/qr/svg/QR.svelte";
  import { copyToClipboard } from "@svelte-put/copy";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { goto } from "$app/navigation";
  import lock_key from "$lib/shared/store/store";
  import mint_url from "$lib/shared/store/mint_url";
  import cost_per_search from "$lib/shared/store/cost";
  import { getBalance, getProofs, writeProofs } from "$lib/shared/utils";
  import { CashuMint, CashuWallet, MintQuoteState } from "@cashu/cashu-ts";

  /** @type {import("@cashu/cashu-ts").AmountPreference} */

  /** @type {string} */
  let data = "";

  /** @type {number} */
  let balance = 0;

  /**
   * @typedef {Object} InfoResult
   * @property {Array.<string>} trusted_mints
   * @property {AcceptableP2PK} P2PKConditions
   * @property {number} sats_per_search
   */

  /**
   * @typedef {Object} AcceptableP2PK
   * @property {Array.<string>} conditions
   * @property {string} data
   */

  async function getInfo() {
    /** @type {InfoResult} */
    let info = await fetch(`${PUBLIC_API_URL}/info`, {}).then((r) => r.json());

    $lock_key = info.P2PKConditions.data;
    $mint_url = info.trusted_mints[0];
  }

  onMount(async () => {
    if ($mint_url != undefined) {
      console.log(typeof $mint_url);
      balance = getBalance();
      await getInfo();
    }
  });

  /**
   * @param {number} searches
   */
  async function handleTopUp(searches) {
    if (mint_url != null && $cost_per_search !== undefined) {
      console.log("Attempting to top up for searches ", searches);
      console.log($mint_url);

      const mint = new CashuMint($mint_url);
      const wallet = new CashuWallet(mint);

      // Create the mint quote

      /** @type {import("@cashu/cashu-ts").MintQuoteResponse} */
      let mintQuote = await wallet.createMintQuote(searches);

      data = mintQuote.request;

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
          const options = {
            preference: [{ amount: 1, count: searches }],
            pubkey: $lock_key,
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

  function home() {
    goto("/");
  }
</script>

<div class="min-h-screen bg-gray-800 text-gray-100">
  <header class="p-4 dark:bg-gray-800 dark:text-gray-900">
    <div class="container flex justify-start h-16 mx-auto">
      <button
        type="button"
        class="bg-purple-800 hover:bg-purple-600 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg px-8 py-5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55"
        on:click={home}
      >
        <svg
          data-v-52a72b4a=""
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="w-10 h-10 fill-gray-300"
        >
          <path
            d="M12.827 3.834a1.5 1.5 0 00-2.26.054L5 10.58V19.5A1.5 1.5 0 006.5 21h1.79a1.5 1.5 0 001.5-1.5v-3.011a1.5 1.5 0 011.5-1.5h1.42a1.5 1.5 0 011.5 1.5V19.5a1.5 1.5 0 001.5 1.5h1.79a1.5 1.5 0 001.5-1.5v-8.92l-6.173-6.746z"
          ></path></svg
        >
      </button>
      <div class="container flex justify-end h-16 mx-auto">
        <div class="items-center">
          {#if $cost_per_search != undefined && balance != undefined}
            <button
              class="px-8 py-5 font-semibold rounded dark:bg-gray-800 dark:text-gray-100"
              >{balance}</button
            >
          {/if}
        </div>
      </div>
    </div>
  </header>
  {#if data != ""}
    <div class="w-full flex justify-center items-center">
      <div>
        <SvgQR {data} width="500" height="500" />
      </div>
      <br />
      <div>
        <button
          type="button"
          class="px-8 py-3 font-semibold rounded dark:bg-purple-800 dark:text-gray-100"
          on:click={() => customCopy(data)}>Copy</button
        >
      </div>
    </div>
  {:else}
    <div class="w-full flex justify-center items-center">
      <div class="w-2/3 content-center grid grid-cols-3 grid-flow-row gap-4">
        {#each [1, 5, 10, 20, 35, 50, 100, 200, 300] as search_count}
          <div>
            <button
              on:click={() => handleTopUp(search_count)}
              disabled={amount_disabled(search_count)}
              class="px-8 py-3 w-full text-center font-semibold rounded dark:bg-purple-800 dark:text-gray-100 hover:bg-purple-500 disabled:bg-gray-500"
            >
              <div>
                <div>{search_count} Searchs</div>
              </div></button
            >
          </div>
        {/each}
      </div>
    </div>
  {/if}
  <footer class="px-4 py-8 fixed bottom-0 w-full">
    <div
      class="container flex flex-wrap justify-center mx-auto space-y-4 sm:justify-between sm:space-y-0"
    >
      <p class="text-center w-full">
        This is an experimental proof of concept. Do Not Use with sats you're
        not willing to lose.
      </p>
    </div>
  </footer>
</div>
