const getParts = (date, timeZone) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timeZone || 'UTC',
    year: 'numeric',
    month: 'long',
  }).formatToParts(new Date(date));

  return Object.fromEntries(parts
    .filter(({ type }) => type === 'month' || type === 'year')
    .map(({ type, value }) => [type, value]));
};

export const getMonthLabel = (date = new Date(), timeZone = 'UTC') => {
  const { month, year } = getParts(date, timeZone);
  return `${month} ${year}`;
};

export const isDateInBudgetMonth = (date, budgetMonth, timeZone = 'UTC') =>
  getMonthLabel(date, timeZone) === budgetMonth;
