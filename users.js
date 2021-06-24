const BigNumber = require('bignumber.js');
const fs = require('fs').promises;
const { WEI_FACTOR } = require('./utils/config');
const {
  fetchPreStakedTransactions,
  filterIneligibleTransactions,
} = require('./modules/tx');
const { getInjAddressFromAddress } = require('./modules/addresses');

(async () => {
  const preStakedTransactions = await fetchPreStakedTransactions();
  const eligiblePreStakedTransactions = filterIneligibleTransactions(
    preStakedTransactions,
  );
  const eligiblePreStakedAddresses = eligiblePreStakedTransactions.map(
    tx => tx.from,
  );
  const eligibleUsers = eligiblePreStakedAddresses.map(address => {
    const transactions = eligiblePreStakedTransactions.filter(
      a => a.from === address,
    );
    const deposits = transactions.map(tx => {
      return {
        amount: new BigNumber(tx.value).dividedBy(WEI_FACTOR),
        timestamp: tx.timeStamp,
      };
    });
    const totalPreStaked = deposits.reduce((total, { amount }) => {
      return total.plus(amount);
    }, new BigNumber(0));

    return {
      address,
      deposits,
      totalPreStaked: totalPreStaked,
    };
  });

  const nonDuplicateEligibleUsers = eligibleUsers.reduce((users, user) => {
    if (users.find(u => u.address === user.address)) {
      return users;
    }

    return [...users, user];
  }, []);

  const users = nonDuplicateEligibleUsers.map(address => ({
    ...address,
    injAddress: getInjAddressFromAddress(address.address),
  }));

  await fs.writeFile(
    './json/eligible-users.json',
    JSON.stringify(users, null, 1),
  );
})();
