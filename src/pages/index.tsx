import { zodResolver } from "@hookform/resolvers/zod";
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { toCurrency } from "~/utils/currency";

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  currencies,
}) => {
  return (
    <>
      <main>
        <CurrencyConverter currencies={currencies} />
      </main>
    </>
  );
};

export default Home;

const schema = z.object({
  amount: z.number().positive("Please enter an amount greater than 0"),
  from: z.string().min(3).max(5),
  to: z.string().min(3).max(5),
});

type FormData = z.infer<typeof schema>;

interface CurrencyConverterProps {
  currencies: Currency[];
}

const CurrencyConverter = ({ currencies }: CurrencyConverterProps) => {
  const [result, setResult] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 1, from: "usd", to: "rub" },
  });

  const onSubmit = handleSubmit(async ({ from, to, amount }, e) => {
    e?.preventDefault();
    const data = await fetchExchangeRateFromTo(from, to);
    const exchangeRate = data[to];
    if (exchangeRate && typeof exchangeRate === "number") {
      setResult(
        `${toCurrency(amount, from)} = ${toCurrency(exchangeRate * amount, to)}`
      );
    }
  });

  return (
    <form
      className="flex flex-col gap-y-3 p-4"
      onSubmit={(e) => void onSubmit(e)}
    >
      <Input
        {...register("amount", { valueAsNumber: true })}
        id="amount"
        label="Amount"
        type="number"
        error={errors.amount}
      />
      <Select
        {...register("from")}
        id="from"
        label="From"
        error={errors.from}
        options={currencies.map(({ acronym, name }) => ({
          value: acronym,
          name,
        }))}
      />
      <Select
        {...register("to")}
        id="to"
        label="To"
        error={errors.from}
        options={currencies.map(({ acronym, name }) => ({
          value: acronym,
          name,
        }))}
      />
      <Button type="submit">Convert</Button>
      <p className="mt-2 text-center text-xl font-bold text-slate-800">
        {result}
      </p>
    </form>
  );
};

interface Currency {
  acronym: string;
  name: string;
}

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

const fetchExchangeRateFromTo = async (from: string, to: string) => {
  const res = await fetch(
    `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}/${to}.json`
  );
  const data = (await res.json()) as Record<string, string | number>;
  return data;
};

interface Props {
  currencies: Currency[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const currencies = await fetchAllCurrencies();
  return {
    props: { currencies },
  };
};
