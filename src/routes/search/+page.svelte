<script>
  import { onMount } from "svelte";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { goto } from "$app/navigation";
  import mint_url from "$lib/shared/store/mint_url";
  import {
    addSpentProof,
    getBalance,
    getProofs,
    writeProofs,
  } from "$lib/shared/utils";
  import { getEncodedTokenV4 } from "@cashu/cashu-ts";
  import { page } from "$app/stores";
  import Footer from "../../components/Footer.svelte";
  import { theme } from '$lib/stores/theme';

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

  /**
   * Save search results to session storage
   * @param {Array.<SearchResult>} results
   */
  function saveSearchResults(results) {
    sessionStorage.setItem(
      "searchResults",
      JSON.stringify({
        results,
        timestamp: Date.now(),
        query: search_query,
      }),
    );
  }

  /**
   * Get search results from session storage
   * @returns {{results: Array.<SearchResult>, timestamp: number, query: string} | null}
   */
  function getStoredSearchResults() {
    const stored = sessionStorage.getItem("searchResults");
    return stored ? JSON.parse(stored) : null;
  }

  /** @type {Array.<SearchResult>} */
  let search_results = [];

  let isLoading = false;
  let summary = "";

  let searchTime = "0";

  let searchPerformed = false;

  let isDropdownOpen = false;

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }

  function toggleTheme() {
    theme.update(current => current === 'light' ? 'dark' : 'light');
  }

  onMount(async () => {
    let q = $page.url.searchParams.get("q");
    if (q != null) {
      search_query = q;

      let stored_search_results = getStoredSearchResults();

      if (
        stored_search_results != null &&
        search_query === stored_search_results.query
      ) {
        search_results = stored_search_results.results;
      } else {
        await handleSearch();
      }
    } else {
      alert("Unknown search param");
    }

    balance = getBalance();
  });

  async function handleSearch() {
    searchPerformed = true;
    isLoading = true;
    search_results = [];
    const startTime = Date.now();

    let proofs = getProofs();

    let proof = proofs.pop();

    try {
      /** @type {import("@cashu/cashu-ts").Token} */
      let token = {
        token: [
          {
            mint: $mint_url,
            proofs: [proof],
          },
        ],
        unit: "XSR",
      };

      let encoded_token = getEncodedTokenV4(token);

      let response = await fetch(`${PUBLIC_API_URL}/search?q=${search_query}`, {
        headers: { "X-Cashu": `${encoded_token}` },
      });

      if (!response.ok) {
        // Log the status and the error message for debugging purposes
        console.error(`Error: ${response.status} ${response.statusText}`);
        throw new Error(`Search failed with status ${response.status}`);
      }

      search_results = await response.json();

      /// Add spent proof to store
      addSpentProof(proof);
      // Write the updated proofs back to storage
      writeProofs(proofs);

      console.log("Updated proofs after removing the used one: ", proofs);
      searchTime = ((Date.now() - startTime) / 1000).toFixed(2);
      balance = getBalance();
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
      balance = getBalance();
      saveSearchResults(search_results);
    }
  }

  /**
   * Handles keyboard keyup events and triggers search if Enter key is pressed and balance is positive
   * @param {KeyboardEvent} e - The keyboard event object
   * @returns {Promise<void>}
   */
  async function handleKeyup(e) {
    if (e.key === "Enter" && balance === 0) {
      goto("/topup");
    } else if (e.key === "Enter" && balance > 0) {
      await handleSearch();
    }
  }
</script>

<div
  class="min-h-screen flex flex-col relative gradient-background"
  style="background-color: var(--bg-primary); color: var(--text-primary)"
