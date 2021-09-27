const axios = require('./../utils/axios');
const BigNumber = require('bignumber.js');
const { WEI_FACTOR } = require('./../utils/config');

const fetchTotalFromDelegations = async injAddress => {
  try {
    const { data } = await axios.get(
      `https://testnet.lcd.injective.dev/cosmos/staking/v1beta1/delegations/${injAddress}`,
    );

    return data.delegation_responses
      .reduce((total, delegation) => {
        const amount =
          delegation.balance.denom === 'inj'
            ? new BigNumber(delegation.balance.amount)
                .dividedBy(WEI_FACTOR)
                .toFixed(4)
            : 0;
        return total.plus(amount);
      }, new BigNumber(0))
      .toFixed(4);
  } catch (e) {
    console.error(e);
  }
};

const fetchTotalFromRewards = async injAddress => {
  try {
    const { data } = await axios.get(
      `https://testnet.lcd.injective.dev/cosmos/distribution/v1beta1/delegators/${injAddress}/rewards`,
    );
    const totalInInj = data.total.find(t => t.denom === 'inj');

    return new BigNumber(totalInInj ? totalInInj.amount : 0)
      .dividedBy(WEI_FACTOR)
      .toFixed(4);
  } catch (e) {
    console.error(e);
  }
};

const fetchTotalFromReDelegations = async injAddress => {
  try {
    const { data } = await axios.get(
      `https://testnet.lcd.injective.dev/cosmos/staking/v1beta1/delegators/${injAddress}/redelegations`,
    );

    return data.redelegation_responses
      .reduce((total, reDelegation) => {
        const totalFromEntries = reDelegation.entries.reduce((total, curr) => {
          return total.plus(
            new BigNumber(curr.balance).dividedBy(WEI_FACTOR).toFixed(4),
          );
        }, new BigNumber(0));

        return total.plus(totalFromEntries);
      }, new BigNumber(0))
      .toFixed(4);
  } catch (e) {
    console.error(e);
  }
};

const fetchTotalFromUnbonding = async injAddress => {
  try {
    const { data } = await axios.get(
      `https://testnet.lcd.injective.dev/cosmos/staking/v1beta1/delegators/${injAddress}/unbonding_delegations`,
    );

    return data.unbonding_responses
      .reduce((total, unbonding) => {
        const totalFromEntries = unbonding.entries.reduce((total, curr) => {
          return total.plus(
            new BigNumber(curr.balance).dividedBy(WEI_FACTOR).toFixed(4),
          );
        }, new BigNumber(0));

        return total.plus(totalFromEntries);
      }, new BigNumber(0))
      .toFixed(4);
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  fetchTotalFromDelegations,
  fetchTotalFromRewards,
  fetchTotalFromReDelegations,
  fetchTotalFromUnbonding,
};
