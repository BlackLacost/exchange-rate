import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import {
  CurrencyConverter,
  type Currency,
} from "~/components/currency-converter";
import { fetchAllCurrencies } from "~/utils/api";

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
