**THE FORMULA USED IN THE CALCULATION**

```
$baseDailyApy = 15 / 365 / 100
$baseCompoundedDailyApy = 10 ^ (log10 1.15 / 365)
$boosts = {1.00, 1.14} 
$dailyAPYWithRewards = $baseDailyApy * $boosts
$dailyReturns = $preStakedAmount * $dailyApyWithRewards
$dailyCompoundedReturns = $baseCompoundedDailyApy * $boosts * $preStakedAmount

$daysOfEarlyAdopter = {0, 2}
$totalEarlyAdopter = $daysOfEarlyAdopter * $dailyReturns * 4

$daysOfPreStake = {0, 12}
$totalPreStake = $daysOfPreStake * $dailyReturns

$totalEquinoxDays = 97 days (from March 19 till 25th of June)
$totalDaysParticipating = $totalEquinoxDays - $daysJoinedSinceEquinoxStart
$totalRemaining = $dailyCompoundedReturns * ($totalDaysParticipating - $daysOfPreStake - $daysOfEarlyAdopter)

$total = $totalPreStake + $totalEarlyAdopter + $totalRemaining
```

**THINGS THAT APPLY WHEN CALCULATING THE REWARDS**

- Given that the `baseYearlyApy = 15%`, from the formula for compound interest over time (`x = 10 ^ (log(1 + x) / 365)`, for the above case, `baseYearlyApy = 0.15`, the `dailyCompoundedInterestRate = 10 ^ (log(1 + 0.15) / 365 = 1.00038272`. 
- User earns only the `baseEarlyApy` during the pre-stake period, i.e `dailyApyForPreStake = 15 / 100 / 365 = 0.0004109589 `, 
- User earns 4 times the `baseEarlyApy` during the pre-stake period, i.e `dailyApyForEarlyAdopters = 4 * (15 / 100 / 365) = 0.00164383561`
- User earns `(dailyCompoundedInterestRate ^ days - 1) * boosts` during the remaining period, where `dailyCompoundedInterestRate` is shown above, and `days` are the days the user participated in equinox staking (exlucding the pre-take and early adopters period), and where `boosts` are calculated based on the tasks the user peformed.

**EXAMPLE USAGE OF THE FORMULA/CONDITIONS ABOVE**

Lets say a user deposited (pre-staked): 
```
- 1000 INJ on 17th of March, [deposit #1]
- 500 INJ on 29th of March, [deposit #2]
- 2000 INJ on 7th of April  [deposit #3]
```

Lets say the user completed all of the tasks except the special task: 
```
"rewards": {
   "claim": true,
   "re-delegate": true,
   "governance": true,
   "market": true,
   "market-proposal": true,
   "special": false
  },
```
Giving him a total boost of 11%.

**DEPOSIT #1**
```
- 1000 INJ deposited

- The user, FOR THIS DEPOSIT, was pre-staking the whole period, i.e daysOfPreStake = 12, giving him totalPreStake = 12 * 1000 * dailyApyForPreStake = 12 * 1000 * 0.0004109589 = 4.9315068 INJ

- The user, FOR THIS DEPOSIT, was an early adopter the whole period, i.e, daysOfEarlyAdopters = 2, giving him totalEarlyAdopter = 2 * 1000 * dailyApyForEarlyAdopters = 2 * 1000 * 0.00164383561 = 3.28767122 INJ

- The user, FOR THIS DEPOSIT, participated in Equinox Staking for the whole period, i.e 87 days, giving him totalRemaining = (dailyCompoundedInterestRate ^ days - 1) * boosts * 1000 =  (1.00038272 ^ 87 - 1) * 1.11 * 1000 = 37.5741565448 INJ

- This means, for this Deposit #1, the user got: Total = 4.9315068 + 3.28767122 + 37.5741565448 = 45.7933345648 INJ

```

**DEPOSIT #2**
```
- 500 INJ deposited

- The user, FOR THIS DEPOSIT, was not pre-staking, i.e daysOfPreStake = 0, giving him totalPreStake = 0 * 1000 * dailyApyForPreStake = 12 * 1000 * 0.0004109589 = 0 INJ

- The user, FOR THIS DEPOSIT, was an early adopter the whole period, i.e, daysOfEarlyAdopters = 2, giving him totalEarlyAdopter = 2 * 1000 * dailyApyForEarlyAdopters = 2 * 500 * 0.00164383561 = 1.64383561 INJ

- The user, FOR THIS DEPOSIT, participated in Equinox Staking for the whole period, i.e 87 days, giving him totalRemaining = (dailyCompoundedInterestRate ^ days - 1) * boosts * 500 =  (1.00038272 ^ 87 - 1) * 1.11 * 500 = 18.7870782724 INJ

- This means, for this Deposit #2, the user got: Total = 0 + 1.64383561 + 18.7870782724 = 20.4309138824 INJ
```

**DEPOSIT #3**
```
- 2000 INJ deposited

- The user, FOR THIS DEPOSIT, was not pre-staking, i.e daysOfPreStake = 0, giving him totalPreStake = 0 * 2000 * dailyApyForPreStake = 0 * 1000 * 0.0004109589 = 0 INJ

- The user, FOR THIS DEPOSIT, was not an early adopter, i.e, daysOfEarlyAdopters = 0, giving him totalEarlyAdopter = 2 * 1000 * dailyApyForEarlyAdopters = 0 * 2000 * 0.00164383561 = 0 INJ

- The user, FOR THIS DEPOSIT, participated in Equinox Staking for total of i.e 79 days, giving him totalRemaining = (dailyCompoundedInterestRate ^ days - 1) * boosts * 2000 =  (1.00038272 ^ 79 - 1) * 1.11 * 2000 = 68.1332068807 INJ

- This means, for this Deposit #3, the user got: Total = 0 + 0 + 68.1332068807 = 68.1332068807
```

So, this user, **IN TOTAL**, got: `45.7933345648 + 20.4309138824 + 68.1332068807 = 134.357455328 INJ`
