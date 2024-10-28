<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { getBalance } from "$lib/shared/utils";
  import logomark from "/src/logomark.png";
  import wordmark from "/src/wordmark.png";
  import Footer from '../components/Footer.svelte';

  /** @type {number} */
  let balance = 0;

  let search_query = "";

  let isLoading = true; // New variable to track loading state

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

<div class="min-h-screen flex flex-col text-gray-800 relative">
  <!-- Updated Home link -->
  <a href="/" class="home-link">
    <img src={logomark} alt="X-Cashu Search Logo" />
  </a>

  <!-- Top right info -->
  <div class="absolute top-4 right-4 z-10">
    <div class="top-right-info">
      <span class="searches-left"
        >Searches left: <span class="searches-count">{balance}</span></span
      >
      <a href="/topup" class="top-up-button">Top Up</a>
    </div>
  </div>

  <!-- Centered content -->
  <div class="flex-grow flex flex-col justify-center items-center px-4">
    <div class="container mx-auto text-center">
      <img src={wordmark} alt="X-Cashu Search" class="wordmark inline-block" />

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
            <div class="empty-state">
              <h3 class="empty-state-title">Top Up Required</h3>
              <p class="empty-state-description">
                You need to add funds to start searching.
              </p>
              <a href="/topup" class="empty-state-button">Top Up Now</a>
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
              <button class="search-button" on:click={handleSearch}>
                <span class="search-button-text">Search</span>
              </button>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <Footer />
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

  .home-link img {
    height: 40px; /* Adjust this value to match your desired logo size */
    width: auto;
    transition: opacity 0.3s ease;
  }

  .home-link:hover img {
    opacity: 0.8;
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
    background: #ffffff; /* Changed to plain white */
  }
  
  .empty-state {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 32px;
    text-align: center;
    width: 100%;
    max-width: 600px; /* Increased from 400px */
    margin: 0 auto;
  }

  .empty-state-title {
    font-size: 24px; /* Increased from 20px */
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 16px; /* Increased from 8px */
  }

  .empty-state-description {
    font-size: 18px; /* Increased from 16px */
    color: #4a5568;
    margin-bottom: 24px;
  }

  .empty-state-button {
    display: inline-block;
    background-color: #1a1a1a;
    color: white;
    border: none;
    border-radius: 9999px;
    padding: 14px 28px; /* Increased from 12px 24px */
    font-size: 18px; /* Increased from 16px */
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
  }

  .empty-state-button:hover {
    background-color: #2a2a2a;
  }

  .empty-state-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.3);
  }

  /* Add these styles back if they were accidentally removed */
  .wordmark {
    max-width: 400px; /* Adjust this value as needed */
    height: auto;
    margin-bottom: 1rem;
  }

  /* Make sure these important layout styles are preserved */
  .content-container {
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .search-container {
    width: 100%;
    max-width: 32rem;
  }

  .main-heading {
    margin-bottom: 32px;
  }

  .sub-heading {
    margin-bottom: 1.5rem;
  }

  /* Update the wordmark styles */
  .wordmark {
    max-width: 400px;
    height: auto;
    margin-bottom: 1rem;
  }

  /* Add media query for mobile devices */
  @media (max-width: 640px) {
    .wordmark {
      max-width: 280px; /* Smaller width on mobile */
    }

    .sub-heading {
      font-size: 1.25rem; /* Smaller font size on mobile (20px) */
      padding: 0 1rem; /* Add some padding on the sides */
    }
  }
</style>
