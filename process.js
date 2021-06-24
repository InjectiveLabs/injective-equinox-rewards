const BigNumber = require('bignumber.js');
const fs = require('fs').promises;
const { fromUnixTime } = require('date-fns');
const {
  fetchSpotMarkets,
  fetchDerivativeMarkets,
} = require('./modules/exchange');
const {
  getDaysForATimestampInAPeriod,
  getDaysSinceTimestamp,
  getDaysSince,
} = require('./utils/time');
const {
  Reward,
  getRewardsObjects,
  getTotalBoost,
  checkMarketLaunchBoost,
  checkClaimBoost,
  checkGovernanceBoost,
  checkProposalBoost,
  checkSpecialBoost,
  checkReDelegateBoost,
} = require('./utils/boosts');

/** Pre-Defined Values */
const dailyApy = new BigNumber(15).dividedBy(100).dividedBy(365);
const dailyCompoundedInterestRate = new BigNumber(1.00038272); // x = 10 ^ (log10 1.15 / 365)
const equinoxStartDate = new Date('March 19, 21 00:00:00 UTC');
const [preStakePeriodStart, preStakePeriodEnd] = [
  new Date('March 17, 21 00:00:00 UTC'),
  new Date('March 29, 21 00:00:00 UTC'),
];
const [dailyAdopterPeriodStart, dailyAdopterPeriodEnd] = [
  new Date('March 29, 21 00:00:00 UTC'),
  new Date('March 31, 21 00:00:00 UTC'),
];

(async () => {
  let users = [];
  try {
    users = require('./json/eligible-users-with-txs.json');
  } catch (e) {
    console.error('Please run the `yarn users` and `yarn txs` commands first.');
    process.exit();
  }

  const spotMarkets = await fetchSpotMarkets();
  const derivativeMarkets = await fetchDerivativeMarkets();

  const daysSinceEquinoxStart = getDaysSince(equinoxStartDate);
  const usersWithRewards = await Promise.all(
    users.map(async user => {
      const { rewards, rewardsBoost } = getRewardsObjects();
      rewards[Reward.ReDelegate] = checkReDelegateBoost(user.txs);
      rewards[Reward.Claim] = checkClaimBoost(user.txs);
      rewards[Reward.Governance] = checkGovernanceBoost(user.txs);
      rewards[Reward.NewMarket] = checkProposalBoost(user.txs);
      rewards[Reward.MarketProposal] = checkMarketLaunchBoost(
        user.proposals,
        spotMarkets,
        derivativeMarkets,
      );
      rewards[Reward.Special] = checkSpecialBoost(user.txs);

      const boost = getTotalBoost(rewards, rewardsBoost);
      const boostFactor = boost.plus(1);
      let totalEarlyAdopter = new BigNumber(0);
      let totalPreStake = new BigNumber(0);
      let totalRemaining = new BigNumber(0);
      let total = new BigNumber(0);

      for (const deposit of user.deposits || []) {
        const dailyBaseReturns = dailyApy.times(deposit.amount);
        const userTimestamp = fromUnixTime(deposit.timestamp).getTime();
        const totalPreStakeDays = getDaysForATimestampInAPeriod(
          preStakePeriodStart,
          preStakePeriodEnd,
          userTimestamp,
        );
        const totalEarlyAdopterDays = getDaysForATimestampInAPeriod(
          dailyAdopterPeriodStart,
          dailyAdopterPeriodEnd,
          userTimestamp,
        );
        const totalDaysParticipating =
          daysSinceEquinoxStart -
          getDaysSinceTimestamp(equinoxStartDate, userTimestamp);

        const earlyAdopter = totalEarlyAdopterDays * dailyBaseReturns * 4;
        const preStake = totalPreStakeDays * dailyBaseReturns;
        const remaining = new BigNumber(deposit.amount).times(
          dailyCompoundedInterestRate.pow(totalDaysParticipating) - 1,
        );
        const remainingWithBoost = remaining.times(boostFactor);
        const totalForCurrentDeposit = new BigNumber(0)
          .plus(earlyAdopter)
          .plus(preStake)
          .plus(remainingWithBoost);

        totalEarlyAdopter = totalEarlyAdopter.plus(earlyAdopter);
        totalPreStake = totalPreStake.plus(preStake);
        totalRemaining = totalRemaining.plus(remainingWithBoost);
        total = total.plus(totalForCurrentDeposit);
      }

      delete user.proposals;

      return {
        ...user,
        rewards,
        totalPreStake,
        totalEarlyAdopter,
        totalRemaining,
        total,
        boost: boost.toNumber(),
        percentageBoost: `${boost.times(100).toNumber()}%`,
      };
    }),
  );

  usersWithRewards.sort((a, b) => b.total - a.total);

  await fs.writeFile(
    './json/eligible-users-with-rewards.json',
    JSON.stringify(usersWithRewards, null, 1),
  );

  const total = usersWithRewards.reduce((total, user) => {
    return total.plus(user.total);
  }, new BigNumber(0));
  const averageBoost = usersWithRewards.reduce((total, user) => {
    return total.plus(user.boost);
  }, new BigNumber(0));

  console.log(`Total eligible addresses: ${usersWithRewards.length}`);
  console.log(`Total rewards: ${total} INJ`);
  console.log(
    `Avg. boost: ${averageBoost
      .div(usersWithRewards.length)
      .times(100)
      .toFixed(4)}%`,
  );
})();
