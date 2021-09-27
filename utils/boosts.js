const BigNumber = require('bignumber.js');

const Reward = {
  Claim: 'claim',
  ReDelegate: 're-delegate',
  Governance: 'governance',
  NewMarket: 'market',
  MarketProposal: 'market-proposal',
  Special: 'special',
};

const RewardMessageTypes = {
  Delegate: 'delegate',
  MsgDelegate: 'MsgDelegate',
  Vote: 'vote',
  MsgVote: 'MsgVote',
  Claim: 'withdraw_delegator_reward',
  MsgClaim: 'MsgWithdrawDelegatorReward',
  MarketProposal: 'submit_proposal',
  MsgMarketProposal: 'MsgSubmitProposal',
  Unbond: 'begin_unbonding',
  MsgUnbond: 'MsgBegingUnbonding',
  ReDelegate: 'begin_redelegate',
  MsgReDelegate: 'MsgBeginRedelegate',
  LimitSpotOrder: 'MsgCreateSpotLimitOrder',
  MarketSpotOrder: 'MsgCreateSpotMarketOrder',
  LimitDerivativeOrder: 'MsgCreateDerivativeLimitOrder',
  MarketDerivativeOrder: 'MsgCreateDerivativeMarketOrder',
};

const getRewardsObjects = () => {
  const rewards = {
    [Reward.Claim]: false,
    [Reward.ReDelegate]: false,
    [Reward.Governance]: false,
    [Reward.NewMarket]: false,
    [Reward.MarketProposal]: false,
    [Reward.Special]: false,
  };

  const rewardsBoost = {
    [Reward.Claim]: 0.005,
    [Reward.ReDelegate]: 0.005,
    [Reward.Governance]: 0.02,
    [Reward.NewMarket]: 0.03,
    [Reward.MarketProposal]: 0.05,
    [Reward.Special]: 0.03,
  };

  return { rewards, rewardsBoost };
};

const getTotalBoost = (rewards, rewardsBoost) => {
  return Object.keys(rewards).reduce((totalApy, reward) => {
    return totalApy.plus(rewards[reward] ? rewardsBoost[reward] : 0);
  }, new BigNumber(0));
};

const checkClaimBoost = messageTypes => {
  const userClaimed =
    messageTypes.includes(RewardMessageTypes.Claim) ||
    messageTypes.includes(RewardMessageTypes.MsgClaim);
  const userDelegations = messageTypes.filter(
    m =>
      m === RewardMessageTypes.Delegate || m === RewardMessageTypes.MsgDelegate,
  );

  const userUnBonded =
    messageTypes.includes(RewardMessageTypes.Unbond) ||
    messageTypes.includes(RewardMessageTypes.MsgUnbond);

  return userClaimed && userDelegations.length >= 2 && userUnBonded;
};

const checkGovernanceBoost = messageTypes => {
  const userVotes = messageTypes.filter(
    m => m === RewardMessageTypes.Vote || m === RewardMessageTypes.MsgVote,
  );

  return userVotes.length >= 2;
};

const checkProposalBoost = messageTypes => {
  return (
    messageTypes.includes(RewardMessageTypes.MsgMarketProposal) ||
    messageTypes.includes(RewardMessageTypes.MarketProposal)
  );
};

const checkReDelegateBoost = messageTypes => {
  return (
    messageTypes.includes(RewardMessageTypes.MsgReDelegate) ||
    messageTypes.includes(RewardMessageTypes.ReDelegate)
  );
};

const checkMarketLaunchBoost = proposals => {
  return proposals.some(proposal => {
    const proposalIsPerpetualMarket =
      proposal['@type'] ===
      '/injective.exchange.v1beta1.PerpetualMarketLaunchProposal';
    const proposalIsExpiryFuturesMarket =
      proposal['@type'] ===
      '/injective.exchange.v1beta1.ExpiryFuturesLaunchProposal';
    const proposalIsSpotMarket =
      proposal['@type'] ===
      '/injective.exchange.v1beta1.SpotMarketLaunchProposal';

    return (
      proposalIsPerpetualMarket ||
      proposalIsExpiryFuturesMarket ||
      proposalIsSpotMarket
    );
  });
};

const checkSpecialBoost = nonce => {
  return nonce >= 50;
};

module.exports = {
  Reward,
  getTotalBoost,
  getRewardsObjects,

  checkMarketLaunchBoost,
  checkReDelegateBoost,
  checkClaimBoost,
  checkGovernanceBoost,
  checkProposalBoost,
  checkSpecialBoost,
};
