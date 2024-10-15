<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { goto } from "$app/navigation";
  import lock_key from "$lib/shared/store/store";
  import mint_url from "$lib/shared/store/store";
  import { getBalance, getProofs, writeProofs } from "$lib/shared/utils";
  import { getEncodedToken } from "@cashu/cashu-ts";
  /** @type {import("@cashu/cashu-ts").Token} */

  /** @type {number} */
  let balance = getBalance();

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

  onMount(async () => {
    let q = $page.url.searchParams.get("q");
    if (q != null) {
      search_query = q;
    }

    search_query;
    await handleSearch();
    balance = getBalance();
  });

  let attempt_count = 0;

  async function handleSearch() {
    console.log("Attempting search");
    console.log($lock_key);
    search_results = [];

    let proofs = getProofs();
    console.log(proofs);

    let proof = proofs[0];

    if ($lock_key != undefined) {
      try {
        /** @type {import("@cashu/cashu-ts").Token} */
        let token = {
          token: [
            {
              mint: $mint_url,
              proofs: [proof],
            },
          ],
          unit: "search",
        };
        console.log(token);

        let encoded_token = getEncodedToken(token);
        console.log(encoded_token);

        let response = await fetch(
          `${PUBLIC_API_URL}/search?q=${search_query}`,
          {
            headers: { "X-Cashu": `${encoded_token}` },
          },
        );

        if (!response.ok) {
          // Log the status and the error message for debugging purposes
          console.error(`Error: ${response.status} ${response.statusText}`);
          throw new Error(`Search failed with status ${response.status}`);
        }

        search_results = await response.json();
        attempt_count = 0;

        // Remove the first proof from the proofs array
        proofs.shift(); // Removes the first element from the array

        // Write the updated proofs back to storage
        writeProofs(proofs);

        console.log("Updated proofs after removing the used one: ", proofs);
      } catch (error) {
        console.error("Search failed with error: ", error);

        alert("Search failed");

        balance = getBalance();
        if (balance == 0) {
          goto("/topup");
        } else {
          goto("/");
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
   * @property {string} mint
   * @property {number} sats_per_search
   * @property {string} pubkey
   */
  async function getInfo() {
    /** @type {InfoResult} */
    let info = await fetch(`${PUBLIC_API_URL}/info`, {}).then((r) => r.json());

    $lock_key = info.pubkey;
  }

  async function handleKeyup(e) {
    if (e.keyCode == 13 && balance > 0) {
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
          {#if balance > 0}
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
            {#if balance != undefined}
              <button
                class="px-8 py-5 font-semibold rounded dark:bg-gray-800 dark:text-gray-100"
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
