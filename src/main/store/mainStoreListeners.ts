import { createListenerMiddleware } from '@reduxjs/toolkit';
import { getRawSwapInfo } from '../cli/rpc';
import {
  CliLog,
  getCliLogSpanSwapId,
  isCliLogAdvancingState,
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
      const advancingStateLog = logs.find(isCliLogAdvancingState);

      // Here we check if we got a new "Advancing state" log
      // If we did, we fetch the swap infos because we know the state in the database has changed
      // We want the state that is calculated (swapSlice) in the Redux state based on the logs to be up to date
      // with the state we have saved from the database
      if (advancingStateLog) {
        const swapId = getCliLogSpanSwapId(advancingStateLog);
        if (swapId) {
          logger.debug(
            { swapId },
            'Fetching swap infos because a new "Advancing state" log was found'
          );
          await getRawSwapInfo(swapId);
        }
      }
    },
  });

  return listener;
}
