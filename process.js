const BigNumber = require('bignumber.js');
const fs = require('fs').promises;
const { fromUnixTime } = require('date-fns');
const {
  getDaysForATimestampInAPeriod,
  getDaysSinceTimestamp,
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
const dailyApyPercentage = new BigNumber(15).dividedBy(100);
const dailyApy = dailyApyPercentage.dividedBy(365);
const equinoxStartDate = new Date('March 19, 21 00:00:00 UTC');
const equinoxEndDate = new Date('Jun 25, 21 00:00:00 UTC');
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

  const daysSinceEquinoxStart = getDaysSinceTimestamp(
    equinoxStartDate,
    equinoxEndDate.getTime(),
  );

  const usersWithRewards = await Promise.all(
    users.map(async user => {
      const { rewards, rewardsBoost } = getRewardsObjects();
      rewards[Reward.ReDelegate] = checkReDelegateBoost(user.txs);
      rewards[Reward.Claim] = checkClaimBoost(user.txs);
      rewards[Reward.Governance] = checkGovernanceBoost(user.txs);
      rewards[Reward.NewMarket] = checkProposalBoost(user.txs);
      rewards[Reward.MarketProposal] = checkMarketLaunchBoost(user.proposals);
      rewards[Reward.Special] = checkSpecialBoost(user.nonce);

      const boost = getTotalBoost(rewards, rewardsBoost);
      let totalEarlyAdopter = new BigNumber(0);
      let totalPreStake = new BigNumber(0);
      let totalRemaining = new BigNumber(0);
      let total = new BigNumber(0);

      for (const deposit of user.deposits || []) {
        const dailyBaseReturns = dailyApy.times(deposit.amount);
        const dailyBaseReturnsWithBoost = dailyApyPercentage
          .plus(boost)
          .dividedBy(365)
          .times(deposit.amount);

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
        const totalDaysRemaining =
          totalDaysParticipating - totalEarlyAdopterDays - totalPreStakeDays;

        const earlyAdopter = totalEarlyAdopterDays * dailyBaseReturns * 4;
        const preStake = totalPreStakeDays * dailyBaseReturns;
        const remaining = dailyBaseReturnsWithBoost.times(totalDaysRemaining);
        const totalForCurrentDeposit = new BigNumber(0)
          .plus(earlyAdopter)
          .plus(preStake)
          .plus(remaining);

        totalEarlyAdopter = totalEarlyAdopter.plus(earlyAdopter);
        totalPreStake = totalPreStake.plus(preStake);
        totalRemaining = totalRemaining.plus(remaining);
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
