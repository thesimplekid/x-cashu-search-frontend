/** @type {import("@cashu/cashu-ts").Proof} */

export function getProofs() {
  const proofs = localStorage.getItem('proofs');
  const parsedProofs = proofs ? JSON.parse(proofs) : [];
  return Array.isArray(parsedProofs) ? parsedProofs : [];
}

export function getBalance() {
  const proofs = getProofs();
  return proofs.reduce((total, proof) => total + proof.amount, 0);
}

/** @type {(proofs: import("@cashu/cashu-ts").Proof[]) => Promise<void>} */
export function writeProofs(proofs) {
  localStorage.setItem('proofs', JSON.stringify(proofs));
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
