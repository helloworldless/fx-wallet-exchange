// Takes an ISO currency code and a number and formats it based on the user's locale
// ({currencyCode: String, amount: Number }) => String
const formatCurrency = ({ currencyCode, amount }) => {
  // Use undefined so that the locale (e.g. en-US) will be taken from the user's system locale
  return amount.toLocaleString(undefined, {
    style: 'currency',
    currency: currencyCode
  });
};

export { formatCurrency };
