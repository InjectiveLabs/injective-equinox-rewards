const axios = require('./../utils/axios');
const BigNumber = require('bignumber.js');
const { WEI_FACTOR } = require('./../utils/config');

const fetchProposals = async () => {
  try {
    const { data } = await axios.get(
      `https://staking-lcd.injective.network/cosmos/gov/v1beta1/proposals`,
    );

    return data.proposals.map(proposal => {
      return proposal.proposal_id;
    });
  } catch (e) {
    console.error(e);
  }
};

const fetchProposalsDeposits = async proposalIds => {
  try {
    return await Promise.all(
      proposalIds.map(async proposalId => {
        const { data } = await axios.get(
          `https://staking-lcd.injective.network/cosmos/gov/v1beta1/proposals/${proposalId}/deposits`,
        );

        return data.deposits.map(deposit => {
          const totalDeposit = deposit.amount.find(a => a.denom === 'inj');

          return {
            depositor: deposit.depositor,
            depositInWei: totalDeposit.amount,
            deposit: new BigNumber(totalDeposit.amount)
              .dividedBy(WEI_FACTOR)
              .toFixed(4),
          };
        });
      }),
    );
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  fetchProposals,
  fetchProposalsDeposits,
};
