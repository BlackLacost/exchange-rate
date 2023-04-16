import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { SwitchIcon } from "~/components/switchIcon";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { fetchExchangeRateFromTo } from "~/utils/api";
import { toCurrencyWithName } from "~/utils/currency";

const schema = z.object({
  amount: z.number().positive("Please enter an amount greater than 0"),
  from: z.string().min(3).max(5),
  to: z.string().min(3).max(5),
});

type FormData = z.infer<typeof schema>;

interface CurrencyConverterProps {
  amount: number | null;
  from: string | null;
  to: string | null;
  currencies: Currency[];
}

export const CurrencyConverter = ({
  currencies,
  amount,
  from,
  to,
}: CurrencyConverterProps) => {
  const router = useRouter();
  const [exchangeRate, setExchangeRate] = useState<number>();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    resetField,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: amount ?? 100,
      from: from ?? "usd",
      to: to ?? "rub",
    },
  });

  const hasFormQuery = !!amount && !!from && !!to;

  const onSubmit = useCallback(
    handleSubmit(async ({ from, to, amount }, e) => {
      e?.preventDefault();
      await router.push({
        query: { ...router.query, amount, from, to },
        pathname: "/currencyconverter",
      });
    }),
    []
  );

  useEffect(() => {
    const fetch = async () => {
      if (hasFormQuery) {
        await onSubmit();
      }
    };
    void fetch();
  }, [hasFormQuery, watch("from"), watch("to"), onSubmit]);

  useEffect(() => {
    const fetchData = async () => {
      if (!from || !to) return;

      const data = await fetchExchangeRateFromTo(from, to);
      const exchangeRate = data[to];
      if (exchangeRate && typeof exchangeRate === "number") {
        setExchangeRate(exchangeRate);
      }
    };
    void fetchData();
  }, [from, to]);

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
      onChange={(e) => {
        if (hasFormQuery) {
          void onSubmit(e);
        }
      }}
    >
      <Input
        {...register("amount", { valueAsNumber: true })}
        id="amount"
        label="Amount"
        type="number"
        error={errors.amount}
      />
      <Controller
        control={control}
        name="from"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Select
            options={currencies.map(({ value, name }) => ({
              name: `${value.toUpperCase()} - ${name}`,
              value,
            }))}
            value={value}
            onChange={onChange}
            error={error}
            resetField={() => resetField("from")}
          />
        )}
      />
      <button
        className="self-start rounded-full shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        type="button"
        onClick={() => void switchCurrency()}
      >
        <SwitchIcon />
      </button>
      <Controller
        control={control}
        name="to"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Select
            options={currencies.map(({ value, name }) => ({
              name: `${value.toUpperCase()} - ${name}`,
              value,
            }))}
            value={value}
            onChange={onChange}
            error={error}
            resetField={() => resetField("to")}
          />
        )}
      />
      <ConvertResult
        exchangeRate={exchangeRate}
        amount={amount}
        from={from}
        to={to}
        currencies={currencies}
      />
      {!hasFormQuery && <Button type="submit">Convert</Button>}
    </form>
  );
};

interface ConvertResultProps {
  exchangeRate?: number;
  amount: number | null;
  from: string | null;
  to: string | null;
  currencies: Currency[];
}

export interface Currency {
  value: string;
  name: string;
}

const ConvertResult = ({
  exchangeRate,
  amount,
  from,
  to,
  currencies,
}: ConvertResultProps) => {
  if (!exchangeRate || !amount || !from || !to) return null;

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
