export interface TxLock {
  inner: Inner;
  output_descriptor: string;
}

export interface Inner {
  global: Global;
  inputs: InnerInput[];
  outputs: Output[];
}

export interface Global {
  unsigned_tx: UnsignedTx;
  version: number;
  proprietary: any[];
  unknown: any[];
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
  proprietary: any[];
  unknown: any[];
}

export interface Output {
  redeem_script: null;
  witness_script: null;
  bip32_derivation: any[];
  proprietary: any[];
  unknown: any[];
}
