import CircularProgressWithSubtitle from '../../CircularProgressWithSubtitle';
import { useAppSelector } from '../../../../../../store/hooks';
import { SwapSpawnType } from '../../../../../../models/cliModel';

export default function InitiatedPage() {
  const description = useAppSelector((s) => {
    switch (s.swap.spawnType) {
      case SwapSpawnType.INIT:
        return 'Requesting quote from provider...';
      case SwapSpawnType.RESUME:
        return 'Resuming swap...';
      case SwapSpawnType.CANCEL_REFUND:
        return 'Attempting to cancel & refund swap...';
      default:
        // Should never be hit
        return 'Initiating swap...';
    }
  });

  return <CircularProgressWithSubtitle description={description} />;
}
