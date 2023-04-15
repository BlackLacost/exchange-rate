import { zodResolver } from "@hookform/resolvers/zod";
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SwitchIcon } from "~/components/switchIcon";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { toCurrencyWithName } from "~/utils/currency";

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
  const [exchangeRate, setExchangeRate] = useState<number>();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 1, from: "usd", to: "rub" },
  });

  const onSubmit = handleSubmit(async ({ from, to }, e) => {
    e?.preventDefault();
    const data = await fetchExchangeRateFromTo(from, to);
    const exchangeRate = data[to];
    if (exchangeRate && typeof exchangeRate === "number") {
      setExchangeRate(exchangeRate);
    }
  });

  const switchCurrency = async () => {
    const to = getValues("to");
    const from = getValues("from");
    setValue("from", to);
    setValue("to", from);
    await onSubmit();
    return;
  };

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
      <button type="button" onClick={() => void switchCurrency()}>
        <SwitchIcon />
      </button>
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
      <ConvertResult
        exchangeRate={exchangeRate}
        amount={getValues("amount")}
        from={getValues("from")}
        to={getValues("to")}
        currencies={currencies}
      />
      <Button type="submit">Convert</Button>
    </form>
  );
};

interface ConvertResultProps {
  exchangeRate?: number;
  amount: number;
  from: string;
  to: string;
  currencies: Currency[];
}

const ConvertResult = ({
  exchangeRate,
  amount,
  from,
  to,
  currencies,
}: ConvertResultProps) => {
  if (!exchangeRate) return null;

  return (
    <section>
      <p className="mt-2 text-sm font-bold text-slate-500">
        {`${toCurrencyWithName(amount, from, currencies)} = `}
      </p>
      <p className="my-1 text-2xl font-bold text-slate-800">
        {toCurrencyWithName(exchangeRate * amount, to, currencies)}
      </p>
      <div className="font-semibold text-slate-500">
        <p>{`1 ${from.toUpperCase()} = ${exchangeRate.toFixed(
          6
        )} ${to.toUpperCase()}`}</p>
        <p>{`1 ${to.toUpperCase()} = ${(1 / exchangeRate).toPrecision(
          6
        )} ${from.toUpperCase()}`}</p>
      </div>
    </section>
  );
};

export interface Currency {
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
