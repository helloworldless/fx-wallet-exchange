// Takes an ISO currency code and a number and formats it based on the user's locale
// ({currencyCode: String, amount: Number }) => String
const formatCurrency = ({ currencyCode, amount }) => {
  // Use undefined so that the locale (e.g. en-US) will be taken from the user's system locale
  return amount.toLocaleString(undefined, {
    style: 'currency',
    currency: currencyCode
  });
};

const getAttribute = attr => event => event.currentTarget.getAttribute(attr);
const getDataIndex = getAttribute('data-index');

const parseI = value => parseInt(value, 10);

const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

const getIndex = pipe(
  getDataIndex,
  parseI
);

/**
 * Decimal adjustment of a number.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round$revision/1383484#Decimal_rounding
 *
 * @param {String}  type  The type of adjustment.
 * @param {Number}  value The number.
 * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
 * @returns {Number} The adjusted value.
 */
const decimalAdjust = (type, value, exp) => {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (
    value === null ||
    isNaN(value) ||
    !(typeof exp === 'number' && exp % 1 === 0)
  ) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp));
};

const round = (value, exp) => {
  return decimalAdjust('round', value, exp);
};

export { formatCurrency, getIndex, round };
