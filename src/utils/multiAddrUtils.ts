import { Multiaddr } from 'multiaddr';
import { Provider } from '../models/apiModel';

// eslint-disable-next-line import/prefer-default-export
export function providerToConcatenatedMultiAddr(provider: Provider) {
  return new Multiaddr(provider.multiAddr)
    .encapsulate(`/p2p/${provider.peerId}`)
    .toString();
}
