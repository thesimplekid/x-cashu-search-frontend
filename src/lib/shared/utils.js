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
