/** @type {import("@cashu/cashu-ts").Proof} */

export function getProofs() {
  const proofs = localStorage.getItem('proofs');
  const parsedProofs = proofs ? JSON.parse(proofs) : [];
  return Array.isArray(parsedProofs) ? parsedProofs : [];
}

/** @type {(proofs: import("@cashu/cashu-ts").Proof[]) => Promise<void>} */
export function writeProofs(proofs) {
  localStorage.setItem('proofs', JSON.stringify(proofs));
}


export function getSpentProofs() {
  const proofs = localStorage.getItem('spent_proofs');
  const parsedProofs = proofs ? JSON.parse(proofs) : [];
  return Array.isArray(parsedProofs) ? parsedProofs : [];
}

/**
* @param {string[]} proofs Array of spent proof IDs
*/
export function writeSpentProofs(proofs) {
 localStorage.setItem('spent_proofs', JSON.stringify(proofs));
}

/**
* @param {Proof} proof The proof to add to spent proofs
*/
export function addSpentProof(proof) {
 const proofs = getSpentProofs();
 proofs.push(proof);
 writeSpentProofs(proofs);
}

export function getBalance() {
  const proofs = getProofs();
  return proofs.reduce((total, proof) => total + proof.amount, 0);
}


/**
* @returns {Object.<string, number>} Map of keyset IDs to their counts
*/
export function getKeysetCounts() {
 const counts = localStorage.getItem('keysetCounts');
 const parsedCounts = counts ? JSON.parse(counts) : {};
 return typeof parsedCounts === 'object' ? parsedCounts : {};
}

/**
* @param {Object.<string, number>} counts Map of keyset IDs to their counts
*/
export function setKeysetCounts(counts) {
 localStorage.setItem('keysetCounts', JSON.stringify(counts));
}

/**
* @typedef {Object} MintQuote
* @property {string} id - The quote identifier
* @property {number} amount - The amount in sats
* @property {number} expiry
* @property {string} date - The date the quote was created
* @property {string} mint - The mint URL
* @property {string} invoice - The bolt11 invoice
 * @property {'pending' | 'paid' | 'expired'} state - The current state of the quote
*/

/**
* @returns {MintQuote[]} List of mint quotes
*/
export function getPendingQuotes() {
 const quotes = localStorage.getItem('pendingQuotes');
 const parsedQuotes = quotes ? JSON.parse(quotes) : [];
 return Array.isArray(parsedQuotes) ? parsedQuotes : [];
}

/**
* @param {MintQuote[]} quotes List of mint quotes
*/
export function writePendingQuotes(quotes) {
 localStorage.setItem('pendingQuotes', JSON.stringify(quotes));
}

/** 
 * Updates the state of a pending quote in localStorage
 * @param {string} quoteId - The ID of the quote to update
 * @property {'pending' | 'paid' | 'expired'} state - The current state of the quote
 */
export function updateQuoteState(quoteId, newState) {
    const quotes = getPendingQuotes();
    const updatedQuotes = quotes.map(quote => 
        quote.id === quoteId 
            ? { ...quote, state: newState }
            : quote
    );

    writePendingQuotes(updatedQuotes);
}

/**
* @param {string} id Quote ID to remove
* @returns {void}
*/
export function removePendingQuote(id) {
 const quotes = getPendingQuotes();
 const filteredQuotes = quotes.filter(quote => quote.id !== id);
 writePendingQuotes(filteredQuotes);
}

/**
* @param {MintQuote} quote The quote to add
* @returns {void}
*/
export function addPendingQuote(quote) {
 const quotes = getPendingQuotes();
 quotes.push(quote);
 writePendingQuotes(quotes);
}
