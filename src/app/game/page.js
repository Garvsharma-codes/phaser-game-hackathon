"use client";

import { useEffect } from "react";
import GameManager from "@/game_logic/GameManager";

export default function GamePage() {
  useEffect(() => {
    const game = new GameManager("game-container");

    return () => {
      game.destroy();
    };
  }, []);

  return <div id="game-container" />;
}
