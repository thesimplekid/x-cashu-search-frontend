<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import cost_per_search from "$lib/shared/store/cost";
  import { getBalance } from "$lib/shared/utils";

  /** @type {number} */
  let balance = 0;

  let search_query = "";

  let isLoading = true; // New variable to track loading state

  let searchButton;

  onMount(async () => {
    balance = await getBalance();
    isLoading = false;
  });

  /**
   * Handles the keyup event for the search input
   * @param {KeyboardEvent} e - The keyboard event object
   */
  function handleKeyup(e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  function handleSearch() {
    if (search_query.trim()) {
      const urlEncoded = encodeURIComponent(search_query);
      goto(`/search?q=${urlEncoded}`);
    }
  }
</script>

<div
  class="min-h-screen flex flex-col text-gray-800 relative gradient-background"
>
  <!-- Home link -->
  <a href="/" class="home-link">X-Cashu Search</a>

  <!-- Top right info -->
  <div class="absolute top-4 right-4 z-10">
    {#if $cost_per_search != undefined && balance != undefined}
      <div class="top-right-info">
        <span class="searches-left"
          >Searches left: <span class="searches-count">{balance}</span></span
        >
        <a href="/topup" class="top-up-button">Top Up</a>
      </div>
    {/if}
  </div>

  <!-- Centered content -->
  <div class="flex-grow flex flex-col justify-center items-center px-4">
    <div class="container mx-auto text-center">
      <h1
        class="inline-block text-5xl font-bold main-heading text-gray-900 relative"
      >
        <!-- Changed from text-purple-700 -->
        <span class="relative z-10">X-Cashu Search</span>
        <span
          class="absolute -bottom-2 left-0 w-full h-3 bg-gray-200 transform -skew-x-12"
        ></span>
        <!-- Changed from bg-purple-200 -->
      </h1>
      <h2 class="text-2xl font-normal text-gray-500 sub-heading">
        Search smarter. Pay in sats for results that matter.
      </h2>

      <div class="content-container">
        <div class="search-container">
          {#if isLoading}
            <div class="spinner-container">
              <div class="spinner"></div>
            </div>
          {:else if balance === undefined || balance <= 0}
            <div class="bg-gray-100 p-4 rounded-lg shadow-md">
              <h3 class="font-semibold mb-2">Top Up Required</h3>
              <p>Please top up to start searching</p>
            </div>
          {:else}
            <div class="flex flex-col items-center space-y-8">
              <div class="search-input-wrapper">
                <div
                  class="bg-white p-2 rounded-input-container shadow-md w-full"
                >
                  <input
                    type="text"
                    autocomplete="off"
                    placeholder="Ask whatever you want..."
                    class="w-full rounded-input border-none focus:outline-none"
                    bind:value={search_query}
                    on:keyup={handleKeyup}
                  />
                </div>
              </div>
              <button
                class="search-button"
                on:click={handleSearch}
                bind:this={searchButton}
              >
                <span class="search-button-text">Search</span>
              </button>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <!-- Updated Footer -->
  <footer class="footer">
    <div class="footer-content">
      <p>
        This is an experimental proof of concept. Do Not Use with sats you're
        not willing to lose.
      </p>
    </div>
  </footer>
</div>

<style>
  /* Add this style block at the end of your component */
  .glow-button {
    background-color: transparent;
    color: #1a1a1a; /* Changed from #8a2be2 */
    border: 2px solid #1a1a1a; /* Changed from #8a2be2 */
    border-radius: 9999px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .glow-button:hover {
    background-color: rgba(
      26,
      26,
      26,
      0.1
    ); /* Changed from rgba(138, 43, 226, 0.1) */
    box-shadow: 0 0 10px rgba(26, 26, 26, 0.3); /* Changed from rgba(138, 43, 226, 0.3) */
  }

  .glow-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.3); /* Changed from rgba(138, 43, 226, 0.3) */
  }

  .rounded-input-container {
    border-radius: 9999px;
    overflow: hidden;
  }

  .rounded-input {
    border-radius: 9999px;
    padding: 10px 16px; /* Reduced vertical padding */
    height: 44px; /* Set a specific height */
  }

  .search-button {
    background-color: #1a1a1a;
    color: white;
    border: none;
    border-radius: 9999px;
    padding: 16px 32px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(26, 26, 26, 0.2); /* Reduced shadow */
    width: 100%;
    max-width: 300px;
    position: relative;
    overflow: hidden;
  }

  .search-button:hover {
    background-color: #2a2a2a;
    box-shadow: 0 4px 8px rgba(26, 26, 26, 0.3); /* Slightly increased shadow on hover */
  }

  .search-button:focus {
    outline: none;
    box-shadow:
      0 0 0 2px rgba(255, 255, 255, 0.5),
      0 4px 8px rgba(26, 26, 26, 0.3);
  }

  .search-button::before {
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

  .search-button:hover::before {
    opacity: 0.5; /* Reduced opacity of the gradient effect */
  }

  .search-button-text {
    position: relative;
    z-index: 1;
  }

  .home-link {
    position: absolute;
    top: 1rem;
    left: 2rem; /* Changed from 1rem to 2rem */
    font-size: 1.25rem;
    font-weight: 600;
    color: #000000; /* Changed from #8a2be2 to black */
    text-decoration: none;
    transition: color 0.3s ease;
    z-index: 10;
  }

  .home-link:hover {
    color: #333333; /* Changed from #9932cc to slightly lighter black */
  }

  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(26, 26, 26, 0.1);
    border-top: 3px solid #1a1a1a;
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

  .content-container {
    height: 150px; /* Reduced from 200px */
    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* Changed from center to flex-start */
    align-items: center;
  }

  .search-container {
    width: 100%;
    max-width: 32rem;
  }

  .search-input-wrapper {
    width: 100%;
  }

  .main-heading {
    margin-bottom: 32px; /* Increased from 0.5rem to 32px */
  }

  .sub-heading {
    margin-bottom: 1.5rem; /* Kept the same */
  }

  /* Add this new style for the searches-left display */
  .searches-left {
    background-color: #f3f4f6;
    padding: 8px;
    border-radius: 8px;
    font-weight: 500;
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
  }

  .searches-count {
    font-size: 1.1em;
    color: #1a1a1a; /* Changed from #8a2be2 */
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

  /* Update these styles at the end of your style block */
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
