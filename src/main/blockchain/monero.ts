import { isTestnet } from '../../store/config';
import fetch from 'node-fetch';
import logger from '../../utils/logger';

type MoneroNode = [
  host: string,
  port: number,
  testnet: boolean,
];

const NODES: MoneroNode[] = [
  ['node.moneroworld.com', 18089, false],
  ['nodes.hashvault.pro', 18081, false],
  ['xmr-node-usa-east.cakewallet.com', 18081, false],
  ['xmr-node-uk.cakewallet.com', 18081, false],
  ['node.monerodevs.org', 18089, false],
  ['p2pmd.xmrvsbeast.com', 18081, false],
  ['nodex.monerujo.io', 18081, false],
  ['node.community.rino.io', 18081, false],
  ['stagenet.xmr-tw.org', 38081, true],
  ['node.monerodevs.org', 38089, true],
  ['singapore.node.xmr.pm', 38081, true],
  ['xmr-lux.boldsuck.org', 38081, true],
  ['stagenet.community.rino.io', 38081, true],
];

/**
 * Checks if a node is online, synced and on the correct network
 * Times out after 45s
 * @param node
 */
async function checkNode(node: MoneroNode): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 45 * 1000);

  try {
    // Documented here: https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#get_info-not-json
    const url = `http://${node[0]}:${node[1]}/get_info`;
    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const json = (await response.json()) as {
      status: string;
      stagenet: boolean;
      mainnet: boolean;
      synchronized: boolean;
    };

    // Check if the node is synced and on correct network
    // If node[2] is true, then we are on testnet and json.stagenet must be true
    // If node[2] is false, then we are on mainnet and json.mainnet must be true
    return (
      json.synchronized &&
      json.status === 'OK' &&
      (node[2] ? json.stagenet : json.mainnet)
    );
  } catch (e) {
    logger.error(`Failed to connect to node ${formatNode(node)}`);
    clearTimeout(timeout);
    return false;
  }
}

function formatNode(node: MoneroNode): string {
  return `${node[0]}:${node[1]}`;
}

/**
 * Returns one of the nodes in NODES that is online, synced and on the correct network
 */
export async function findMoneroNode(): Promise<string> {
  for (const node of NODES.filter((node) => node[2] === isTestnet())) {
    if (await checkNode(node)) {
      logger.info(`Picked Monero Node ${formatNode(node)}`);
      return formatNode(node);
    }
  }

  throw new Error('No Monero Node found');
}
