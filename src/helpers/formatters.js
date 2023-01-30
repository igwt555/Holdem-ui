import Moralis from "moralis"

export const n6 = new Intl.NumberFormat("en-us", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 6,
});

export const n4 = new Intl.NumberFormat("en-us", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 4,
});

export const c2 = new Intl.NumberFormat("en-us", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const sortFinalHand = (c1, c2, c3, c4, c5) => {
  const cTmp = [
    parseInt(c1, 10),
    parseInt(c2, 10),
    parseInt(c3, 10),
    parseInt(c4, 10),
    parseInt(c5, 10)
  ];

  return cTmp.sort((a, b) => a - b);
};

export const getRoundStatusText = (status) => {
  switch (parseInt(status, 10)) {
    case 0:
      return "Does not exist!";
    case 1:
      return "Flop dealt in:";
    case 2:
      return "Flop dealt.";
    case 3:
      return "Turn dealt in:";
    case 4:
      return "Turn dealt.";
    case 5:
      return "River dealt in:";
    case 6:
      return "River";
    default:
      return "Unknown";
  }
};

export const getDealRequestedText = (round) => {
  switch (parseInt(round, 10)) {
    case 1:
    case 2:
      return "Flop";
    case 3:
    case 4:
      return "Turn";
    case 5:
    case 6:
      return "River";
    default:
      return "Unknown";
  }
};

/**
 * Returns a string of form "abc...xyz"
 * @param {string} str string to string
 * @param {number} n number of chars to keep at front/end
 * @returns {string}
 */
export const getEllipsisTxt = (str, n = 6) => {
  if (str) {
    return `${str.substr(0, n)}...${str.substr(str.length - n, str.length)}`;
  }
  return "";
};

export const tokenValue = (value, decimals) => (decimals ? value / Math.pow(10, decimals) : value);

/**
 * Return a formatted string with the symbol at the end
 * @param {number} value integer value
 * @param {number} decimals number of decimals
 * @param {string} symbol token symbol
 * @returns {string}
 */
export const tokenValueTxt = (value, decimals, symbol) => `${n4.format(tokenValue(value, decimals))} ${symbol}`;

export const weiToEthDp = (n, d) => {
  const f = Math.pow(10, d)
  const eth = parseFloat(Moralis.Units.FromWei(n !== null ? n : "0"))
  return Math.ceil(eth * f) / f
}
