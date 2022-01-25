import fetch from 'node-fetch';
import { ElectrumClient } from 'electrum-cash';
import { isTestnet } from '../store/config';

type BlockchainDaemon = {
  url: string;
  testnet: boolean;
};

const MONERO_REMOTE_DAEMONS: BlockchainDaemon[] = [
  {
    url: 'http://stagenet.melo.tools:38081',
    testnet: true,
  },
  {
    url: 'http://stagenet.xmr-tw.org:38081',
    testnet: true,
  },
  {
    url: 'http://node.melo.tools:18081',
    testnet: false,
  },
  {
    url: 'http://node.moneroworld.com:18089',
    testnet: false,
  },
  {
    url: 'http://uwillrunanodesoon.moneroworld.com:18089',
    testnet: false,
  },
  {
    url: 'http://node.supportxmr.com:18081',
    testnet: false,
  },
  {
    url: 'http://xmr-node.cakewallet.com:18081',
    testnet: false,
  },
  {
    url: 'http://node.sethforprivacy.com:18089',
    testnet: false,
  },
  {
    url: 'http://nodex.monerujo.io:18081',
    testnet: false,
  },
];

type MoneroDaemonStatus = {
  nettype: 'mainnet' | 'stagenet' | 'testnet';
  height: number;
  status: 'OK' | string;
};

type ElectrumDaemonStatus = {
  rawGenesisBlock: string;
};

const BITCOIN_REMOTE_DAEMON: BlockchainDaemon[] = [
  {
    url: 'ssl://electrum.blockstream.info:60002',
    testnet: true,
  },
  {
    url: 'ssl://electrum.blockstream.info:50002',
    testnet: false,
  },
];

export async function getOnlineMoneroRemoteDaemon() {
  const daemons = MONERO_REMOTE_DAEMONS.filter(
    (node) => node.testnet === isTestnet()
  );

  for (const daemon of daemons) {
    try {
      const status = await getMoneroRemoteDaemonStatus(daemon.url);
      if (status.status === 'OK') {
        if (
          (status.nettype === 'mainnet' && !isTestnet()) ||
          (status.nettype === 'stagenet' && isTestnet())
        ) {
          console.log(
            `[node-scanner] Found monero daemon to use Url: ${daemon.url} Nettype: ${status.nettype} Height: ${status.height}`
          );
          // return daemon;
        } else {
          throw new Error(
            `network mismatch Nettype: '${
              status.nettype
            }' Testnet: ${isTestnet()}`
          );
        }
      } else {
        throw new Error(`daemon status is not 'OK' but '${status.status}'`);
      }
    } catch (e) {
      console.error(
        `[node-scanner] Failed to use monero daemon Url: ${daemon.url} Testnet: ${daemon.testnet} Error: ${e}`
      );
    }
  }

  console.error(
    `[node-scanner] Failed to find monero daemon to use. Falling back to ${daemons[0].url}...`
  );
  return daemons[0];
}

// URL example: http://node.melo.tools:18081
export async function getMoneroRemoteDaemonStatus(
  url: string
): Promise<MoneroDaemonStatus> {
  const parsedUrl = new URL(url);

  if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
    const response = await fetch(new URL('/get_info', parsedUrl).href);
    const data = await response.json();

    if (data.nettype && data.height && data.status) {
      return data as MoneroDaemonStatus;
    }
    throw new Error('Data is missing from daemon response');
  }
  throw new Error('Remote monero daemon protocol must be http or https');
}

export async function getOnlineElectrumRemoteDaemon() {
  const daemons = BITCOIN_REMOTE_DAEMON.filter(
    (node) => node.testnet === isTestnet()
  );

  for (const daemon of daemons) {
    try {
      const status = await getElectrumRemoteDaemonStatus(daemon.url);
    } catch (e) {
      console.error(
        `[node-scanner] Failed to use monero daemon Url: ${daemon.url} Testnet: ${daemon.testnet} Error: ${e}`
      );
    }
  }

  console.error(
    `[node-scanner] Failed to find electrum daemon to use. Falling back to ${daemons[0].url}...`
  );
  return daemons[0];
}

const BITCOIN_MAINNET_GENESIS_BLOCK_RAW =
  '0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4adae5494dffff001d1aa4ae18';

export async function getElectrumRemoteDaemonStatus(url: string): Promise<ElectrumDaemonStatus> {
  const parsedUrl = new URL(url);

  if (parsedUrl.protocol === 'ssl:') {
    const client = new ElectrumClient(
      'electrum',
      '1.4',
      parsedUrl.hostname,
      parseInt(parsedUrl.port, 10)
    );
    await client.connect();
    const rawGenesisBlock = await client.request('blockchain.block.header', 0);
    if(rawGenesisBlock) {
      return {
        rawGenesisBlock,
      };
    }else {
      throw new Error('No valid genesis block returned');
    }
  }
  throw new Error(
    'Remote electrum daemon protocol must be ssl and the port must be defined'
  );
}
