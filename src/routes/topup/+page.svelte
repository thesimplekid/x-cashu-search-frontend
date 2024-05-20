<script>
  import { onMount } from "svelte";
  import init, { Wallet, CurrencyUnit } from "$lib/pkg";
  import SvgQR from "@svelte-put/qr/svg/QR.svelte";
  import { copyToClipboard } from "@svelte-put/copy";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  // Retrieve user store from context

  /** @type {Wallet | undefined} */
  let wallet;
  let currency = CurrencyUnit.Sat;

  /** @type {string | undefined} */
  let mint_quote_id;

  /** @type {string} */
  let data = "";

  /** @type {bigint} */
  let balance = BigInt(0);

  /** @type {bigint} */
  let cost_per_search;
  /** @type {string | null} */
  let mint_url;

  onMount(async () => {
    await init();

    wallet = await new Wallet();
    let cost = $page.url.searchParams.get("cost_per_search");
    if (cost != null) {
      cost_per_search = BigInt(cost);
    }
    mint_url = $page.url.searchParams.get("mint");

    if (mint_url != null) {
      await wallet.refreshMint(mint_url);
      await refreshBalance();
    }
  });

  async function refreshBalance() {
    if (wallet != undefined) {
      balance = (await wallet.totalBalance()).value;
    }
  }

  /**
   * @param {number} searches
   */
  async function handleTopUp(searches) {
    if (mint_url != null) {
      const amount = BigInt(searches) * cost_per_search;
      let quote = await wallet?.mintQuote(mint_url, BigInt(amount), currency);
      let quote_id = quote?.id;

      let invoice = quote?.request;
      if (invoice != undefined) {
        data = invoice;
      }

      if (quote_id != undefined) {
        let paid = false;
        while (paid == false) {
          let check_mint = await wallet?.mintQuoteStatus(mint_url, quote_id);
          if (check_mint?.paid == true) {
            paid = true;
          } else {
            await new Promise((r) => setTimeout(r, 2000));
          }
        }

        if (paid == true) {
          await wallet?.mint(mint_url, quote_id);
        }

        await refreshBalance();
        mint_quote_id = undefined;
        goto("/");
      }
    }
  }

  /**
   * @param {string} quote_id
   */
  async function mint(quote_id) {
    if (mint_url != null) {
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
</script>

<div class="min-h-screen bg-gray-800 text-gray-100">
  {#if balance != undefined && cost_per_search != undefined}
    <p>Current Balance: {BigInt(balance) / BigInt(cost_per_search)} searches</p>
  {/if}
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

                {#if balance != undefined && cost_per_search != undefined}
                  <div class="font-light">
                    {BigInt(search_count) * BigInt(cost_per_search)} sats
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
