require('dotenv').config();
const BigNumber = require('bignumber.js');

module.exports = {
  DEPOSIT_MANAGER_ADDRESS: process.env.DEPOSIT_MANAGER_ADDRESS,
  START_BLOCK: process.env.START_BLOCK,
  ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
  WEI_FACTOR: new BigNumber(10).pow(18),
};
