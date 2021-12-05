import { ExtendedProvider } from '../models/storeModel';

// eslint-disable-next-line import/prefer-default-export
export function sortProviderList(list: ExtendedProvider[]) {
  return list.concat().sort((firstEl, secondEl) => {
    if (firstEl.relevancy > secondEl.relevancy) {
      return -1;
    }
    return 1;
  });
}
