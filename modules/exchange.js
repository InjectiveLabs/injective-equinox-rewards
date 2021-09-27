const axios = require('./../utils/axios');

const fetchSpotMarkets = async () => {
  try {
    const { data } = await axios.get(
      `https://testnet.lcd.injective.dev/injective/exchange/v1beta1/spot/markets?status=1`,
    );

    return data.markets;
  } catch (e) {
    console.error(e);
  }
};

const fetchDerivativeMarkets = async () => {
  try {
    const { data } = await axios.get(
      `https://testnet.lcd.injective.dev/injective/exchange/v1beta1/derivative/markets?status=1`,
    );

    return data.markets;
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  fetchSpotMarkets,
  fetchDerivativeMarkets,
};
