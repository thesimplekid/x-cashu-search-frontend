<script>
  import { theme } from "$lib/stores/theme";
  import Footer from "../../components/Footer.svelte";
  import Navbar from "../../components/Navbar.svelte";

  // FAQ data structure
  const faqs = [
    {
      question: "What is Athenut?",
      answer: "Athenut is a privacy-preserving web search powered by Kagi and Cashu, allowing you to perform premium searches while maintaining your privacy."
    },
    {
      question: "How do searches work?",
      answer: "Each search costs 1 token. You can purchase tokens using Bitcoin Lightning Network payments, and these tokens are stored locally in your browser."
    },
    {
      question: "How do I top up my account?",
      answer: "You can top up your account by visiting the Top Up page, selecting the number of searches you want to purchase, and paying the Lightning invoice that appears."
    },
    {
      question: "Are my searches private?",
      answer: "Yes! Athenut uses Cashu tokens for payments, which are completely private. Your search history is not stored on any servers."
    },
    {
      question: "What happens to unused searches?",
      answer: "Your searches remain in your browser wallet until you use them. They don't expire and are stored locally on your device."
    },
    {
      question: "How do I backup my searches?",
      answer: "Your searches are stored in your browser's local storage. Make sure to backup your wallet seed to preserve your tokens."
    }
  ];

  // Track which questions are expanded
  let expandedQuestions = [];

  function toggleQuestion(index) {
    if (expandedQuestions.includes(index)) {
      expandedQuestions = expandedQuestions.filter(i => i !== index);
    } else {
      expandedQuestions = [...expandedQuestions, index];
    }
  }
</script>

<svelte:head>
  <title>FAQ - Athenut</title>
  <meta name="description" content="Frequently asked questions about Athenut's privacy-preserving web search." />
</svelte:head>

<div class="min-h-screen flex flex-col text-gray-800 relative {$theme === 'dark' ? 'dark-mode' : ''}">
  <Navbar />

  <main class="flex-grow flex flex-col items-center px-4 py-8">
    <div class="w-full max-w-3xl">
      <h1 class="text-4xl font-bold mb-2 text-center">
        Frequently Asked Questions
      </h1>
      
      <p class="text-xl text-gray-600 text-center mb-8">
        Find answers to common questions about using Athenut.
      </p>

      <div class="faq-container">
        {#each faqs as faq, index}
          <div class="faq-item">
            <button
              class="faq-question"
              class:expanded={expandedQuestions.includes(index)}
              on:click={() => toggleQuestion(index)}
            >
              <span>{faq.question}</span>
              <svg
                class="arrow-icon"
                class:rotated={expandedQuestions.includes(index)}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {#if expandedQuestions.includes(index)}
              <div class="faq-answer" transition:slide>
                {faq.answer}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </main>

  <Footer />
</div>

<style>
  .faq-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }

  .faq-item {
    margin-bottom: 1rem;
    border-radius: 12px;
    background-color: #f0f2f5;
    overflow: hidden;
  }

  .faq-question {
    width: 100%;
    padding: 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background: none;
    border: none;
    text-align: left;
    font-weight: 600;
    color: var(--text-primary);
  }

  .faq-answer {
    padding: 0 1.25rem 1.25rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .arrow-icon {
    transition: transform 0.3s ease;
  }

  .arrow-icon.rotated {
    transform: rotate(180deg);
  }

  /* Dark mode styles */
  :global(.dark-mode) .faq-item {
    background-color: #2d2d2d;
  }

  :global(.dark-mode) .faq-question {
    color: #ffffff;
  }

  :global(.dark-mode) .faq-answer {
    color: #a0aec0;
  }

  :global(.dark-mode) .text-gray-600 {
    color: #a0aec0;
  }

  :global(.dark-mode) h1 {
    color: #ffffff;
  }

  /* Mobile responsiveness */
  @media (max-width: 640px) {
    .faq-question {
      padding: 1rem;
      font-size: 0.95rem;
    }

    .faq-answer {
      padding: 0 1rem 1rem;
      font-size: 0.9rem;
    }
  }
</style> 