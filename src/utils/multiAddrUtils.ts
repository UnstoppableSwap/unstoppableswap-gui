import { Multiaddr } from 'multiaddr';

// eslint-disable-next-line import/prefer-default-export
export function splitMultiAddress(address: string): [string, string] {
  let multiAddr = new Multiaddr(address);
  const peerId = multiAddr.getPeerId();
  if (peerId) {
    multiAddr = multiAddr.decapsulateCode(421);
    return [peerId, multiAddr.toString()];
  }
  throw new Error(`No peer id present in multi address ${address}`);
}
