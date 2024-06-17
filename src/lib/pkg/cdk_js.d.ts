/* tslint:disable */
/* eslint-disable */
/**
*/
export function start(): void;
/**
*/
export enum State {
  Spent = 0,
  Unspent = 1,
  Pending = 2,
  Reserved = 3,
}
/**
*/
export enum Kind {
  P2PK = 0,
  HTLC = 1,
}
/**
*/
export enum CurrencyUnit {
  Sat = 0,
  Msat = 1,
  Usd = 2,
}
/**
*/
export class Amount {
  free(): void;
/**
* @param {bigint} sats
*/
  constructor(sats: bigint);
/**
* Split amount returns sat vec of sats
* @returns {any}
*/
  split(): any;
/**
*/
  readonly value: bigint;
}
/**
*/
export class BlindSignature {
  free(): void;
/**
* @param {Id} keyset_id
* @param {Amount} amount
* @param {PublicKey} c
* @param {BlindSignatureDleq | undefined} [dleq]
*/
  constructor(keyset_id: Id, amount: Amount, c: PublicKey, dleq?: BlindSignatureDleq);
}
/**
*/
export class BlindSignatureDleq {
  free(): void;
}
/**
*/
export class BlindedMessage {
  free(): void;
/**
* @param {Id} keyset_id
* @param {Amount} amount
* @param {PublicKey} blinded_secret
* @param {Witness | undefined} [witness]
*/
  constructor(keyset_id: Id, amount: Amount, blinded_secret: PublicKey, witness?: Witness);
/**
* Amount
*/
  readonly amount: Amount;
/**
* Blinded Secret
*/
  readonly blinded_secret: PublicKey;
/**
* Keyset Id
*/
  readonly keyset_id: Id;
/**
* Witness
*/
  readonly witness: Witness | undefined;
}
/**
*/
export class CheckStateRequest {
  free(): void;
}
/**
*/
export class CheckStateResponse {
  free(): void;
}
/**
*/
export class Conditions {
  free(): void;
/**
* @param {bigint | undefined} locktime
* @param {any} pubkeys
* @param {any} refund_key
* @param {bigint | undefined} num_sigs
* @param {string} sig_flag
*/
  constructor(locktime: bigint | undefined, pubkeys: any, refund_key: any, num_sigs: bigint | undefined, sig_flag: string);
/**
*/
  readonly locktime: bigint | undefined;
/**
*/
  readonly num_sigs: bigint | undefined;
/**
*/
  readonly pubkeys: any;
/**
*/
  readonly refund_keys: any;
/**
*/
  readonly sig_flag: string;
}
/**
*/
export class HTLCSpendingConditions {
  free(): void;
/**
* @param {string} preimage
* @param {Conditions} conditions
*/
  constructor(preimage: string, conditions: Conditions);
}
/**
*/
export class HTLCWitness {
  free(): void;
}
/**
*/
export class Id {
  free(): void;
/**
* Try From Base 64 String
* @param {string} id
* @returns {Id}
*/
  static tryFromBase64(id: string): Id;
/**
* As String
* @returns {string}
*/
  asString(): string;
}
/**
*/
export class KeySet {
  free(): void;
}
/**
*/
export class KeySetsResponse {
  free(): void;
/**
* @param {any} keysets
*/
  constructor(keysets: any);
/**
* Get KeySets
*/
  readonly keys: any;
}
/**
*/
export class Keys {
  free(): void;
/**
* From Hex
* @param {any} keys
*/
  constructor(keys: any);
/**
* Keys
* @returns {any}
*/
  keys(): any;
/**
* Amount Key
* @param {Amount} amount
* @returns {PublicKey | undefined}
*/
  amountKey(amount: Amount): PublicKey | undefined;
}
/**
*/
export class KeysResponse {
  free(): void;
/**
* @param {any} keysets
*/
  constructor(keysets: any);
/**
* Get Keys
*/
  readonly keysets: any;
}
/**
*/
export class MeltBolt11Request {
  free(): void;
}
/**
*/
export class MeltMethodSettings {
  free(): void;
}
/**
*/
export class MeltQuote {
  free(): void;
/**
*/
  readonly amount: Amount;
/**
*/
  readonly expiry: bigint;
/**
*/
  readonly fee_reserve: Amount;
/**
*/
  readonly id: string;
/**
*/
  readonly paid: boolean;
/**
*/
  readonly request: string;
/**
*/
  readonly unit: CurrencyUnit;
}
/**
*/
export class MeltQuoteBolt11Request {
  free(): void;
}
/**
*/
export class MeltQuoteBolt11Response {
  free(): void;
}
/**
*/
export class Melted {
  free(): void;
/**
*/
  readonly change: any;
/**
*/
  readonly paid: boolean;
/**
*/
  readonly preimage: string | undefined;
}
/**
*/
export class MintBolt11Request {
  free(): void;
/**
* Try From Base 64 String
* @param {string} quote
* @param {any} outputs
*/
  constructor(quote: string, outputs: any);
/**
* @returns {Amount}
*/
  totalAmount(): Amount;
/**
*/
  readonly outputs: any;
}
/**
*/
export class MintInfo {
  free(): void;
/**
* @param {string | undefined} name
* @param {PublicKey | undefined} pubkey
* @param {MintVersion | undefined} version
* @param {string | undefined} description
* @param {string | undefined} description_long
* @param {any} contact
* @param {any} nuts
* @param {string | undefined} [motd]
*/
  constructor(name: string | undefined, pubkey: PublicKey | undefined, version: MintVersion | undefined, description: string | undefined, description_long: string | undefined, contact: any, nuts: any, motd?: string);
/**
* Get contact
*/
  readonly contact: any;
/**
* Get description
*/
  readonly description: string | undefined;
/**
* Get description long
*/
  readonly description_long: string | undefined;
/**
* Get motd
*/
  readonly motd: string | undefined;
/**
* Get Name
*/
  readonly name: string | undefined;
/**
* Get supported nuts
*/
  readonly nuts: any;
/**
* Get Pubkey
*/
  readonly pubkey: PublicKey | undefined;
/**
* Get Version
*/
  readonly version: MintVersion | undefined;
}
/**
*/
export class MintMethodSettings {
  free(): void;
}
/**
*/
export class MintProofs {
  free(): void;
}
/**
*/
export class MintQuote {
  free(): void;
/**
*/
  readonly amount: Amount;
/**
*/
  readonly expiry: bigint;
/**
*/
  readonly id: string;
/**
*/
  readonly paid: boolean;
/**
*/
  readonly request: string;
/**
*/
  readonly unit: CurrencyUnit;
}
/**
*/
export class MintQuoteBolt11Request {
  free(): void;
}
/**
*/
export class MintQuoteBolt11Response {
  free(): void;
/**
*/
  readonly expiry: bigint | undefined;
/**
*/
  readonly paid: boolean;
/**
*/
  readonly quote: string;
/**
*/
  readonly request: string;
}
/**
*/
export class MintVersion {
  free(): void;
/**
* @param {string} name
* @param {string} version
*/
  constructor(name: string, version: string);
/**
* Get Name
*/
  readonly name: string;
/**
* Get Version
*/
  readonly version: string;
}
/**
*/
export class Nut05Settings {
  free(): void;
}
/**
*/
export class Nut10Secret {
  free(): void;
}
/**
*/
export class P2PKSpendingConditions {
  free(): void;
/**
* @param {string} pubkey
* @param {Conditions} conditions
*/
  constructor(pubkey: string, conditions: Conditions);
}
/**
*/
export class P2PKWitness {
  free(): void;
}
/**
*/
export class PostMeltResponse {
  free(): void;
}
/**
*/
export class PostMintResponse {
  free(): void;
/**
* Try From Base 64 String
* @param {any} signatures
*/
  constructor(signatures: any);
/**
*/
  readonly signatures: any;
}
/**
*/
export class PreMint {
  free(): void;
}
/**
*/
export class PreMintSecrets {
  free(): void;
}
/**
*/
export class Proof {
  free(): void;
/**
* @param {Amount} amount
* @param {Secret} secret
* @param {PublicKey} c
* @param {Id} keyset_id
* @param {Witness | undefined} [witness]
* @param {ProofDleq | undefined} [dleq]
*/
  constructor(amount: Amount, secret: Secret, c: PublicKey, keyset_id: Id, witness?: Witness, dleq?: ProofDleq);
/**
* Amount
*/
  readonly amount: Amount;
/**
* C
*/
  readonly c: PublicKey;
/**
* Keyset Id
*/
  readonly keyset_id: Id;
/**
* Secret
*/
  readonly secret: Secret;
}
/**
*/
export class ProofDleq {
  free(): void;
/**
* @param {SecretKey} e
* @param {SecretKey} s
* @param {SecretKey} r
*/
  constructor(e: SecretKey, s: SecretKey, r: SecretKey);
/**
* e
*/
  readonly e: SecretKey;
/**
* r
*/
  readonly r: SecretKey;
/**
* s
*/
  readonly s: SecretKey;
}
/**
*/
export class ProofState {
  free(): void;
}
/**
*/
export class PublicKey {
  free(): void;
/**
* From Hex
* @param {string} hex
* @returns {PublicKey}
*/
  static fromHex(hex: string): PublicKey;
/**
* To Hex
* @returns {string}
*/
  toHex(): string;
}
/**
*/
export class RestoreRequest {
  free(): void;
}
/**
*/
export class RestoreResponse {
  free(): void;
}
/**
*/
export class Secret {
  free(): void;
/**
*/
  constructor();
/**
* As Bytes
* @returns {Uint8Array}
*/
  asBytes(): Uint8Array;
}
/**
*/
export class SecretData {
  free(): void;
}
/**
*/
export class SecretKey {
  free(): void;
/**
* To Hex
* @returns {string}
*/
  toHex(): string;
}
/**
*/
export class Settings {
  free(): void;
}
/**
*/
export class SplitResponse {
  free(): void;
/**
* @param {any} signatures
*/
  constructor(signatures: any);
/**
* Promises Amount
* @returns {Amount}
*/
  promisesAmount(): Amount;
/**
* Get Promises
*/
  readonly signatures: any;
}
/**
*/
export class SwapRequest {
  free(): void;
/**
* @param {any} inputs
* @param {any} outputs
*/
  constructor(inputs: any, outputs: any);
/**
* Proofs Amount
* @returns {Amount}
*/
  proofsAmount(): Amount;
/**
* Output Amount
* @returns {Amount}
*/
  outputAmount(): Amount;
/**
* Get Outputs
*/
  readonly outputs: any;
/**
* Get Proofs
*/
  readonly proofs: any;
}
/**
*/
export class Token {
  free(): void;
/**
* @param {string} token
*/
  constructor(token: string);
}
/**
*/
export class Wallet {
  free(): void;
/**
* @param {Uint8Array} seed
* @param {(SecretKey)[]} p2pk_signing_keys
*/
  constructor(seed: Uint8Array, p2pk_signing_keys: (SecretKey)[]);
/**
* @param {CurrencyUnit} unit
* @returns {Promise<Amount>}
*/
  unitBalance(unit: CurrencyUnit): Promise<Amount>;
/**
* @param {CurrencyUnit} unit
* @returns {Promise<Amount>}
*/
  pendingUnitBalance(unit: CurrencyUnit): Promise<Amount>;
/**
* @returns {Promise<any>}
*/
  totalBalance(): Promise<any>;
/**
* @returns {Promise<any>}
*/
  totalPendingBalance(): Promise<any>;
/**
* @param {string | undefined} [mint_url]
* @param {CurrencyUnit | undefined} [unit]
* @returns {Promise<Amount>}
*/
  checkAllPendingProofs(mint_url?: string, unit?: CurrencyUnit): Promise<Amount>;
/**
* @returns {Promise<any>}
*/
  mintBalances(): Promise<any>;
/**
* @param {string} mint_url
* @returns {Promise<MintInfo | undefined>}
*/
  addMint(mint_url: string): Promise<MintInfo | undefined>;
/**
* @param {string} mint_url
* @returns {Promise<void>}
*/
  refreshMint(mint_url: string): Promise<void>;
/**
* @param {string} mint_url
* @param {bigint} amount
* @param {CurrencyUnit} unit
* @returns {Promise<MintQuote>}
*/
  mintQuote(mint_url: string, amount: bigint, unit: CurrencyUnit): Promise<MintQuote>;
/**
* @param {string} mint_url
* @param {string} quote_id
* @returns {Promise<MintQuoteBolt11Response>}
*/
  mintQuoteStatus(mint_url: string, quote_id: string): Promise<MintQuoteBolt11Response>;
/**
* @returns {Promise<Amount>}
*/
  checkAllMintQuotes(): Promise<Amount>;
/**
* @param {string} mint_url
* @param {string} quote_id
* @param {P2PKSpendingConditions | undefined} [p2pk_condition]
* @param {HTLCSpendingConditions | undefined} [htlc_condition]
* @param {Amount | undefined} [split_target_amount]
* @returns {Promise<Amount>}
*/
  mint(mint_url: string, quote_id: string, p2pk_condition?: P2PKSpendingConditions, htlc_condition?: HTLCSpendingConditions, split_target_amount?: Amount): Promise<Amount>;
/**
* @param {string} mint_url
* @param {CurrencyUnit} unit
* @param {string} request
* @param {Amount | undefined} [mpp_amount]
* @returns {Promise<MeltQuote>}
*/
  meltQuote(mint_url: string, unit: CurrencyUnit, request: string, mpp_amount?: Amount): Promise<MeltQuote>;
/**
* @param {string} mint_url
* @param {string} quote_id
* @returns {Promise<MeltQuoteBolt11Response>}
*/
  meltQuoteStatus(mint_url: string, quote_id: string): Promise<MeltQuoteBolt11Response>;
/**
* @param {string} mint_url
* @param {string} quote_id
* @param {Amount | undefined} [split_target_amount]
* @returns {Promise<Melted>}
*/
  melt(mint_url: string, quote_id: string, split_target_amount?: Amount): Promise<Melted>;
/**
* @param {string} encoded_token
* @param {any} preimages
* @returns {Promise<Amount>}
*/
  receive(encoded_token: string, preimages: any): Promise<Amount>;
/**
* @param {string} mint_url
* @param {CurrencyUnit} unit
* @param {string | undefined} memo
* @param {bigint} amount
* @param {P2PKSpendingConditions | undefined} [p2pk_condition]
* @param {HTLCSpendingConditions | undefined} [htlc_condition]
* @param {Amount | undefined} [split_target_amount]
* @returns {Promise<string>}
*/
  send(mint_url: string, unit: CurrencyUnit, memo: string | undefined, amount: bigint, p2pk_condition?: P2PKSpendingConditions, htlc_condition?: HTLCSpendingConditions, split_target_amount?: Amount): Promise<string>;
/**
* @param {string} mint_url
* @param {CurrencyUnit} unit
* @param {bigint} amount
* @param {(Proof)[]} input_proofs
* @param {P2PKSpendingConditions | undefined} [p2pk_condition]
* @param {HTLCSpendingConditions | undefined} [htlc_condition]
* @param {Amount | undefined} [split_target_amount]
* @returns {Promise<any>}
*/
  swap(mint_url: string, unit: CurrencyUnit, amount: bigint, input_proofs: (Proof)[], p2pk_condition?: P2PKSpendingConditions, htlc_condition?: HTLCSpendingConditions, split_target_amount?: Amount): Promise<any>;
}
/**
*/
export class Witness {
  free(): void;
/**
* @param {string | undefined} [preimage]
* @param {(string)[] | undefined} [signatures]
*/
  constructor(preimage?: string, signatures?: (string)[]);
/**
*/
  readonly preimage: string | undefined;
/**
*/
  readonly signatures: (string)[] | undefined;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_witness_free: (a: number) => void;
  readonly witness_new: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly witness_signatures: (a: number, b: number) => void;
  readonly witness_preimage: (a: number, b: number) => void;
  readonly __wbg_publickey_free: (a: number) => void;
  readonly publickey_fromHex: (a: number, b: number, c: number) => void;
  readonly publickey_toHex: (a: number, b: number) => void;
  readonly __wbg_id_free: (a: number) => void;
  readonly id_tryFromBase64: (a: number, b: number, c: number) => void;
  readonly id_asString: (a: number, b: number) => void;
  readonly __wbg_keyset_free: (a: number) => void;
  readonly keypair_new: (a: number, b: number, c: number, d: number) => number;
  readonly keypair_id: (a: number) => number;
  readonly keypair_keys: (a: number) => number;
  readonly __wbg_keysetsresponse_free: (a: number) => void;
  readonly keysetsresponse_new: (a: number, b: number) => void;
  readonly keysetsresponse_keys: (a: number, b: number) => void;
  readonly __wbg_keysresponse_free: (a: number) => void;
  readonly keysresponse_new: (a: number, b: number) => void;
  readonly keysresponse_keysets: (a: number, b: number) => void;
  readonly __wbg_htlcwitness_free: (a: number) => void;
  readonly __wbg_htlcspendingconditions_free: (a: number) => void;
  readonly htlcspendingconditions_new: (a: number, b: number, c: number, d: number) => void;
  readonly __wbg_mintquote_free: (a: number) => void;
  readonly mintquote_id: (a: number, b: number) => void;
  readonly mintquote_unit: (a: number) => number;
  readonly mintquote_amount: (a: number) => number;
  readonly mintquote_request: (a: number, b: number) => void;
  readonly mintquote_paid: (a: number) => number;
  readonly mintquote_expiry: (a: number) => number;
  readonly __wbg_wallet_free: (a: number) => void;
  readonly wallet_new: (a: number, b: number, c: number, d: number) => number;
  readonly wallet_unitBalance: (a: number, b: number) => number;
  readonly wallet_pendingUnitBalance: (a: number, b: number) => number;
  readonly wallet_totalBalance: (a: number) => number;
  readonly wallet_totalPendingBalance: (a: number) => number;
  readonly wallet_checkAllPendingProofs: (a: number, b: number, c: number, d: number) => number;
  readonly wallet_mintBalances: (a: number) => number;
  readonly wallet_addMint: (a: number, b: number, c: number) => number;
  readonly wallet_refreshMint: (a: number, b: number, c: number) => number;
  readonly wallet_mintQuote: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly wallet_mintQuoteStatus: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly wallet_checkAllMintQuotes: (a: number) => number;
  readonly wallet_mint: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly wallet_meltQuote: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly wallet_meltQuoteStatus: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly wallet_melt: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly wallet_receive: (a: number, b: number, c: number, d: number) => number;
  readonly wallet_send: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => number;
  readonly wallet_swap: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => number;
  readonly __wbg_blindsignature_free: (a: number) => void;
  readonly blindsignature_new: (a: number, b: number, c: number, d: number) => number;
  readonly __wbg_mintproofs_free: (a: number) => void;
  readonly __wbg_swaprequest_free: (a: number) => void;
  readonly swaprequest_new: (a: number, b: number, c: number) => void;
  readonly swaprequest_proofs: (a: number, b: number) => void;
  readonly swaprequest_outputs: (a: number, b: number) => void;
  readonly swaprequest_proofsAmount: (a: number) => number;
  readonly swaprequest_outputAmount: (a: number) => number;
  readonly __wbg_splitresponse_free: (a: number) => void;
  readonly splitresponse_new: (a: number, b: number) => void;
  readonly splitresponse_signatures: (a: number, b: number) => void;
  readonly splitresponse_promisesAmount: (a: number) => number;
  readonly __wbg_checkstaterequest_free: (a: number) => void;
  readonly __wbg_proofstate_free: (a: number) => void;
  readonly __wbg_checkstateresponse_free: (a: number) => void;
  readonly __wbg_restorerequest_free: (a: number) => void;
  readonly __wbg_restoreresponse_free: (a: number) => void;
  readonly __wbg_secretdata_free: (a: number) => void;
  readonly __wbg_nut10secret_free: (a: number) => void;
  readonly __wbg_meltquote_free: (a: number) => void;
  readonly meltquote_id: (a: number, b: number) => void;
  readonly meltquote_unit: (a: number) => number;
  readonly meltquote_amount: (a: number) => number;
  readonly meltquote_request: (a: number, b: number) => void;
  readonly meltquote_fee_reserve: (a: number) => number;
  readonly meltquote_paid: (a: number) => number;
  readonly meltquote_expiry: (a: number) => number;
  readonly start: () => void;
  readonly __wbg_blindedmessage_free: (a: number) => void;
  readonly blindedmessage_new: (a: number, b: number, c: number, d: number) => number;
  readonly blindedmessage_keyset_id: (a: number) => number;
  readonly blindedmessage_amount: (a: number) => number;
  readonly blindedmessage_blinded_secret: (a: number) => number;
  readonly blindedmessage_witness: (a: number) => number;
  readonly __wbg_proof_free: (a: number) => void;
  readonly proof_new: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly proof_secret: (a: number) => number;
  readonly proof_keyset_id: (a: number) => number;
  readonly __wbg_token_free: (a: number) => void;
  readonly token_new: (a: number, b: number, c: number) => void;
  readonly __wbg_mintquotebolt11request_free: (a: number) => void;
  readonly __wbg_mintquotebolt11response_free: (a: number) => void;
  readonly mintquotebolt11response_paid: (a: number) => number;
  readonly mintquotebolt11response_quote: (a: number, b: number) => void;
  readonly mintquotebolt11response_request: (a: number, b: number) => void;
  readonly __wbg_mintbolt11request_free: (a: number) => void;
  readonly mintbolt11request_new: (a: number, b: number, c: number, d: number) => void;
  readonly mintbolt11request_outputs: (a: number, b: number) => void;
  readonly mintbolt11request_totalAmount: (a: number) => number;
  readonly __wbg_postmintresponse_free: (a: number) => void;
  readonly postmintresponse_new: (a: number, b: number) => void;
  readonly postmintresponse_signatures: (a: number, b: number) => void;
  readonly __wbg_mintmethodsettings_free: (a: number) => void;
  readonly __wbg_settings_free: (a: number) => void;
  readonly __wbg_p2pkwitness_free: (a: number) => void;
  readonly __wbg_p2pkspendingconditions_free: (a: number) => void;
  readonly p2pkspendingconditions_new: (a: number, b: number, c: number, d: number) => void;
  readonly __wbg_conditions_free: (a: number) => void;
  readonly conditions_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly conditions_locktime: (a: number, b: number) => void;
  readonly conditions_pubkeys: (a: number, b: number) => void;
  readonly conditions_refund_keys: (a: number, b: number) => void;
  readonly conditions_num_sigs: (a: number, b: number) => void;
  readonly conditions_sig_flag: (a: number, b: number) => void;
  readonly __wbg_blindsignaturedleq_free: (a: number) => void;
  readonly blindedsignaturedleq_new: (a: number, b: number) => number;
  readonly blindedsignaturedleq_e: (a: number) => number;
  readonly blindedsignaturedleq_s: (a: number) => number;
  readonly __wbg_proofdleq_free: (a: number) => void;
  readonly proofdleq_new: (a: number, b: number, c: number) => number;
  readonly proofdleq_r: (a: number) => number;
  readonly mintquotebolt11response_expiry: (a: number, b: number) => void;
  readonly proof_amount: (a: number) => number;
  readonly proof_c: (a: number) => number;
  readonly proofdleq_e: (a: number) => number;
  readonly proofdleq_s: (a: number) => number;
  readonly __wbg_premint_free: (a: number) => void;
  readonly __wbg_premintsecrets_free: (a: number) => void;
  readonly __wbg_keys_free: (a: number) => void;
  readonly keys_new: (a: number, b: number) => void;
  readonly keys_keys: (a: number, b: number) => void;
  readonly keys_amountKey: (a: number, b: number) => number;
  readonly __wbg_secretkey_free: (a: number) => void;
  readonly secretkey_toHex: (a: number, b: number) => void;
  readonly __wbg_meltquotebolt11request_free: (a: number) => void;
  readonly __wbg_meltquotebolt11response_free: (a: number) => void;
  readonly __wbg_meltbolt11request_free: (a: number) => void;
  readonly __wbg_postmeltresponse_free: (a: number) => void;
  readonly __wbg_meltmethodsettings_free: (a: number) => void;
  readonly __wbg_nut05settings_free: (a: number) => void;
  readonly __wbg_mintversion_free: (a: number) => void;
  readonly mintversion_new: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly mintversion_name: (a: number, b: number) => void;
  readonly mintversion_version: (a: number, b: number) => void;
  readonly __wbg_mintinfo_free: (a: number) => void;
  readonly mintinfo_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
  readonly mintinfo_name: (a: number, b: number) => void;
  readonly mintinfo_pubkey: (a: number) => number;
  readonly mintinfo_version: (a: number) => number;
  readonly mintinfo_description: (a: number, b: number) => void;
  readonly mintinfo_description_long: (a: number, b: number) => void;
  readonly mintinfo_contact: (a: number, b: number) => void;
  readonly mintinfo_nuts: (a: number, b: number) => void;
  readonly mintinfo_motd: (a: number, b: number) => void;
  readonly __wbg_amount_free: (a: number) => void;
  readonly amount_new: (a: number) => number;
  readonly amount_split: (a: number, b: number) => void;
  readonly amount_value: (a: number) => number;
  readonly __wbg_melted_free: (a: number) => void;
  readonly melted_paid: (a: number) => number;
  readonly melted_preimage: (a: number, b: number) => void;
  readonly melted_change: (a: number, b: number) => void;
  readonly __wbg_secret_free: (a: number) => void;
  readonly secret_new: () => number;
  readonly secret_asBytes: (a: number, b: number) => void;
  readonly rustsecp256k1_v0_8_1_context_create: (a: number) => number;
  readonly rustsecp256k1_v0_8_1_context_destroy: (a: number) => void;
  readonly rustsecp256k1_v0_8_1_default_illegal_callback_fn: (a: number, b: number) => void;
  readonly rustsecp256k1_v0_8_1_default_error_callback_fn: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h93d2262a08248529: (a: number, b: number, c: number, d: number) => void;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h795549e6e8e06531: (a: number, b: number, c: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__h1be44c9bdd1b9b59: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
