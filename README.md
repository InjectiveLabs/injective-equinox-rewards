# 🌟 Injective Protocol - Equinox Rewards Calculator

---

## 📚 Getting Started

1. Clone the repository

```bash
$ git clone git@github.com:InjectiveLabs/injective-equinox-rewards.git
$ cd injective-equinox-rewards
$ yarn
```

*Note: The #3 step takes a long time so its not recommended to be run occasionally. Json files will be stored that have latest data, fetched on 22.06.2021. We should run the whole suite of commands once we finish Equinox Staking. So, if Equinox Staking is not ended, you can skip directly to #5 to get some useful information.*

1. Duplicate the `.env.example` to `.env` and fill the values
2. Get all eligible users
  
```bash
$ yarn users
```

3. Get all eligible user's transactions
  
```bash
$ yarn txs
```

4. Calculate users rewards 
   
```bash
$ yarn process
```

### Formula for calculating rewards

```bash
$baseDailyApyPercentage = 0.15
$baseDailyApy = $baseDailyApyPercentage / 365
$boosts = {0, 0.14} 
$dailyReturnsWithoutBoost = $baseDailyApy * $preStakedAmount
$dailyReturns = $preStakedAmount * ($baseDailyApyPercentage + $boosts) / 365


$daysOfEarlyAdopter = {0, 2}
$totalEarlyAdopter = $daysOfEarlyAdopter * $dailyReturnsWithoutBoost * 4

$daysOfPreStake = {0, 12}
$totalPreStake = $daysOfPreStake * $dailyReturnsWithoutBoost

$totalEquinoxDays = 97 days (from March 19 till 25th of June)
$totalDaysParticipating = $totalEquinoxDays - $daysJoinedSinceEquinoxStart
$totalRemaining = $dailyReturns * ($totalDaysParticipating - $daysOfPreStake - $daysOfEarlyAdopter)

$total = $totalPreStake + $totalEarlyAdopter + $totalRemaining
```
---

## ⛑ Support

Reach out to us at one of the following places!

- Website at <a href="https://injectiveprotocol.com" target="_blank">`injectiveprotocol.com`</a>
- Twitter at <a href="https://twitter.com/InjectiveLabs" target="_blank">`@InjectiveLabs`</a>

---

## 🔓 License
