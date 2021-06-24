const {
  fetchAccountTxs,
  getMessagesFromAccountTxs,
  getProposalsFromAccountTxs,
} = require('./modules/accounts');
const { sleep } = require('./utils/time');
const fs = require('fs').promises;

(async () => {
  let eligibleUsers = [];
  try {
    eligibleUsers = require('./json/eligible-users.json');
  } catch (e) {
    console.error('Please run the `yarn users` command first.');
    process.exit();
  }

  const users = [];
  const batchCount = 50;
  const sleepTime = 5000;

  for (let index = 0; index < eligibleUsers.length; index++) {
    if (index % batchCount === 0) {
      console.log(`Processed ${index + 1} out of ${eligibleUsers.length}`);
      await sleep(sleepTime);
    }

    const user = eligibleUsers[index];
    const accountTxs = await fetchAccountTxs(user.injAddress);
    const txs = getMessagesFromAccountTxs(accountTxs || []);
    const proposals = getProposalsFromAccountTxs(accountTxs || []);

    users.push({
      ...user,
      proposals,
      txs,
    });
  }

  await fs.writeFile(
    './json/eligible-users-with-txs.json',
    JSON.stringify(users, null, 1),
  );
})();
