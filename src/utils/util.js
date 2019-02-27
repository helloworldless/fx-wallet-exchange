// Takes an ISO currency code and a number and formats it based on the user's locale
// ({currencyCode: String, amount: Number }) => String
const formatCurrency = ({ currencyCode, amount }) => {
  // Use undefined so that the locale (e.g. en-US) will be taken from the user's system locale
  return amount.toLocaleString(undefined, {
    style: 'currency',
    currency: currencyCode
  });
};

const createPair = (from, to) => ({ from, to });

const getAttribute = attr => event => event.currentTarget.getAttribute(attr);
const getDataIndex = getAttribute('data-index');

const parseI = value => parseInt(value, 10);

const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

const getIndex = pipe(
  getDataIndex,
  parseI
);

export { formatCurrency, createPair, getIndex };
