const axios = require('./../utils/axios');

const fetchValidators = async () => {
  try {
    const { data } = await axios.get(
      'https://testnet.lcd.injective.dev/cosmos/staking/v1beta1/validators',
    );

    return data.validators.map(validator => validator.operator_address);
  } catch (e) {
    console.error(e);
  }
};

const fetchValidatorDelegators = async validator => {
  try {
    const { data } = await axios.get(
      `https://testnet.lcd.injective.dev/cosmos/staking/v1beta1/validators/${validator}/delegations`,
    );

    return {
      result: data.delegation_responses,
      pagination: pagination.next_key,
    };
  } catch (e) {
    console.error(e);
  }
};

const fetchPaginatedValidatorDelegators = async (validator, key) => {
  try {
    const { data } = await axios.get(
      `https://testnet.lcd.injective.dev/cosmos/staking/v1beta1/validators/${validator}/delegations?pagination.key=${key}`,
    );

    return {
      result: data.delegation_responses,
      pagination: pagination.next_key,
    };
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  fetchValidators,
  fetchValidatorDelegators,
  fetchPaginatedValidatorDelegators,
};
