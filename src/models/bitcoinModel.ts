export interface TxLock {
  inner: Inner;
  output_descriptor: string;
}

export interface Inner {
  unsigned_tx: UnsignedTx; // TODO: On old bdk versions this field does not exist. Check if it exist to hide old swaps
  inputs: InnerInput[];
  outputs: Output[];
}

export interface UnsignedTx {
  version: number;
  lock_time: number;
  input: UnsignedTxInput[];
  output: WitnessUtxo[];
}

export interface UnsignedTxInput {
  previous_output: string;
  script_sig: string;
  sequence: number;
  witness: Array<number[]>;
}

export interface WitnessUtxo {
  value: number;
  script_pubkey: string;
}

export interface InnerInput {
  non_witness_utxo: UnsignedTx;
  witness_utxo: WitnessUtxo;
  sighash_type: null;
  redeem_script: null;
  witness_script: null;
  bip32_derivation: Array<Array<string[] | string>>;
  final_script_sig: null;
  final_script_witness: null;
  proprietary: unknown[];
  unknown: unknown[];
}

export interface Output {
  redeem_script: null;
  witness_script: null;
  bip32_derivation: unknown[];
  proprietary: unknown[];
  unknown: unknown[];
}
