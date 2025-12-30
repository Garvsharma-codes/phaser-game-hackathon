"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";
import IntroScene from "../game_logic/scenes/IntroScene";
import TrialScene from "../game_logic/scenes/TrialScene";
import GameScene from "@/game_logic/scenes/GameScene";
import EnemyDialogueScene from "@/game_logic/scenes/EnemyDialogueScene";




export default function GameCanvas() {
  const gameRef = useRef(null);

  useEffect(() => {
    if (gameRef.current) return;

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "#000000",
      parent: "phaser-container",
scene: [IntroScene, TrialScene, GameScene, EnemyDialogueScene],


      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

return <div id="phaser-container" className="absolute inset-0" />;

}
