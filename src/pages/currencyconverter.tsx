import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import {
  CurrencyConverter,
  type Currency,
} from "~/components/currency-converter";

const CurrencyConverterPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ currencies, amount, from, to }) => {
  return (
    <>
      <main>
        <CurrencyConverter
          currencies={currencies}
          amount={amount}
          from={from}
          to={to}
        />
      </main>
    </>
  );
};

export default CurrencyConverterPage;

interface FetchAllCurrenciesResponse {
  [key: string]: string;
}

const fetchAllCurrencies = async () => {
  const res = await fetch(
    "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json"
  );
  const data = (await res.json()) as FetchAllCurrenciesResponse;
  return Object.entries(data).map(([k, v]) => ({
    acronym: k,
    name: v,
  }));
};

interface Props {
  currencies: Currency[];
  amount: number;
  from: string;
  to: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const { amount, from, to } = query;
  const currencies = await fetchAllCurrencies();

  return {
    props: {
      currencies,
      amount: amount ? Number(amount) : 1,
      from: from ? String(from) : "usd",
      to: to ? String(to) : "rub",
    },
  };
};
