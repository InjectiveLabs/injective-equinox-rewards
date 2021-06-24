const getDaysSince = startDate => {
  const today = new Date().getTime();
  const difference = today - startDate.getTime();

  return Math.floor(difference / 1000 / 60 / 60 / 24);
};

const getDaysSinceTimestamp = (startDate, timestamp) => {
  const difference = timestamp - startDate.getTime();

  return Math.floor(difference / 1000 / 60 / 60 / 24);
};

const getDaysForATimestampInAPeriod = (start, end, timestamp) => {
  const secondsInADay = 60 * 60 * 24;
  const millisecondsInADay = secondsInADay * 1000;

  const startStartOfTheDayTimestamp = start.getTime();
  const startEndOfTheDayTimestamp = start.getTime() + millisecondsInADay;

  const endStartOfTheDayTimestamp = end.getTime();
  const endEndOfTheDayTimestamp = end.getTime() + millisecondsInADay;

  const daysBetweenStartAndEnd = Math.floor(
    (endStartOfTheDayTimestamp - startStartOfTheDayTimestamp) /
      millisecondsInADay,
  );

  if (timestamp > endEndOfTheDayTimestamp) {
    return 0;
  }

  if (timestamp < startEndOfTheDayTimestamp) {
    return daysBetweenStartAndEnd;
  }

  if (
    timestamp > startEndOfTheDayTimestamp &&
    timestamp < endEndOfTheDayTimestamp
  ) {
    return Math.floor(
      (endEndOfTheDayTimestamp - timestamp) / millisecondsInADay,
    );
  }
};

const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout));

module.exports = {
  getDaysSince,
  sleep,
  getDaysSinceTimestamp,
  getDaysForATimestampInAPeriod,
};
