"use client";

import { Country } from "@/types";
import Image from "next/image";
import CountUp from "react-countup";

type CountryHalfSlideProps = { country: Country; showPopulation: boolean; onClick: () => void };
export default function CountryHalfSlide(props: CountryHalfSlideProps) {
  return (
    <div className="h-[50vh] lg:h-full w-full lg:w-1/2 relative group cursor-pointer" onClick={props.onClick}>
      <Image
        src={props.country.flags.svg}
        height={100}
        width={100}
        alt={props.country.flags.alt}
        className="h-full w-full object-cover"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-90 rounded-lg p-4 flex flex-col gap-3 justify-center items-center">
        <h3 className="font-medium text-3xl text-center text-white">{props.country.name.common}</h3>
        {!props.showPopulation ? (
          <button className="btn group-hover:bg-green-600 group-hover:text-white group-hover:scale-95 group-hover:translate-y-[2px]">
            Wybierz
          </button>
        ) : (
          <CountUp
            className="font-semibold text-xl text-white"
            start={props.country.population / 2}
            end={props.country.population}
            duration={1}
          />
        )}
      </div>
    </div>
  );
}
