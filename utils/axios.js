const axios = require('axios').default;
const axiosRetry = require('axios-retry');

axiosRetry(axios, { retries: 6, retryDelay: axiosRetry.exponentialDelay });

module.exports = axios;
