import { zodResolver } from "@hookform/resolvers/zod";
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";

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
  amount: z.number().positive(),
  from: z.string().min(3).max(5),
  to: z.string().min(3).max(5),
});

type FormData = z.infer<typeof schema>;

interface CurrencyConverterProps {
  currencies: Currency[];
}

const CurrencyConverter = ({ currencies }: CurrencyConverterProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 1, from: "rub", to: "usd" },
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });
  return (
    <form onSubmit={() => void onSubmit()}>
      {errors.amount && <p>{errors.amount.message}</p>}
      <input
        {...register("amount", { valueAsNumber: true })}
        type="number"
        placeholder="Amount"
      />
      {errors.from && <p>{errors.from.message}</p>}
      <select {...register("from")}>
        {currencies.map(({ acronym, name }) => (
          <option
            key={acronym}
            value={acronym}
          >{`${acronym.toUpperCase()} ${name}`}</option>
        ))}
      </select>
      {errors.to && <p>{errors.to.message}</p>}
      <select {...register("to")}>
        {currencies.map(({ acronym, name }) => (
          <option
            key={acronym}
            value={acronym}
          >{`${acronym.toUpperCase()} ${name}`}</option>
        ))}
      </select>
      <Button>Convert</Button>
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

interface Props {
  currencies: Currency[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const currencies = await fetchAllCurrencies();
  return {
    props: { currencies },
  };
};
