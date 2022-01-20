import { isTestnet } from 'store/config';
import { getBitcoinTxExplorerUrl } from 'utils/currencyUtils';
import BitcoinIcon from 'renderer/components/icons/BitcoinIcon';
import TransactionInfoBox from './TransactionInfoBox';

type BitcoinTransactionInfoBoxProps = {
  title: string;
  txId: string;
  additionalText: string | null | JSX.Element;
  loading: boolean;
};

export default function BitcoinTransactionInfoBox({
  txId,
  ...props
}: BitcoinTransactionInfoBoxProps) {
  const explorerUrl = getBitcoinTxExplorerUrl(txId, isTestnet());

  return (
    <TransactionInfoBox
      txId={txId}
      explorerUrl={explorerUrl}
      icon={<BitcoinIcon />}
      {...props}
    />
  );
}
