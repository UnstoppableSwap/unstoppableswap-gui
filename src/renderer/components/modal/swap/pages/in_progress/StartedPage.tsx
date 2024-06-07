import { SwapStateStarted } from 'models/storeModel';
import CircularProgressWithSubtitle from '../../CircularProgressWithSubtitle';
import { BitcoinAmount } from 'renderer/components/other/Units';

export default function StartedPage({ state}: { state: SwapStateStarted }) {
  const description = state.txLockDetails ? (
    <>
      Locking <BitcoinAmount amount={state.txLockDetails.amount} /> with a network fee of <BitcoinAmount amount={state.txLockDetails.fees} /> 
    </>
  ) : (
    'Locking Bitcoin'
  );

  return <CircularProgressWithSubtitle description={description} />;
}
