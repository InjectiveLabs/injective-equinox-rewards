const axios = require('./../utils/axios');
const BigNumber = require('bignumber.js');
const { WEI_FACTOR } = require('./../utils/config');

const fetchBalance = async injAddress => {
  try {
    const { data } = await axios.get(
      `https://staking-lcd.injective.network/cosmos/bank/v1beta1/balances/${injAddress}/inj`,
    );

    return new BigNumber(data.balance.amount).dividedBy(WEI_FACTOR).toFixed(4);
  } catch (e) {
    console.error(e);
  }
};

const fetchAccountTxs = async injAddress => {
  try {
    const { data } = await axios.get(
      `https://staking-explorer-api.injective.network/v1/accountTxs/${injAddress}`,
    );

    return data.data;
  } catch (e) {
    console.error(e);
  }
};

const getMessagesFromAccountTxs = txs => {
  const successfulTxs = txs.filter(tx => tx.result);

  return successfulTxs
    .map(tx => {
      return tx.messages.reduce((messages, message) => {
        const [, messageType] = message.type.split('/');
        const pieces = messageType.split('.');
        return [
          ...messages,
          pieces.length > 0 ? pieces[pieces.length - 1] : pieces[0],
        ];
      }, []);
    })
    .flat();
};

const getProposalsFromAccountTxs = txs => {
  const successfulTxs = txs.filter(tx => tx.result);

  return successfulTxs
    .map(tx => {
      return tx.messages.reduce((messages, message) => {
        const [, messageType] = message.type.split('/');
        const pieces = messageType.split('.');
        const type = pieces.length > 0 ? pieces[pieces.length - 1] : pieces[0];

        if (type === 'MsgSubmitProposal' || type === 'submit_proposal') {
          return [...messages, message.value.content];
        }

        return messages;
      }, []);
    })
    .flat();
};

module.exports = {
  fetchBalance,
  fetchAccountTxs,
  getProposalsFromAccountTxs,
  getMessagesFromAccountTxs,
};
