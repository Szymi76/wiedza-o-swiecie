"use client";

import { produce, Draft } from "immer";

type GameState = {
  gameName: string;
  currentScore: number;
  bestScore: number;
  isCurrentScoreNewBest: boolean;
  isGameEnded: boolean;
  isGameHasBeenWon: boolean;
  gameNumber: number;
};

type GameActions =
  | { type: "add-one-point" }
  | { type: "end-game"; payload: { hasBeenWon: boolean } }
  | { type: "play-again" };

const createLSBestScoreKey = (gameName: string) => `${gameName}__best-score`;

export function createInitialGameState(gameName: string): GameState {
  let bestScore = 0;

  if (typeof window !== "undefined") {
    const localStorageKey = createLSBestScoreKey(gameName);
    const storedBestScore = localStorage.getItem(localStorageKey);

    if (storedBestScore) {
      const parsedBestScore = JSON.parse(storedBestScore);
      if (typeof parsedBestScore == "number") bestScore = parsedBestScore;
    } else {
      localStorage.setItem(localStorageKey, JSON.stringify(0));
    }
  }

  return {
    gameName,
    currentScore: 0,
    bestScore,
    isCurrentScoreNewBest: false,
    isGameEnded: false,
    isGameHasBeenWon: false,
    gameNumber: 1,
  };
}

export const gameReducer = produce((draft: Draft<GameState>, action: GameActions) => {
  switch (action.type) {
    case "add-one-point": {
      draft.currentScore = draft.currentScore + 1;

      if (draft.currentScore > draft.bestScore) {
        const localStorageKey = createLSBestScoreKey(draft.gameName);
        draft.isCurrentScoreNewBest = true;
        draft.bestScore = draft.currentScore;
        if (typeof window !== "undefined") {
          localStorage.setItem(localStorageKey, JSON.stringify(draft.bestScore));
        }
      }
      break;
    }
    case "end-game": {
      draft.isGameEnded = true;
      draft.isGameHasBeenWon = action.payload.hasBeenWon;
      break;
    }
    case "play-again": {
      draft.currentScore = 0;
      draft.gameNumber = draft.gameNumber + 1;
      draft.isGameEnded = false;
      draft.isGameHasBeenWon = false;
      break;
    }
  }
});
