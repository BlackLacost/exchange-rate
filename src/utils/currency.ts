export const toCurrency = (value: number, code: string) => {
  const result = new Intl.NumberFormat("en-En", {
    currency: code,
    style: "currency",
  }).format(value);
  return result;
};
