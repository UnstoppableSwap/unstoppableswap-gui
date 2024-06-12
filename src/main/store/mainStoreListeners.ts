import { createListenerMiddleware } from '@reduxjs/toolkit';
import { getRawSwapInfo, getRawSwapInfos } from '../cli/rpc';
import {
  CliLog,
  getCliLogSpanSwapId,
  isCliLogAdvancingState,
  isCliLogGotNotificationForNewBlock,
  isCliLogReleasingSwapLockLog,
} from '../../models/cliModel';
import logger from '../../utils/logger';

export function createMainListeners() {
  const listener = createListenerMiddleware();

  listener.startListening({
    predicate: (action) => {
      // Check if the action is a swapAddLog action
      return action.type === 'swap/swapAddLog';
    },
    effect: async (action) => {
      const logs = action.payload.logs as CliLog[];
      const advancedStateIndicationLog = logs.find(
        (log) =>
          isCliLogAdvancingState(log) || isCliLogReleasingSwapLockLog(log),
      );

      // Here we check if we got a new "Advancing state" or a "Releasing swap lock" log
      // If we did, we fetch the swap infos because we know the state in the database has likely changed
      // We want the state that is calculated (swapSlice) in the Redux state based on the logs to be up to date
      // with the state we have saved from the database
      if (advancedStateIndicationLog) {
        const swapId = getCliLogSpanSwapId(advancedStateIndicationLog);
        if (swapId) {
          logger.debug(
            { swapId },
            'Fetching swap infos because a new "Advancing state" or "Releasing swap lock" log was found',
          );
          await getRawSwapInfo(swapId);
        }
      }
    },
  });

  // Listener for "Got notification for new Block" log
  // If we get a new block, we fetch all swap infos because the state of the timelocks might have changed
  listener.startListening({
    predicate: (action) => {
      return action.type === 'rpc/rpcAddLog';
    },
    effect: async (action) => {
      const logs = action.payload.logs as CliLog[];
      const newBlockLog = logs.find(isCliLogGotNotificationForNewBlock);

      if (newBlockLog) {
        logger.debug('Fetching all swap infos because a new block was found');
        await getRawSwapInfos();
      }
    },
  });

  return listener;
}
