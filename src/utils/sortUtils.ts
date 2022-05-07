import { ExtendedProviderStatus } from '../models/apiModel';

// eslint-disable-next-line import/prefer-default-export
export function sortProviderList(list: ExtendedProviderStatus[]) {
  return list.concat().sort((firstEl, secondEl) => {
    if (firstEl.relevancy === undefined) return 1;
    if (secondEl.relevancy === undefined) return -1;
    if (firstEl.relevancy > secondEl.relevancy) {
      return -1;
    }
    return 1;
  });
}
