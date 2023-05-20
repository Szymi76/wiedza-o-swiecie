"use client";

import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import "swiper/css";
import CountUp from "react-countup/build";
import { Country } from "@/types";
import useSwr from "swr";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CheckIcon from "@heroicons/react/24/solid/CheckIcon";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import ArrowLongLeftIcon from "@heroicons/react/24/solid/ArrowLongLeftIcon";
import FocusTrap from "focus-trap-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Link from "next/link";

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export default function Page() {
  const { data, isLoading } = useSwr<Country[]>("https://restcountries.com/v3.1/all", fetcher);
  const swiperRef = useRef<SwiperRef>(null);

  const [points, setPoints] = useState(0);
  const [showPopulation, setShowPopulation] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);
  const [showGameEndScreen, setShowGameEndScreen] = useState(false);
  const [game, setGame] = useState(1);
  const [newBestScore, setNewBestScore] = useState(false);
  const [bestScore, setBestScore] = useLocalStorage<number>("best-score", 0);
  const { pairs } = useMemo(() => generateRandomCountriesPairs(data ?? []), [data, game]);

  if (isLoading) return <h1>Ładowanie...</h1>;
  if (!data) return <h1>Coś poszło nie tak!</h1>;

  const handleCountryClick = async (pair: [Country, Country], clicked: "first" | "second") => {
    setShowPopulation(true);

    // porażka
    if (
      (clicked == "first" && pair[0].population < pair[1].population) ||
      (clicked == "second" && pair[1].population < pair[0].population)
    ) {
      setGameEnd(true);
      await sleep(2000);
      setShowGameEndScreen(true);
      return;
    }

    setPoints((points) => {
      if (points + 1 > bestScore) {
        setBestScore(points + 1);
        setNewBestScore(true);
      }
      return points + 1;
    });
    await sleep(2000);
    setShowPopulation(false);
    swiperRef.current?.swiper.slidePrev();
  };

  const handlePlayAgain = async () => {
    setGame((game) => game + 1);
    setPoints(0);
    setGameEnd(false);
    setShowPopulation(false);
    setShowGameEndScreen(false);
  };

  return (
    <main className="h-screen w-full overflow-hidden relative">
      <Swiper
        key={game}
        // allowTouchMove={false}
        ref={swiperRef}
        slidesPerView={1}
        className="h-full"
        direction="vertical"
        initialSlide={pairs.length - 1}>
        {pairs.map(([c1, c2], index) => {
          console.log(c1, c2);
          return (
            <SwiperSlide key={index + "slide"}>
              <div className="flex h-full">
                <div
                  className="h-full w-1/2 relative group cursor-pointer"
                  onClick={() => handleCountryClick([c1, c2], "first")}>
                  <Image
                    src={c1.flags.svg}
                    height={100}
                    width={100}
                    alt={c1.flags.alt}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-90 rounded-lg p-4 flex flex-col gap-3 justify-center items-center">
                    <h3 className="font-medium text-2xl text-center">{c1.name.common}</h3>
                    {!showPopulation ? (
                      <button className="bg-white rounded-md px-5 py-1.5 text-black font-semibold border-2 border-transparent group-hover:bg-green-500 group-hover:text-white group-hover:border-white group-hover:scale-95 duration-150 ">
                        Wybierz
                      </button>
                    ) : (
                      <CountUp
                        className="font-semibold text-xl"
                        start={c1.population / 2}
                        end={c1.population}
                        duration={1}
                      />
                    )}
                  </div>
                </div>
                <div
                  className="h-full w-1/2 relative group cursor-pointer"
                  onClick={() => handleCountryClick([c1, c2], "second")}>
                  <Image
                    src={c2.flags.svg}
                    height={100}
                    width={100}
                    alt={c2.flags.alt}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-90 rounded-lg p-4 flex flex-col gap-3 justify-center items-center">
                    <h3 className="font-medium text-2xl text-center">{c2.name.common}</h3>
                    {!showPopulation ? (
                      <button className="bg-white rounded-md px-5 py-1.5 text-black font-semibold border-2 border-transparent group-hover:bg-green-500 group-hover:text-white group-hover:border-white group-hover:scale-95 duration-150 ">
                        Wybierz
                      </button>
                    ) : (
                      <CountUp
                        className="font-semibold text-xl"
                        start={c2.population / 2}
                        end={c2.population}
                        duration={1}
                      />
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* środek */}

      <div className="absolute absolute-center top-16 z-20 bg-gray-800 bg-opacity-90 rounded-lg p-4 flex flex-col justify-start items-center">
        <h3 className="font-semibold text-2xl">Który kraj ma większą populacje?</h3>
        <p className="mt-2 font-medium uppercase relative w-min whitespace-nowrap">
          Twój wynik: {points}
          <motion.p
            key={points}
            initial={{ scale: 0.5, opacity: 1, top: "5px" }}
            animate={{
              top: "-15px",
              scale: 1,
              opacity: 0,
              transition: { duration: 1 },
            }}
            className="absolute -right-6 text-green-500 font-semibold">
            + 1
          </motion.p>
        </p>
      </div>

      <AnimatePresence>
        {showPopulation && (
          <div className="absolute absolute-center z-10">
            <motion.div
              className={`relative h-[100px] w-[100px] rounded-full ${gameEnd ? "bg-red-500" : "bg-green-500"}`}
              initial={{ scale: 0.25 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, transition: { duration: 0.1 } }}
              transition={{ duration: 0.75 }}>
              <div className="absolute absolute-center">
                {gameEnd ? <XMarkIcon className="h-14" /> : <CheckIcon className="w-14" />}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showGameEndScreen && (
        <FocusTrap focusTrapOptions={{ initialFocus: false }}>
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-40 z-20">
            <motion.div
              initial={{ scale: 0.75, translateY: "100%", opacity: 0.75 }}
              animate={{ scale: 1, translateY: "0%", opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="bg-gray-800 bg-opacity-90 rounded-lg p-8">
              <h2 className="text-4xl font-semibold">Przegrywasz</h2>
              {newBestScore && <p className="font-semibold uppercase mt-1">Nowy najlepszy wynik!!</p>}
              <button
                className="bg-white px-6 py-3 mt-5 rounded-lg text-black font-semibold w-full hover:scale-[.97] active:scale-[.94] focus:scale-[.94] duration-100 outline-none"
                onClick={handlePlayAgain}>
                ZAGRAJ JESZCZE RAZ
              </button>
            </motion.div>
          </div>
        </FocusTrap>
      )}

      <div className="absolute bottom-5 right-5 z-20 bg-gray-800 bg-opacity-90 rounded-lg p-4 flex justify-center items-center">
        <h3 className="font-semibold">Najlepszy wynik: {bestScore}</h3>
      </div>

      <div className="absolute top-5 left-5 z-20 bg-gray-800 bg-opacity-90 rounded-lg py-2 px-4">
        <Link href="/" className="flex justify-center items-center gap-3">
          <ArrowLongLeftIcon className="h-8" />
          <h3 className="font-semibold">Powrót</h3>
        </Link>
      </div>
    </main>
  );
}

function generateRandomCountriesPairs(countries: Country[]) {
  let array = [...countries];
  const pairs: [Country, Country][] = [];

  if (array.length % 2 != 0) array.pop();

  while (array.length > 1) {
    const firstRandomIndex = Math.floor(Math.random() * array.length);
    const secondRandomIndex = Math.floor(Math.random() * array.length);

    if (firstRandomIndex == secondRandomIndex) continue;

    pairs.push([array[firstRandomIndex], array[secondRandomIndex]]);

    array = array.filter((_, index) => index != firstRandomIndex && index != secondRandomIndex);
  }

  return { pairs };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
