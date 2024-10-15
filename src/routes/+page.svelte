<script>
  import { onMount } from "svelte";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { goto } from "$app/navigation";
  import lock_key from "$lib/shared/store/store";
  import mint_url from "$lib/shared/store/store";
  import cost_per_search from "$lib/shared/store/cost";
  import { getBalance } from "$lib/shared/utils";

  /** @type {number} */
  let balance = 0;

  let search_query = "";

  onMount(async () => {
    balance = await getBalance();
    await getInfo();
  });

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
            >{balance}</button
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

  {#if balance > 0}
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
