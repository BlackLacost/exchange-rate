import { type Currency } from "~/pages";

export const toCurrency = (value: number, code: string) => {
  const result = new Intl.NumberFormat("en-En", {
    currency: code,
    maximumFractionDigits: 2,
  }).format(value);
  return result;
};

export const toCurrencyWithName = (
  value: number,
  code: string,
  currencies: Currency[]
) => {
  return `${toCurrency(value, code)} ${
    currencies.find((c) => c.acronym === code)?.name ?? code
  }`;
};
