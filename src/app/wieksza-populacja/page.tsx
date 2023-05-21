"use client";

import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import "swiper/css";
import CountUp from "react-countup/build";
import { Country } from "@/types";
import useSwr from "swr";
import { useCallback, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CheckIcon from "@heroicons/react/24/solid/CheckIcon";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import ArrowLongLeftIcon from "@heroicons/react/24/solid/ArrowLongLeftIcon";
import ArrowUturnRightIcon from "@heroicons/react/24/solid/ArrowUturnRightIcon";
import FocusTrap from "focus-trap-react";
import Link from "next/link";
import { Button, CountryHalfSlide } from "./components";
import sleep from "@/utils/sleep";
import { generateRandomCountriesPairs } from "./utils";
import { useImmerReducer } from "use-immer";
import { createInitialGameState, gameReducer } from "@/gameReducer";

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export default function HigherPopulation() {
  const { data, isLoading } = useSwr<Country[]>("https://restcountries.com/v3.1/all", fetcher);
  const [showPopulation, setShowPopulation] = useState(false);
  const [showGameEndScreen, setShowGameEndScreen] = useState(false);
  const [gameState, dispatch] = useImmerReducer(gameReducer, createInitialGameState("higher-population"));

  const swiperRef = useRef<SwiperRef>(null);
  const { pairs } = useMemo(() => generateRandomCountriesPairs(data ?? []), [data, gameState.gameNumber]);

  const handleCountryClick = useCallback(async (pair: [Country, Country], clicked: "first" | "second") => {
    if (gameState.isGameEnded) return;
    setShowPopulation(true);

    if (
      (clicked == "first" && pair[0].population < pair[1].population) ||
      (clicked == "second" && pair[1].population < pair[0].population)
    ) {
      dispatch({ type: "end-game" });
      await sleep(2000);
      setShowGameEndScreen(true);
      return;
    }

    dispatch({ type: "add-one-point" });
    await sleep(2000);
    setShowPopulation(false);
    swiperRef.current?.swiper.slidePrev();
  }, []);

  const handlePlayAgain = useCallback(async () => {
    dispatch({ type: "play-again" });
    setShowPopulation(false);
    setShowGameEndScreen(false);
  }, []);

  if (isLoading) return <h1>Ładowanie...</h1>;
  if (!data) return <h1>Coś poszło nie tak!</h1>;

  return (
    <main className="h-screen w-full overflow-hidden relative">
      <Swiper
        allowTouchMove={false}
        ref={swiperRef}
        slidesPerView={1}
        className="h-full"
        direction="vertical"
        initialSlide={pairs.length - 1}>
        {pairs.map((countriesPair, index) => {
          return (
            <SwiperSlide key={`slide_${index}`}>
              <div className="flex h-full">
                <CountryHalfSlide
                  country={countriesPair[0]}
                  showPopulation={showPopulation}
                  onClick={() => handleCountryClick(countriesPair, "first")}
                />
                <CountryHalfSlide
                  country={countriesPair[1]}
                  showPopulation={showPopulation}
                  onClick={() => handleCountryClick(countriesPair, "second")}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="absolute absolute-center top-16 z-20 primary-layout flex flex-col justify-start items-center">
        <h3 className="font-semibold text-2xl">Który kraj ma większą populacje?</h3>
        <p className="mt-2 font-medium uppercase relative w-min whitespace-nowrap text-gray-300">
          Twój wynik: {gameState.currentScore}
          <motion.p
            key={gameState.currentScore}
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
              className={`relative h-[100px] w-[100px] rounded-full ${
                gameState.isGameEnded ? "bg-red-500" : "bg-green-500"
              }`}
              initial={{ scale: 0.25 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, transition: { duration: 0.1 } }}
              transition={{ duration: 0.75 }}>
              <div className="absolute absolute-center text-white">
                {gameState.isGameEnded ? <XMarkIcon className="h-14" /> : <CheckIcon className="w-14" />}
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
              className="primary-layout p-8 w-[90%] max-w-[500px] h-[450px] max-h-[90%] flex flex-col justify-between items-center">
              <div className="flex flex-col gap-2">
                <h2 className="text-5xl font-semibold">GAME OVER</h2>
                {gameState.isCurrentScoreNewBest && (
                  <p className="font-semibold uppercase text-xl border w-full text-center p-1 rounded">
                    Nowy najlepszy wynik!!
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3 items-center">
                <h2 className="text-3xl font-semibold">Twój wynik</h2>
                <CountUp
                  start={0}
                  end={gameState.currentScore}
                  delay={0.75}
                  duration={1}
                  className="text-5xl font-bold text-white"
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Button onClick={handlePlayAgain}>
                  <ArrowUturnRightIcon className="h-7" />
                  ZAGRAJ JESZCZE RAZ
                </Button>
                <Link href="/">
                  <Button onClick={handlePlayAgain}>
                    <ArrowLongLeftIcon className="h-7" />
                    PRZEGLĄDAJ INNE GRY
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </FocusTrap>
      )}

      <div className="absolute bottom-5 right-5 z-10 primary-layout flex justify-center items-center">
        <h3 className="font-semibold">Najlepszy wynik: {gameState.bestScore}</h3>
      </div>
    </main>
  );
}
