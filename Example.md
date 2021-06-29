### THE FORMULA USED IN THE CALCULATION**

```bash
$baseDailyApy = 15 / 365 / 100
$boosts = {1.00, 1.14} 
$dailyAPYWithRewards = $baseDailyApy * $boosts
$dailyReturns = $preStakedAmount * $dailyApyWithRewards

$daysOfEarlyAdopter = {0, 2}
$totalEarlyAdopter = $daysOfEarlyAdopter * $dailyReturns * 4

$daysOfPreStake = {0, 12}
$totalPreStake = $daysOfPreStake * $dailyReturns

$totalEquinoxDays = 97 days (from March 19 till 25th of June)
$totalDaysParticipating = $totalEquinoxDays - $daysJoinedSinceEquinoxStart
$totalRemaining = $dailyReturns * ($totalDaysParticipating - $daysOfPreStake - $daysOfEarlyAdopter)

$total = $totalPreStake + $totalEarlyAdopter + $totalRemaining
```

### THINGS THAT APPLY WHEN CALCULATING THE REWARDS**

- Given that the `baseYearlyApy = 15%`, 
- User earns only the `baseEarlyApy` during the pre-stake period, i.e `dailyApyForPreStake = 15 / 100 / 365 = 0.0004109589`, 
- User earns 4 times the `baseEarlyApy` during the pre-stake period, i.e `dailyApyForEarlyAdopters = 4 * (15 / 100 / 365) = 0.00164383561`
- User earns only the `baseEarlyApy * boost` during the pre-stake period, i.e `dailyApy = 15 / 100 / 365 * boost = 0.0004109589 * boosts`, 
---

## EXAMPLE USAGE OF THE FORMULA/CONDITIONS ABOVE

Lets say a user deposited (pre-staked): 
```bash
# 1000 INJ on 17th of March, [deposit #1]
# 500 INJ on 29th of March, [deposit #2]
# 2000 INJ on 7th of April  [deposit #3]
```

Lets say the user completed all of the tasks except the special task: 
```js
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

### DEPOSIT #1
```bash
# 1000 INJ deposited

# The user, FOR THIS DEPOSIT, was pre-staking the whole period, 
# i.e daysOfPreStake = 12, giving him totalPreStake = 12 * 1000 * dailyApyForPreStake = 12 * 1000 * 0.0004109589 = 4.9315068 INJ

# The user, FOR THIS DEPOSIT, was an early adopter the whole period, 
# i.e, daysOfEarlyAdopters = 2, giving him totalEarlyAdopter = 2 * 1000 * dailyApyForEarlyAdopters = 2 * 1000 * 0.00164383561 = 3.28767122 INJ

# The user, FOR THIS DEPOSIT, participated in Equinox Staking for the whole period, 
# i.e 87 days, giving him totalRemaining = dailyApy * days * 1000 =  0.0004109589 * 87 * 1.11 * 1000 = 39.686300973 INJ

# This means, for this Deposit #1, the user got: Total = 4.9315068 + 3.28767122 + 39.686300973 = 47.905478993 INJ

```

### DEPOSIT #2
```bash
# 500 INJ deposited

# The user, FOR THIS DEPOSIT, was not pre-staking, 
# i.e daysOfPreStake = 0, giving him totalPreStake = 0 * 1000 * dailyApyForPreStake = 12 * 1000 * 0.0004109589 = 0 INJ

# The user, FOR THIS DEPOSIT, was an early adopter the whole period, 
# i.e, daysOfEarlyAdopters = 2, giving him totalEarlyAdopter = 2 * 1000 * dailyApyForEarlyAdopters = 2 * 500 * 0.00164383561 = 1.64383561 INJ

# The user, FOR THIS DEPOSIT, participated in Equinox Staking for the whole period, 
# i.e 87 days, giving him totalRemaining = dailyApy * days * boosts * 500 =  87 * 0.0004109589 * 1.11 * 500 = 19.8431504865 INJ

# This means, for this Deposit #2, the user got: Total = 0 + 1.64383561 + 19.8431504865 = 21.4869860965 INJ
```

### DEPOSIT #3
```bash
# 2000 INJ deposited

# The user, FOR THIS DEPOSIT, was not pre-staking, 
# i.e daysOfPreStake = 0, giving him totalPreStake = 0 * 2000 * dailyApyForPreStake = 0 * 1000 * 0.0004109589 = 0 INJ

#The user, FOR THIS DEPOSIT, was not an early adopter, 
# i.e, daysOfEarlyAdopters = 0, giving him totalEarlyAdopter = 2 * 1000 * dailyApyForEarlyAdopters = 0 * 2000 * 0.00164383561 = 0 INJ

# The user, FOR THIS DEPOSIT, participated in Equinox Staking for total of 
# i.e 79 days, giving him totalRemaining =  dailyApy * days * boosts * boosts * 2000 = 0.0004109589 * 79 * 1.11 * 2000 = 72.073971882 INJ

# This means, for this Deposit #3, the user got: Total = 0 + 0 + 72.073971882 = 72.073971882
```

### Total
So, this user, **IN TOTAL**, got: `47.905478993 + 21.4869860965 + 72.073971882 = 141.466436972 INJ`