>
  <header class="p-4 flex items-center" class:search-active={searchPerformed}>
    <div
      class="search-container flex-grow"
      class:search-active={searchPerformed}
    >
      <div class="flex items-center">
        <div class="search-input-wrapper flex-grow mr-2 relative">
          <div class="bg-white dark:bg-[var(--bg-secondary)] p-2 rounded-input-container shadow-md w-full">
            <input
              type="text"
              autocomplete="off"
              placeholder="Ask whatever you want..."
              class="w-full rounded-input border-none focus:outline-none pr-10"
              style="background-color: var(--bg-secondary); color: var(--text-primary);"
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
        <span class="searches-left">
          Searches left: <span class="searches-count">{balance}</span>
        </span>
        <a href="/topup" class="top-up-button">Top Up</a>
        
        <!-- Add theme toggle button -->
        <button class="theme-toggle" on:click={toggleTheme} aria-label="Toggle theme">
          {#if $theme === 'light'}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          {/if}
        </button>
        
        <!-- Add dropdown menu -->
        <div class="dropdown-container">
          <button class="more-options-button" on:click={toggleDropdown}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="2"/>
              <circle cx="12" cy="5" r="2"/>
              <circle cx="12" cy="19" r="2"/>
            </svg>
          </button>
          
          {#if isDropdownOpen}
            <div class="dropdown-menu" on:blur={() => isDropdownOpen = false}>
              <a href="/backup" class="dropdown-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dropdown-icon">
                  <path d="M15 12h-5"/>
                  <path d="M15 8h-5"/>
                  <path d="M19 17V5a2 2 0 0 0-2-2H4"/>
                  <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>
                </svg>
                Back Up
              </a>
              <a href="/recovery" class="dropdown-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dropdown-icon">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
                Recovery
              </a>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>

  <div class="flex-grow flex flex-col relative">
    {#if !isLoading && search_results.length > 0}
      <p class="text-sm mb-4 search-aligned" style="color: var(--text-secondary)">
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
          <p class="text-center text-gray-400">
            No results found. Try a different search query.
          </p>
        {:else}
          <div class="space-y-6">
            {#each search_results as search_result}
              <!-- Search result item -->
              <div class="py-4 border-b" style="border-color: var(--border-color)">
                <h3 class="text-xl mb-2">
                  <a
                    href={search_result.url}
                    class="font-medium underline"
                    style="color: var(--text-primary)"
                  >
                    {search_result.title}
                  </a>
                </h3>
                <p class="text-sm mb-2" style="color: var(--text-secondary)">{search_result.url}</p>
                <p style="color: var(--text-primary)">{search_result.description}</p>
                {#if search_result.age && search_result.age !== "null"}
                  <span
                    class="inline-block mt-2 px-3 py-1 text-sm rounded-full"
                    style="background-color: var(--bg-secondary); color: var(--text-secondary)"
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

  <Footer />
</div>

<style lang="postcss">
  .gradient-background {
    background: white;
    position: relative;
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
    /* background-color: var(--bg-secondary); */
    border-radius: 12px;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    /* border: 1px solid var(--border-color); */
  }

  .searches-left {
    font-weight: 600;
    color: var(--text-secondary);
    /* background-color: var(--bg-primary); */
    padding: 8px;
    border-radius: 8px;
  }

  .searches-count {
    font-size: 1.1em;
    color: var(--text-primary);
  }

  .top-up-button {
    background-color: transparent;
    color: var(--text-secondary);
    border: 2px solid var(--text-secondary);
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .top-up-button:hover {
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    border-color: var(--text-primary);
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
    background-color: var(--bg-primary);
    opacity: 0.8;
    z-index: 1000;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid var(--text-secondary);
    border-top: 4px solid var(--text-primary);
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
    max-width: 60%;
    transition: all 0.3s ease;
  }

  .search-container.search-active {
    max-width: 60%;
  }

  @media (max-width: 1200px) {
    .search-container {
      max-width: 50%; /* Reduce width on medium screens */
    }

    .search-container.search-active {
      max-width: 50%;
    }
  }

  @media (max-width: 982px) {
    .search-container {
      max-width: 45%; /* Further reduce width to prevent clipping */
    }

    .search-container.search-active {
      max-width: 45%;
    }
  }

  @media (max-width: 768px) {
    .search-container {
      order: 2;
      max-width: 100%;
      margin-top: 5rem;
    }

    header {
      padding-top: 2rem;
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }

    .search-container.search-active {
      max-width: 100%;
    }
  }

  .top-right-info {
    transition: all 0.3s ease;
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

  /* Keep the top-right info absolute positioning */
  .absolute.top-4.right-4 {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 10;
  }

  .dropdown-container {
    position: static;
    display: inline-block;
  }

  .more-options-button {
    background: none;
    border: none;
    color: #4a5568;
    padding: 4px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .more-options-button:hover {
    background-color: #f3f4f6;
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 2px);
    right: 0;
    background-color: var(--bg-secondary);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    min-width: 160px;
    z-index: 50;
    border: 1px solid var(--border-color);
    padding: 4px 0;
    margin-top: 4px;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    color: var(--text-secondary);
    text-decoration: none;
    transition: all 0.2s ease;
    font-size: 14px;
  }

  .dropdown-item:hover {
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }

  .dropdown-item:first-child {
    border-radius: 8px 8px 0 0;
  }

  .dropdown-item:last-child {
    border-radius: 0 0 8px 8px;
  }

  .dropdown-icon {
    flex-shrink: 0;
  }

  .dropdown-menu {
    animation: dropdownFade 0.2s ease;
  }

  @keyframes dropdownFade {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Add these new styles */
  .theme-toggle {
    background: none;
    border: none;
    color: #4a5568;
    padding: 4px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .theme-toggle:hover {
    background-color: #f3f4f6;
  }

  /* Dark mode styles */
  :global(.dark) {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --text-primary: #ffffff;
    --text-secondary: #a0aec0;
  }

  :global(.dark) .top-right-info {
    color: var(--text-primary);
  }

  :global(.dark) .searches-left {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
  }

  :global(.dark) .searches-count {
    color: var(--text-primary);
  }

  :global(.dark) .top-up-button {
    color: var(--text-primary);
    border-color: var(--text-primary);
  }

  :global(.dark) .theme-toggle {
    color: var(--text-primary);
  }

  :global(.dark) .theme-toggle:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  :global(.dark) .dropdown-menu {
    background-color: var(--bg-secondary);
    border-color: rgba(255, 255, 255, 0.1);
  }

  :global(.dark) .dropdown-item {
    color: var(--text-primary);
  }

  :global(.dark) .dropdown-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  :global(.dark) .more-options-button {
    color: var(--text-primary);
  }

  :global(.dark) .more-options-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  /* Add dark mode styles */
  :global(.dark) .search-button {
    color: #A0AEC0; /* Update color for dark mode */
  }
</style>
