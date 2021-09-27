const {
  fetchAccountTxs,
  fetchAccountNonce,
  getMessagesFromAccountTxs,
  getProposalsFromAccountTxs,
} = require('./modules/accounts');
const { sleep } = require('./utils/time');
const fs = require('fs').promises;

(async () => {
  let eligibleUsersExistingTxs = [];
  try {
    eligibleUsersExistingTxs = require('./json/eligible-users-with-txs.json');
  } catch (e) {
    console.error('Please run the `yarn users` command first.');
    process.exit();
  }

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
    const nonce = await fetchAccountNonce(user.injAddress);
    const accountTxs = await fetchAccountTxs(user.injAddress);
    const existingTxs = eligibleUsersExistingTxs[index].txs;
    const txs = getMessagesFromAccountTxs(accountTxs || []);
    const proposals = getProposalsFromAccountTxs(accountTxs || []);
    const existingProposals = eligibleUsersExistingTxs[index].proposals;

    users.push({
      ...user,
      proposals: [...proposals, ...existingProposals],
      txs: [...txs, ...existingTxs],
      nonce: parseInt(nonce),
    });
  }

  await fs.writeFile(
    './json/eligible-users-with-txs.json',
    JSON.stringify(users, null, 1),
  );
})();
