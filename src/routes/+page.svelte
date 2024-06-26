<script>
  import { onMount } from "svelte";
  import init, { Wallet } from "$lib/pkg";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { goto } from "$app/navigation";
  import seed from "$lib/shared/store/wallet";
  import lock_key from "$lib/shared/store/store";
  import mint_url from "$lib/shared/store/mint_url";
  import cost_per_search from "$lib/shared/store/cost";
  import { refreshBalance } from "$lib/shared/utils";

  /** @type {bigint} */
  let balance = BigInt(0);
  /** @type {Wallet | undefined} */
  let wallet;

  /** @type {bigint | undefined} */
  let search_count;

  let search_query = "";

  onMount(async () => {
    await init();

    wallet = await new Wallet($seed, []);

    await getInfo();

    if ($mint_url != undefined) {
      await wallet.addMint($mint_url);
      await wallet.refreshMint($mint_url);
      balance = await refreshBalance(wallet);
      if ($cost_per_search != undefined) {
        search_count = balance / BigInt($cost_per_search);
      }
    } else {
      alert("Could not get info");
    }
  });

  /**
   * @typedef {Object} InfoResult
   * @property {Array.<string>} trusted_mints
   * @property {AcceptableP2PK} P2PKConditions
   * @property {bigint} sats_per_search
   */

  /**
   * @typedef {Object} AcceptableP2PK
   * @property {Array.<string>} conditions
   * @property {string} data
   */

  async function getInfo() {
    /** @type {InfoResult} */
    let info = await fetch(`${PUBLIC_API_URL}/info`, {}).then((r) => r.json());

    $cost_per_search = info.sats_per_search;
    $lock_key = info.P2PKConditions.data;
    $mint_url = info.trusted_mints[0];
    search_count = balance / BigInt($cost_per_search);
  }

  function handleKeyup(e) {
    if (e.keyCode == 13) {
      let url_encoded = encodeURIComponent(search_query);
      goto(`/search?q=${url_encoded}`);
    }
  }
</script>

<div class="min-h-screen bg-gray-800 text-gray-100">
  <header class="p-4 dark:bg-gray-800 dark:text-gray-900">
    <link
      rel="search"
      type="application/opensearchdescription+xml"
      href="/opensearch.xml"
      title="Cashu Search"
    />
    <div class="container flex justify-end h-16 mx-auto">
      <div class="items-center flex-shrink-0 lg:flex">
        {#if $cost_per_search != undefined && balance != undefined}
          <button
            class="px-8 py-3 font-semibold rounded dark:bg-gray-800 dark:text-gray-100"
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
  </header>

  {#if search_count != undefined && search_count > 0}
    <div class="container flex justify-center h-16 mx-auto my-10">
      <label for="Search" class="hidden">Search</label>
      <input
        type="text"
        autocomplete="off"
        placeholder="Search..."
        class="w-2/3 rounded-lg focus:outline-none bg-gray-600 text-gray-800 focus:bg-gray-500 focus:border-violet-600"
        bind:value={search_query}
        on:keyup={handleKeyup}
      />
    </div>
    <div class="container flex justify-center h-16 mx-auto">
      <a
        href="/search?q={encodeURIComponent(search_query)}"
        class="px-8 py-5 w-1/6 text-center font-semibold rounded dark:bg-purple-800 dark:text-gray-100 hover:bg-purple-500 disabled:bg-gray-500"
      >
        Search
      </a>
    </div>
  {:else}
    <div class="container flex justify-center h-16 mx-auto my-10">
      <h1>Please top up</h1>
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
