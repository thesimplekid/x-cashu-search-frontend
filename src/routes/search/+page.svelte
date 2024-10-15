<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import init, {
    Wallet,
    CurrencyUnit,
    P2PKSpendingConditions,
    Conditions,
  } from "$lib/pkg";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { goto } from "$app/navigation";
  import seed from "$lib/shared/store/wallet";
  import lock_key from "$lib/shared/store/store";
  import mint_url from "$lib/shared/store/mint_url";
  import cost_per_search from "$lib/shared/store/cost";

  /** @type {Wallet | undefined} */
  let wallet;
  let balance = BigInt(100);
  /** @type {bigint | undefined} */
  let search_count = balance / BigInt($cost_per_search);

  let search_query = "";

  /**
   * @typedef {Object} SearchResult
   * @property {string} title
   * @property {string} url
   * @property {string} description
   * @property {string} age
   */

  /** @type {Array.<SearchResult>} */
  let search_results = [];

  let currency = CurrencyUnit.Sat;
  onMount(async () => {
    await init();

    wallet = await new Wallet($seed, []);

    let q = $page.url.searchParams.get("q");
    if (q != null) {
      search_query = q;
    }

    search_query;
    await handleSearch();
    // await refreshBalance();
  });

  async function refreshBalance() {
    if (wallet != undefined) {
      balance = (await wallet.unitBalance(CurrencyUnit.Sat)).value;
      search_count = balance / BigInt($cost_per_search);
    }
  }
  let attempt_count = 0;

  async function handleSearch() {
    search_results = [];

    let conditions = new Conditions(
      undefined,
      null,
      null,
      undefined,
      "sig_inputs",
    );

    if (
      $mint_url != undefined &&
      $lock_key != undefined &&
      cost_per_search != null
    ) {
      try {
        let spending_condition = new P2PKSpendingConditions(
          $lock_key,
          conditions,
        );
        let token = await wallet?.send(
          $mint_url,
          currency,
          undefined,
          BigInt($cost_per_search),
          spending_condition,
          undefined,
        );

        search_results = await fetch(
          `${PUBLIC_API_URL}/search?q=${search_query}`,
          {
            headers: { "X-Cashu": `${token}` },
          },
        ).then((r) => r.json());

        await refreshBalance();
        attempt_count = 0;
      } catch {
        if (balance == BigInt(0)) {
          await refreshBalance();
          goto("/topup");
        } else {
          alert("Server error");
        }
      }
    } else {
      if (attempt_count < 5) {
        await getInfo();
        await handleSearch();
        attempt_count += 1;
      }
    }
  }

  /**
   * @typedef {Object} InfoResult
   * @property {Array.<string>} trusted_mints
   * @property {object} acceptable_p2pk_conditions:
   * @property {bigint} sats_per_search
   * @property {string} pubkey
   */
  async function getInfo() {
    /** @type {InfoResult} */
    let info = await fetch(`${PUBLIC_API_URL}/info`, {}).then((r) => r.json());

    $cost_per_search = info.sats_per_search;
    $lock_key = info.pubkey;
    $mint_url = info.trusted_mints[0];
    search_count = balance / BigInt($cost_per_search);
  }

  async function handleKeyup(e) {
    if (e.keyCode == 13 && search_count != undefined && search_count > 0) {
      await handleSearch();
    }
  }

  function home() {
    goto("/");
  }
</script>

<div class="min-h-screen bg-gray-800 text-gray-100">
  {#if search_results.length === 0}
    <div class="container flex justify-center h-16 mx-auto bg-gray-800">
      <div
        class="w-16 h-16 border-4 border-dashed rounded-full animate-spin dark:border-violet-600"
      ></div>
    </div>
  {:else}
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
        <div class="container flex justify-center h-16 mx-auto">
          {#if search_count != undefined && search_count > 0}
            <label for="Search" class="hidden">Search</label>
            <input
              type="text"
              autocomplete="off"
              placeholder="Search..."
              class="w-2/3 rounded-lg focus:outline-none bg-gray-600 text-gray-800 focus:bg-gray-500 focus:border-violet-600"
              bind:value={search_query}
              on:keyup={handleKeyup}
            />

            <a
              href="/search?q={search_query}"
              on:click={handleSearch}
              class="px-8 py-5 font-semibold rounded-lg bg-purple-800 hover:bg-purple-600 text-gray-100 text-center"
              >Go
            </a>
          {/if}
        </div>
        <div class="container flex justify-end h-16 mx-auto">
          <div class="items-center">
            {#if $cost_per_search != undefined && balance != undefined}
              <button
                class="px-8 py-5 font-semibold rounded dark:bg-gray-800 dark:text-gray-100"
                >{search_count}</button
              >
            {/if}
            <a
              href="/topup"
              class="px-8 py-5 text-center font-semibold rounded dark:bg-purple-800 dark:text-gray-100 hover:bg-purple-500 disabled:bg-gray-500"
              >Top Up</a
            >
          </div>
        </div>
      </div>
    </header>
    <div class="container flex flex-col mx-auto">
      {#each search_results as search_result}
        <div class="container flex flex-col my-3">
          <h3
            class="text-xl text-bold text-purple-500 hover:text-purple-400 hover:underline"
          >
            <a href={search_result.url} class="text-bold"
              >{search_result.title}</a
            >
          </h3>
          <p class="text-sm font-light text-white">{search_result.url}</p>
          <p class="text-lg">{search_result.description}</p>
        </div>
      {/each}
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
