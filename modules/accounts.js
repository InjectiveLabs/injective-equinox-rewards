const axios = require('./../utils/axios');
const BigNumber = require('bignumber.js');
const { WEI_FACTOR } = require('./../utils/config');

/**
 * 
 * @param {  baseUrl: 'https://testnet.api.injective.dev/api',
  chainUrl: 'https://testnet.grpc.injective.dev',
  chainHttpUrl: 'https://testnet.lcd.injective.dev',
  exchangeUrl: 'https://testnet.api.injective.dev',
  exchangeGatewayUrl: 'https://testnet.web3-gateway.injective.dev',
  explorerUrl: 'https://testnet.api.injective.dev/api/explorer/v1',} injAddress 
 * @returns 
 */
const fetchBalance = async injAddress => {
  try {
    const { data } = await axios.get(
      `https://testnet.lcd.injective.dev/cosmos/bank/v1beta1/balances/${injAddress}/inj`,
    );

    return new BigNumber(data.balance.amount).dividedBy(WEI_FACTOR).toFixed(4);
  } catch (e) {
    console.error(e);
  }
};

const fetchAccountTxs = async injAddress => {
  try {
    const txs = [];
    const { data } = await axios.get(
      `https://testnet.api.injective.dev/api/explorer/v1/accountTxs/${injAddress}`,
    );

    for (const tx of data.data || []) {
      for (const event of tx.events) {
        if (event.type === 'message') {
          txs.push(event.attributes ? event.attributes.action : event.type);
        } else {
          txs.push(event.type);
        }
      }
    }

    return txs;
  } catch (e) {
    console.error(e);
  }
};

const fetchAccountNonce = async injAddress => {
  try {
    const { data } = await axios.get(
      `https://testnet.lcd.injective.dev/cosmos/auth/v1beta1/accounts/${injAddress}`,
    );

    if (!data) {
      return 0;
    }

    if (!data.account) {
      return 0;
    }

    if (!data.account.base_account) {
      return 0;
    }

    return data.account.base_account.sequence || 0;
  } catch (e) {
    console.error(e);
  }
};

const getMessagesFromAccountTxs = txs => {
  const successfulTxs = txs.filter(tx => tx);

  return successfulTxs
    .reduce((messages, message) => {
      const messageType = message.split('/');
      const pieces =
        messageType.length === 1
          ? messageType[0].split('.')
          : messageType[1].split('.');
      return [
        ...messages,
        pieces.length > 0 ? pieces[pieces.length - 1] : pieces[0],
      ];
    }, [])
    .flat();
};

const getProposalsFromAccountTxs = txs => {
  const successfulTxs = txs.filter(tx => tx);

  return successfulTxs
    .reduce((messages, message) => {
      const messageType = message.split('/');
      const pieces =
        messageType.length === 1
          ? messageType[0].split('.')
          : messageType[1].split('.');
      const type = pieces.length > 0 ? pieces[pieces.length - 1] : pieces[0];

      if (type === 'MsgSubmitProposal' || type === 'submit_proposal') {
        return [...messages, message.value.content];
      }

      return messages;
    }, [])
    .flat();
};

module.exports = {
  fetchBalance,
  fetchAccountTxs,
  getProposalsFromAccountTxs,
  getMessagesFromAccountTxs,
  fetchAccountNonce,
};
