import { isTestnet } from 'store/config';
import { getMoneroTxExplorerUrl } from 'utils/currencyUtils';
import MoneroIcon from 'renderer/components/icons/MoneroIcon';
import TransactionInfoBox from './TransactionInfoBox';

type MoneroTransactionInfoBoxProps = {
  title: string;
  txId: string;
  additionalText: string | null | JSX.Element;
  loading: boolean;
};

export default function MoneroTransactionInfoBox({
  txId,
  ...props
}: MoneroTransactionInfoBoxProps) {
  const explorerUrl = getMoneroTxExplorerUrl(txId, isTestnet());

  return (
    <TransactionInfoBox
      txId={txId}
      explorerUrl={explorerUrl}
      icon={<MoneroIcon />}
      {...props}
    />
  );
}
