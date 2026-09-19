export const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (num) =>
  num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
