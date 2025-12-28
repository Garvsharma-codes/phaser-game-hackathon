"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";
import IntroScene from "../app/game/scenes/IntroScene";
import TrialScene from "../app/game/scenes/TrialScene";
import GameScene from "@/app/game/scenes/GameScene";
import EnemyDialogueScene from "@/app/game/scenes/EnemyDialogueScene";




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
