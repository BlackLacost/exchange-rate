import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import {
  CurrencyConverter,
  type Currency,
} from "~/components/currency-converter";

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ currencies, from, to, amount }) => {
  return (
    <>
      <main>
        <CurrencyConverter
          currencies={currencies}
          from={from}
          to={to}
          amount={amount}
        />
      </main>
    </>
  );
};

export default Home;

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
  amount: number | null;
  from: string | null;
  to: string | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const { amount, from, to } = query;
  const currencies = await fetchAllCurrencies();

  return {
    props: {
      currencies,
      amount: amount ? Number(amount) : null,
      from: from ? String(from) : null,
      to: to ? String(to) : null,
    },
  };
};
