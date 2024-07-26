import { Multiaddr } from 'multiaddr';
import semver from 'semver';
import { ExtendedProviderStatus, Provider } from 'models/apiModel';
import { isTestnet } from 'store/config';

const MIN_ASB_VERSION = '0.13.4';

export function providerToConcatenatedMultiAddr(provider: Provider) {
  return new Multiaddr(provider.multiAddr)
    .encapsulate(`/p2p/${provider.peerId}`)
    .toString();
}

export function isProviderOutdated(provider: ExtendedProviderStatus): boolean {
  if (provider.version) {
    if (semver.satisfies(provider.version, `>=${MIN_ASB_VERSION}`))
      return false;
  } else {
    return false;
  }

  return true;
}

export function isProviderCompatible(
  provider: ExtendedProviderStatus,
): boolean {
  return provider.testnet === isTestnet();
}
