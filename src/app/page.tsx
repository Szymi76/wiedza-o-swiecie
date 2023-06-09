"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import useSwr from "swr";
import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import { Country } from "@/types";
import { useImmerReducer } from "use-immer";
import { createInitialGameState, gameReducer } from "@/reducers/gameReducer";
import sleep from "@/utils/sleep";
import generateRandomCountriesPairs from "@/utils/generateRandomCountriesPairs";

import { motion, AnimatePresence } from "framer-motion";
import { Fireworks } from "@fireworks-js/react";
import CountUp from "react-countup/build";
import FocusTrap from "focus-trap-react";
import CountryHalfSlide from "@/components/CountryHalfSlide";
import LoadingPageSkeleton from "@/layouts/LoadingPageSkeleton";
import ErrorPageLayout from "@/layouts/ErrorPageLayout";

import CheckIcon from "@heroicons/react/24/solid/CheckIcon";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import ArrowUturnRightIcon from "@heroicons/react/24/solid/ArrowUturnRightIcon";

import "swiper/css";

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export default function HigherPopulation() {
  const { data, isLoading, error } = useSwr<{ countries: Country[] }>("/api/countries", fetcher);
  const [showPopulation, setShowPopulation] = useState(false);
  const [showGameEndScreen, setShowGameEndScreen] = useState(false);
  const [gameState, dispatch] = useImmerReducer(gameReducer, createInitialGameState("higher-population"));

  const swiperRef = useRef<SwiperRef>(null);

  const { pairs } = useMemo(() => generateRandomCountriesPairs(data?.countries ?? []), [data, gameState.gameNumber]);
  const handleCountryClick = useCallback(
    async (pair: [Country, Country], clicked: "first" | "second", index: number) => {
      if (gameState.isGameEnded) return;
      setShowPopulation(true);

      if (
        (clicked == "first" && pair[0].population < pair[1].population) ||
        (clicked == "second" && pair[1].population < pair[0].population)
      ) {
        dispatch({ type: "end-game", payload: { hasBeenWon: false } });
        await sleep(2000);
        setShowGameEndScreen(true);
        return;
      }

      if (index == 0) {
        dispatch({ type: "end-game", payload: { hasBeenWon: true } });
        setShowPopulation(true);
        await sleep(2000);
        setShowGameEndScreen(true);
        return;
      }

      dispatch({ type: "add-one-point" });
      await sleep(2000);
      setShowPopulation(false);
      swiperRef.current?.swiper.slidePrev();
    },
    []
  );

  const handlePlayAgain = useCallback(async () => {
    dispatch({ type: "play-again" });
    setShowPopulation(false);
    setShowGameEndScreen(false);
  }, []);

  if (isLoading) return <LoadingPageSkeleton />;
  if (error || !data) return <ErrorPageLayout />;

  return (
    <main className="h-screen w-full overflow-hidden relative">
      <Swiper
        key={gameState.gameNumber}
        allowTouchMove={false}
        ref={swiperRef}
        slidesPerView={1}
        className="h-full"
        direction="vertical"
        initialSlide={pairs.length - 1}>
        {pairs.map((countriesPair, index) => {
          return (
            <SwiperSlide key={`slide_${index}`}>
              <div className="flex flex-col lg:flex-row h-full">
                <CountryHalfSlide
                  country={countriesPair[0]}
                  showPopulation={showPopulation}
                  onClick={() => handleCountryClick(countriesPair, "first", index)}
                />
                <div className="absolute absolute-center bg-opacity-50 lg:h-full lg:w-[5px] w-full h-[5px] bg-white"></div>
                <CountryHalfSlide
                  country={countriesPair[1]}
                  showPopulation={showPopulation}
                  onClick={() => handleCountryClick(countriesPair, "second", index)}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="absolute absolute-center top-16 z-20 primary-layout flex flex-col justify-start items-center">
        <h3 className="font-semibold text-xl lg:text-2xl whitespace-nowrap">Który kraj ma większą populacje?</h3>
        <p className="mt-2 font-medium uppercase relative w-min whitespace-nowrap text-gray-300">
          Twój wynik: {gameState.currentScore}
          <motion.span
            key={gameState.currentScore}
            initial={{ scale: 0.5, opacity: 1, top: "5px" }}
            animate={{
              top: "-15px",
              scale: 1,
              opacity: 0,
              transition: { duration: gameState.currentScore > 0 ? 1 : 0 },
            }}
            className="absolute -right-6 text-green-500 font-semibold">
            + 1
          </motion.span>
        </p>
      </div>

      <AnimatePresence>
        {showPopulation && (
          <div className="absolute absolute-center z-10">
            <motion.div
              className={`relative h-[100px] w-[100px] rounded-full ${
                gameState.isGameEnded && !gameState.isGameHasBeenWon ? "bg-red-500" : "bg-green-500"
              }`}
              initial={{ scale: 0.25 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, transition: { duration: 0.1 } }}
              transition={{ duration: 0.75 }}>
              <div className="absolute absolute-center text-white">
                {gameState.isGameEnded && !gameState.isGameHasBeenWon ? (
                  <XMarkIcon className="h-14" />
                ) : (
                  <CheckIcon className="w-14" />
                )}
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
              className="relative z-20 primary-layout bg-gray-800 bg-opacity-95 p-8 w-[80%] max-w-[450px] h-[400px] max-h-[90%] flex flex-col justify-between items-center">
              <div className="flex flex-col gap-3">
                <h2 className="text-3xl lg:text-5xl font-semibold text-center">
                  {gameState.isGameHasBeenWon ? "ZWYCIĘSTWO" : "GAME OVER"}
                </h2>
                {gameState.isCurrentScoreNewBest && (
                  <p className="font-semibold uppercase text-md lg:text-xl border border-gray-500 w-full text-center p-2 rounded">
                    Nowy najlepszy wynik!! 🥳
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3 items-center">
                <h2 className="text-xl lg:text-3xl font-semibold">Twój wynik</h2>
                <CountUp
                  start={0}
                  end={gameState.currentScore}
                  delay={0.25}
                  duration={1}
                  className="text-5xl font-bold text-white"
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <button className="btn w-full" onClick={handlePlayAgain}>
                  <ArrowUturnRightIcon className="h-7" />
                  ZAGRAJ JESZCZE RAZ
                </button>
              </div>
            </motion.div>
            {gameState.isCurrentScoreNewBest && <Fireworks className="absolute top-0 left-0 w-full h-full" />}
          </div>
        </FocusTrap>
      )}

      <div className="absolute bottom-5 right-5 z-10 primary-layout justify-center items-center hidden lg:flex">
        <h3 className="font-semibold">Najlepszy wynik: {gameState.bestScore}</h3>
      </div>
    </main>
  );
}
