<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { getBalance } from "$lib/shared/utils";
  import wordmark from "/src/wordmark.png";
  import Footer from "../components/Footer.svelte";
  import Navbar from "../components/Navbar.svelte";
  import bgl from "/src/bgl.png";
  import { theme } from "$lib/stores/theme";

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
  <Navbar {balance} />

  <!-- Main content with padding-top -->
  <div class="flex-grow flex flex-col justify-center items-center p-4 min-h-0">
    <div class="container mx-auto text-center relative w-full max-w-4xl px-4">
      <div class="background-image"></div>

      <img src={wordmark} alt="X-Cashu Search" class="wordmark" />

      <h2 class="text-xl md:text-2xl font-normal text-gray-500 mb-8 px-4">
        Search smarter. Pay in sats for results that matter.
      </h2>

      <div class="search-container mx-auto">
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

  <Footer />
</div>

<style>
  /* Base styles */
  .container {
    position: relative;
    width: 100%;
    max-width: 4xl;
    margin: 0 auto;
    overflow: visible;
  }

  .wordmark {
    position: relative;
    width: min(400px, 80vw);
    height: auto;
    margin: 0 auto 1rem;
    z-index: 1;
  }

  .top-right-info {
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    z-index: 20;
    flex-wrap: wrap;
  }

  .searches-left {
    font-weight: 600;
    color: #4a5568;
    background-color: #f3f4f6;
    padding: 8px;
    border-radius: 8px;
    font-size: 16px;
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
    text-decoration: none;
  }

  .top-up-button:hover {
    background-color: #f3f4f6;
    color: #2d3748;
    border-color: #2d3748;
  }

  .search-container {
    width: 100%;
    max-width: min(32rem, 90vw);
    margin: 0 auto;
  }

  /* Mobile adjustments */
  @media (max-width: 640px) {
    .top-right-info {
      font-size: 14px;
      padding: 6px;
    }

    .searches-left {
      font-size: 16px;
    }

    .top-up-button {
      padding: 4px 8px;
      font-size: 12px;
    }

    .home-link {
      top: 0.5rem;
      left: 0.5rem;
    }

    .home-link img {
      height: 30px;
    }
  }

  /* Ensure search input is mobile-friendly */
  .search-input-wrapper {
    width: 100%;
    max-width: min(32rem, 90vw);
    margin: 0 auto;
  }

  .rounded-input {
    width: 100%;
    padding: 8px 16px;
    font-size: 16px; /* Prevent zoom on mobile */
  }

  /* Update button styles for better mobile display */
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
    box-shadow: 0 2px 4px rgba(26, 26, 26, 0.2);
    width: 100%;
    max-width: 300px;
    position: relative;
    overflow: hidden;
  }

  /* Add this media query for mobile devices */
  @media (max-width: 640px) {
    .search-button {
      width: 80%;
      max-width: 250px;
      padding: 14px 28px;
      font-size: 16px;
    }
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
    /* border-radius: 12px; */
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

  .top-up-button,
  .backup-button {
    background-color: transparent;
    color: #4a5568;
    border: 2px solid #4a5568;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
  }

  .top-up-button:hover,
  .backup-button:hover {
    background-color: #f3f4f6;
    color: #2d3748;
    border-color: #2d3748;
  }

  .top-up-button:focus,
  .backup-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 85, 104, 0.3);
  }

  /* Update these styles at the end of your style block */
  .gradient-background {
    background: #ffffff; /* Changed to plain white */
  }

  .empty-state {
    backdrop-filter: blur(8px); /* Add subtle blur for glass effect */
    border: 1px solid rgba(226, 232, 240, 0.6); /* Semi-transparent border */
    border-radius: 12px;
    padding: 32px;
    text-align: center;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }

  .empty-state-title {
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 16px;
  }

  .empty-state-description {
    font-size: 18px;
    color: #4a5568;
    margin-bottom: 24px;
  }

  .empty-state-button {
    display: inline-block;
    background-color: #1a1a1a;
    color: white;
    border: none;
    border-radius: 9999px;
    padding: 14px 28px;
    font-size: 18px;
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

  /* Update the wordmark styles to ensure proper positioning */
  .wordmark {
    position: relative;
    max-width: 400px;
    height: auto;
    margin-bottom: 1rem;
    z-index: 1;
  }

  /* Update the container to support absolute positioning */
  .container {
    position: relative;
  }

  /* Update header-related styles */
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

  /* Adjust main content spacing */
  .container {
    position: relative;
    width: 100%;
    margin-top: 1rem; /* Add some space from the header */
  }

  /* Mobile adjustments */
  @media (max-width: 640px) {
    .home-link {
      top: 0.75rem;
      left: 0.75rem;
    }

    .home-link img {
      height: 32px;
    }

    .container {
      margin-top: 0.5rem;
    }
  }

  /* Update container styles */
  .container {
    position: relative;
    width: 100%;
    max-width: 4xl;
    margin: 0 auto;
    overflow: visible;
  }

  /* Update main wrapper */
  .min-h-screen {
    position: relative;
    overflow-x: hidden; /* Only hide overflow at the root level */
  }

  /* Ensure content stays above the blur */
  .wordmark,
  .search-container,
  .top-right-info {
    position: relative;
    z-index: 1;
  }

  .rounded-input-container {
    border-radius: 9999px; /* Make container fully rounded */
    overflow: hidden; /* Ensure content doesn't overflow rounded corners */
  }

  .rounded-input {
    width: 100%;
    padding: 8px 16px;
    font-size: 16px;
    border-radius: 9999px; /* Make input fully rounded */
  }

  /* Add these new styles */
  .background-image {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    height: 800px;
    background-image: url("/src/bgl.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.5;
    z-index: 0;
    -webkit-mask-image: linear-gradient(
      to right,
      transparent,
      black 20%,
      black 80%,
      transparent
    );
    mask-image: linear-gradient(
      to right,
      transparent,
      black 20%,
      black 80%,
      transparent
    );
  }

  /* Add dark mode background image */
  :global(.dark) .background-image {
    background-image: url("/src/bgld.png");
  }

  /* Ensure the wordmark maintains its position */
  .wordmark {
    position: relative;
    width: min(400px, 80vw);
    height: auto;
    margin: 0 auto 1rem;
    z-index: 1;
  }

  /* Update media query to maintain fade effect on mobile */
  @media (max-width: 640px) {
    .background-image {
      width: 100vw;
      height: 100vw;
      -webkit-mask-image: linear-gradient(
        to right,
        transparent,
        black 10%,
        black 90%,
        transparent
      );
      mask-image: linear-gradient(
        to right,
        transparent,
        black 10%,
        black 90%,
        transparent
      );
    }
  }

  /* Update wordmark z-index if not already set */
  .wordmark {
    position: relative;
    width: min(400px, 80vw);
    height: auto;
    margin: 0 auto 1rem;
    z-index: 1;
  }

  /* Add media query for responsive background */
  @media (max-width: 640px) {
    .background-image {
      width: 100vw;
      height: 100vw;
    }
  }

  /* Add these new styles */
  .dropdown-container {
    position: relative;
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
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .more-options-button:hover {
    background-color: #f3f4f6;
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    color: #4a5568;
    text-decoration: none;
    transition: all 0.2s ease;
    font-size: 14px;
  }

  .dropdown-item:hover {
    background-color: #f3f4f6;
    color: #1a1a1a;
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
    /* Background colors */
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --text-primary: #ffffff;
    --text-secondary: #a0aec0;
  }

  :global(.dark) .min-h-screen {
    background-color: var(--bg-primary);
    color: var(--text-primary);
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

  :global(.dark) .search-button {
    background-color: #2d2d2d;
    color: white;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  :global(.dark) .search-button:hover {
    background-color: #3a3a3a;
    border-color: #f0f0f0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  }

  :global(.dark) .search-button:focus {
    outline: none;
    box-shadow:
      0 0 0 2px #1a1a1a,
      0 0 0 4px rgba(255, 255, 255, 0.5);
  }

  :global(.dark) .search-button::before {
    background: linear-gradient(45deg, #2d2d2d, #3a3a3a, #4a4a4a, #5a5a5a);
  }

  :global(.dark) .rounded-input-container {
    background-color: var(--bg-secondary);
  }

  :global(.dark) .rounded-input {
    background-color: var(--bg-secondary);
    color: var(--text-primary);
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

  /* Update dark mode styles */
  :global(.dark) .more-options-button {
    color: var(--text-primary);
  }

  :global(.dark) .more-options-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  /* Add dark mode styles for empty state */
  :global(.dark) .empty-state {
    border-color: rgba(255, 255, 255, 0.1);
  }

  :global(.dark) .empty-state-title {
    color: #ffffff;
  }

  :global(.dark) .empty-state-description {
    color: #a0aec0;
  }

  :global(.dark) .empty-state-button {
    background-color: #ffffff;
    color: #1a1a1a;
  }

  :global(.dark) .empty-state-button:hover {
    background-color: #f0f0f0;
  }

  /* Add new media query for very small screens */
  @media (max-width: 380px) {
    .top-right-info {
      padding: 4px 8px;
      gap: 8px;
      justify-content: flex-end;
    }

    .searches-left {
      font-size: 14px;
      padding: 6px;
    }

    .top-up-button,
    .theme-toggle,
    .more-options-button {
      padding: 4px;
      font-size: 12px;
    }
  }

  /* Update the main content container */
  .flex-grow {
    position: relative;
    z-index: 1;
  }

  /* Update the header section */
  .h-20 {
    position: relative;
    z-index: 2000;
  }

  /* Update dropdown-container */
  .dropdown-container {
    position: relative;
    display: inline-block;
  }

  /* Update dropdown-menu */
  .dropdown-menu {
    position: fixed;
    top: auto;
    right: 16px;
    margin-top: 12px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    min-width: 160px;
    z-index: 2001;
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 4px 0;
  }
</style>
