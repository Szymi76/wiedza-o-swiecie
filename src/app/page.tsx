"use client";

import useSwr from "swr";

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export default function Page() {
  const { data } = useSwr("https://restcountries.com/v3.1/all", fetcher);

  console.log(data);

  return (
    <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-normal text-gray-300 sm:text-7xl">
      Generating dream rooms{" "}
    </h1>
  );
}
