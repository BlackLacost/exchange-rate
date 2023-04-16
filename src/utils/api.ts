export const fetchAllCurrencies = async () => {
  const res = await fetch(
    "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json"
  );
  const data = (await res.json()) as Record<string, string>;
  return Object.entries(data).map(([k, v]) => ({
    value: k,
    name: v,
  }));
};

export const fetchExchangeRateFromTo = async (from: string, to: string) => {
  const res = await fetch(
    `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}/${to}.json`
  );
  const data = (await res.json()) as Record<string, string | number>;
  return data;
};
