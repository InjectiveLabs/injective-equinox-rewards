const axios = require('./../utils/axios');
const {
  DEPOSIT_MANAGER_ADDRESS,
  START_BLOCK,
  WEI_FACTOR,
  ETHERSCAN_API_KEY,
} = require('./../utils/config');
const BigNumber = require('bignumber.js');

const fetchPreStakedTransactions = async () => {
  try {
    const { data } = await axios.get(
      `http://api.etherscan.io/api?module=account&action=tokentx&address=${DEPOSIT_MANAGER_ADDRESS}&startblock=${START_BLOCK}&endblock=999999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`,
    );

    return data.result;
  } catch (e) {
    console.error(e);
  }
};

const filterIneligibleTransactions = transactions => {
  const addressesThatHadWithdrawn = transactions
    .filter(transaction => transaction.from === DEPOSIT_MANAGER_ADDRESS)
    .map(tx => tx.to);

  return transactions.filter(transaction => {
    if (transaction.from === DEPOSIT_MANAGER_ADDRESS) {
      return false;
    }

    if (
      transaction.to === DEPOSIT_MANAGER_ADDRESS &&
      addressesThatHadWithdrawn.includes(transaction.from)
    ) {
      return false;
    }

    return true;
  });
};

const getPreStakedTransactionAmounts = transactions => {
  return transactions.reduce((deposits, transaction) => {
    const { from, value, timeStamp } = transaction;
    const key = `${from}-${timestamp}`;
    const valueToBase = new BigNumber(value).dividedBy(WEI_FACTOR);

    if (deposits.has(key)) {
      deposits.set(key, {
        timestamp: timeStamp,
        amount: deposits.get(key).amount.plus(valueToBase),
      });
    } else {
      deposits.set(key, { timestamp: timeStamp, amount: valueToBase });
    }

    return deposits;
  }, new Map());
};

module.exports = {
  fetchPreStakedTransactions,
  filterIneligibleTransactions,
  getPreStakedTransactionAmounts,
};
