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
