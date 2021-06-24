const { bech32 } = require('bech32');
const { Address } = require('ethereumjs-util');

const getInjAddressFromAddress = address => {
  const addressBuffer = Address.fromString(address.toString()).toBuffer();

  return bech32.encode('inj', bech32.toWords(addressBuffer));
};

module.exports = {
  getInjAddressFromAddress,
};
