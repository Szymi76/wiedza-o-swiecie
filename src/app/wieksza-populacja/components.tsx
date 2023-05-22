import { Country } from "@/types";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import CountUp from "react-countup";
import { TailSpin } from "react-loader-spinner";

type CountryHalfSlideProps = { country: Country; showPopulation: boolean; onClick: () => void };
export function CountryHalfSlide(props: CountryHalfSlideProps) {
  return (
    <div className="h-full w-full lg:w-1/2 relative group cursor-pointer" onClick={props.onClick}>
      <Image
        src={props.country.flags.svg}
        height={100}
        width={100}
        alt={props.country.flags.alt}
        className="h-full w-full object-cover"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-90 rounded-lg p-4 flex flex-col gap-3 justify-center items-center">
        <h3 className="font-medium text-2xl text-center text-white">{props.country.name.common}</h3>
        {!props.showPopulation ? (
          <button className="bg-white rounded-md px-5 py-1.5 font-semibold border-2 border-transparent group-hover:bg-green-500 group-hover:text-white group-hover:border-white group-hover:scale-95 duration-150 ">
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

type ButtonProps = React.ComponentPropsWithoutRef<"button">;
export function Button(props: ButtonProps) {
  const { className, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      className={clsx(
        "bg-white px-3 lg:px-6 py-3 rounded-lg flex gap-3 items-center justify-center text-black font-bold w-full hover:scale-[.97] active:scale-[.94] focus:scale-[.94] duration-100 outline-none",
        className
      )}></button>
  );
}

export function LoadingPage() {
  return (
    <div className="h-screen w-full bg-gray-800 flex justify-center pt-20">
      <div className="flex gap-5">
        <h2 className="font-bold text-3xl text-white">Ładowanie gry </h2>
        <TailSpin color="white" height={40} width={40} />
      </div>
    </div>
  );
}

export function ErrorPage() {
  return (
    <div className="h-screen w-full bg-gray-800 flex justify-center pt-20">
      <div className="flex flex-col gap-5 w-[500px] max-w-[90%]">
        <h2 className="font-bold text-3xl text-white text-center">Coś poszło nie tak podczas ładowania gry 😔</h2>
        <p className="text-medium text-gray-400">
          Spróbuj odświerzyć przeglądarkę, jeśli to nie pomoże to wyłącz i włącz ją na nowo.
        </p>
        <Link href="/">
          <Button>Wróć do przeglądania gier</Button>
        </Link>
      </div>
    </div>
  );
}
