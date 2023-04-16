import { toCurrency } from "~/utils/currency";

export const fetchAllCurrencies = async () => {
  const res = await fetch(
    "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json"
  );
  const data = (await res.json()) as Record<string, string>;
  return (
    Object.entries(data)
      // Отфильтровал валюты, которые не работают с Intl.number
      .filter(([value]) => {
        try {
          const result = toCurrency(100, value);
          return Boolean(result);
        } catch (e) {
          return false;
        }
      })
      .map(([value, name]) => ({ value, name }))
  );
};

export const fetchExchangeRateFromTo = async (from: string, to: string) => {
  const res = await fetch(
    `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}/${to}.json`
  );
  const data = (await res.json()) as Record<string, string | number>;
  return data;
};
