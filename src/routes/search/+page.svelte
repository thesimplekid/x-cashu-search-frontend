<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { goto } from "$app/navigation";
  import lock_key from "$lib/shared/store/store";
  import mint_url from "$lib/shared/store/mint_url";
  import { getBalance, getProofs, writeProofs } from "$lib/shared/utils";
  import { getEncodedTokenV4 } from "@cashu/cashu-ts";
  import logomark from '/src/logomark.png';
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

  let isLoading = false;
  let summary = "";

  let searchTime = 0;

  let searchPerformed = false;

  onMount(async () => {
    let q = $page.url.searchParams.get("q");
    if (q != null) {
      search_query = q;
    }

    search_query;
    await handleSearch();
    balance = getBalance();
  });

  // Improved summary generation function
  function generateSummary(results) {
    if (results.length === 0) return "";

    // Extract the first sentence from each result's description
    const firstSentences = results.slice(0, 3).map((r) => {
      const firstSentence = r.description.split(".")[0] + ".";
      return firstSentence;
    });

    // Combine the sentences into a summary
    const summary = firstSentences.join(" ");

    return summary;
  }

  async function handleSearch() {
    searchPerformed = true;
    isLoading = true;
    search_results = [];
    const startTime = performance.now();

    let proofs = getProofs();
    console.log(proofs);

    let proof = proofs[0];

    try {
      console.log($mint_url);
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

      let encoded_token = getEncodedTokenV4(token);
      console.log(encoded_token);

      let response = await fetch(`${PUBLIC_API_URL}/search?q=${search_query}`, {
        headers: { "X-Cashu": `${encoded_token}` },
      });

      if (!response.ok) {
        // Log the status and the error message for debugging purposes
        console.error(`Error: ${response.status} ${response.statusText}`);
        throw new Error(`Search failed with status ${response.status}`);
      }

      search_results = await response.json();

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
    } finally {
      isLoading = false;
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
</script>

<div class="min-h-screen flex flex-col text-gray-800 relative gradient-background">
  <!-- Updated Home link -->
  <a href="/" class="home-link">
    <img src={logomark} alt="X-Cashu Search Logo" />
  </a>

  <header class="p-4 flex items-center" class:search-active={searchPerformed}>
    <div
      class="search-container flex-grow"
      class:search-active={searchPerformed}
    >
      <div class="flex items-center">
        <div class="search-input-wrapper flex-grow mr-2 relative">
          <div class="bg-white p-2 rounded-input-container shadow-md w-full">
            <input
              type="text"
              autocomplete="off"
              placeholder="Ask whatever you want..."
              class="w-full rounded-input border-none focus:outline-none pr-10"
              bind:value={search_query}
              on:keyup={handleKeyup}
            />
            <button
              class="search-button absolute right-2 top-1/2 transform -translate-y-1/2"
              on:click={handleSearch}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Top right info -->
  <div class="absolute top-4 right-4 z-10">
    {#if balance != undefined}
      <div class="top-right-info">
        <span class="searches-left"
          >Searches left: <span class="searches-count">{balance}</span></span
        >
        <a href="/topup" class="top-up-button">Top Up</a>
      </div>
    {/if}
  </div>

  <div class="flex-grow flex flex-col relative">
    {#if !isLoading && search_results.length > 0}
      <p class="text-sm text-gray-600 mb-4 search-aligned">
        Found {search_results.length} results in {searchTime} seconds
      </p>

      {#if summary}
        <div class="w-full mb-6 search-aligned">
          <div class="max-w-3xl w-full">
            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="text-lg font-medium mb-3">Nutbrief</h3>
              <p class="text-base text-gray-700 leading-relaxed">{summary}</p>
            </div>
          </div>
        </div>
      {/if}
    {/if}

    <div class="flex flex-col search-aligned">
      <main class="w-full max-w-3xl">
        {#if isLoading}
          <div class="spinner-container">
            <div class="spinner"></div>
          </div>
        {:else if search_results.length === 0}
          <p class="text-center text-gray-600">
            No results found. Try a different search query.
          </p>
        {:else}
          <div class="space-y-6">
            {#each search_results as search_result}
              <!-- Search result item -->
              <div class="py-4 border-b border-gray-200">
                <h3 class="text-xl mb-2">
                  <a
                    href={search_result.url}
                    class="text-black hover:text-black font-medium underline"
                  >
                    {search_result.title}
                  </a>
                </h3>
                <p class="text-sm text-gray-600 mb-2">{search_result.url}</p>
                <p class="text-gray-700">{search_result.description}</p>
                {#if search_result.age && search_result.age !== "null"}
                  <span
                    class="inline-block mt-2 px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full"
                  >
                    {search_result.age}
                  </span>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </main>
    </div>
  </div>

  <footer class="footer">
    <div class="footer-content">
      <p>
        This is an experimental proof of concept. Do Not Use with sats you're
        not willing to lose.
      </p>
    </div>
  </footer>
</div>

<style lang="postcss">
  .gradient-background {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    position: relative;
  }

  .gradient-background::before {
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

  .top-right-info {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .searches-left {
    font-weight: 600;
    color: #4a5568;
    background-color: #f3f4f6;
    padding: 8px;
    border-radius: 8px;
  }

  .searches-count {
    font-size: 1.1em;
    color: #1a1a1a;
  }

  .top-up-button {
    background-color: transparent;
    color: #4a5568;
    border: 2px solid #4a5568;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .top-up-button:hover {
    background-color: #f3f4f6;
    color: #2d3748;
    border-color: #2d3748;
  }

  .top-up-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 85, 104, 0.3);
  }

  .rounded-input-container {
    border-radius: 9999px;
    overflow: hidden;
  }

  .rounded-input {
    border-radius: 9999px;
    padding: 10px 16px;
    height: 44px;
    padding-right: 40px; /* Make room for the search button */
  }

  .search-button {
    background-color: transparent;
    color: #1a1a1a;
    border: none;
    padding: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .search-button:hover {
    color: #4a5568;
  }

  .search-button:focus {
    outline: none;
  }

  .spinner-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 1000;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(26, 26, 26, 0.1);
    border-top: 4px solid #1a1a1a;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Add these new styles */
  header {
    transition: all 0.3s ease;
    padding-left: calc(
      2rem + 160px
    ); /* Adjust based on the width of your home-link */
  }

  header.search-active {
    padding-left: calc(2rem + 160px);
    padding-right: 1rem;
  }

  .search-container {
    max-width: 100%;
    transition: all 0.3s ease;
  }

  .search-container.search-active {
    max-width: 45%;
  }

  @media (max-width: 1024px) {
    .search-container.search-active {
      max-width: 55%;
    }
  }

  @media (max-width: 768px) {
    header.search-active {
      padding-left: 1rem;
    }

    .search-container.search-active {
      max-width: 100%;
    }
  }

  .top-right-info {
    transition: all 0.3s ease;
  }

  .top-right-info.search-active {
    flex-shrink: 0;
  }

  @media (max-width: 1024px) {
    .search-container.search-active {
      max-width: 50%; /* Slightly wider on smaller screens */
    }
  }

  @media (max-width: 768px) {
    header.search-active {
      flex-wrap: wrap;
    }

    .search-container.search-active {
      order: 2;
      max-width: 100%;
      margin-top: 1rem;
    }

    .top-right-info.search-active {
      order: 1;
      margin-left: auto;
    }
  }

  .search-aligned {
    padding-left: calc(1rem + 160px); /* Adjust based on your layout */
    padding-right: 1rem;
    max-width: calc(100% - 300px); /* Adjust based on your layout */
  }

  @media (max-width: 1024px) {
    .search-aligned {
      padding-left: 1rem;
      max-width: 100%;
    }
  }

  /* Add these new styles for the footer */
  .footer {
    background-color: #1a1a1a;
    color: white;
    padding: 16px 0;
    font-weight: 600;
  }

  .footer-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }
</style>
