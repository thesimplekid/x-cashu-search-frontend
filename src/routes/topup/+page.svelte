<script>
  import { onMount } from "svelte";
  import init, {
    Wallet,
    CurrencyUnit,
    Amount,
    P2PKSpendingConditions,
    Conditions,
  } from "$lib/pkg";
  import SvgQR from "@svelte-put/qr/svg/QR.svelte";
  import { copyToClipboard } from "@svelte-put/copy";
  import { goto } from "$app/navigation";
  import seed from "$lib/shared/store/wallet";
  import lock_key from "$lib/shared/store/store";
  import mint_url from "$lib/shared/store/mint_url";
  import cost_per_search from "$lib/shared/store/cost";
  import { refreshBalance } from "$lib/shared/utils";

  /** @type {Wallet | undefined} */
  let wallet;
  let currency = CurrencyUnit.Sat;

  /** @type {string} */
  let data = "";

  /** @type {bigint} */
  let balance = BigInt(0);

  onMount(async () => {
    await init();

    wallet = await new Wallet($seed);

    if ($mint_url != undefined) {
      await wallet.refreshMint($mint_url);
      await wallet.checkAllPendingProofs($mint_url);
      balance = await refreshBalance(wallet);
    }
  });

  /**
   * @param {number} searches
   */
  async function handleTopUp(searches) {
    if (mint_url != null) {
      const amount = BigInt(searches) * BigInt($cost_per_search);
      let quote = await wallet?.mintQuote($mint_url, BigInt(amount), currency);
      let quote_id = quote?.id;

      let invoice = quote?.request;
      if (invoice != undefined) {
        data = invoice;
      }

      if (quote_id != undefined) {
        let paid = false;
        while (paid == false) {
          let check_mint = await wallet?.mintQuoteStatus($mint_url, quote_id);
          if (check_mint?.paid == true) {
            paid = true;
          } else {
            await new Promise((r) => setTimeout(r, 2000));
          }
        }

        if (paid == true) {
          await wallet?.mint(
            $mint_url,
            quote_id,
            new P2PKSpendingConditions(
              $lock_key,
              new Conditions(
                undefined,
                undefined,
                undefined,
                undefined,
                "sig_inputs",
              ),
            ),
            undefined,
            new Amount(BigInt($cost_per_search)),
          );
        }

        await refreshBalance();
        goto("/");
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
              >{BigInt(balance) / BigInt($cost_per_search)}</button
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
                {#if balance != undefined && $cost_per_search != undefined}
                  <div class="font-light">
                    {BigInt(search_count) * BigInt($cost_per_search)} sats
                  </div>
                {/if}
              </div></button
            >
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
