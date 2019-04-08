import TransportU2F from '@ledgerhq/hw-transport-u2f';
import Eth from '@ledgerhq/hw-app-eth';

/**
 * Lists all accounts
 *
 * @param type {String}
 * @param start {Number}
 * @param n {Number}
 * @param path {String}
 *
 * @return {Promise<Array>}
 */
export const listAccounts = async (type, start, n, path) => {
  const _transport = await TransportU2F.create();
  const eth = new Eth(_transport);
  const accounts = [];

  if (type === 'legacy') {
    for (let i = 0; i < n; i += 1) {
      const currentPath = `44'/60'/0'/${start + i}`;
      const account = await eth.getAddress(currentPath); // eslint-disable-line
      account.path = currentPath;
      accounts.push(account);
    }
  } else if (type === 'live') {
    for (let i = 0; i < n; i += 1) {
      const currentPath = `44'/60'/${start + i}'/0/0`;
      const account = await eth.getAddress(currentPath); // eslint-disable-line
      account.path = currentPath;
      accounts.push(account);
    }
  } else {
    const account = await eth.getAddress(path);
    account.path = path;
    accounts.push(account);
  }
  return accounts;
};
