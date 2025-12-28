"use client";

import dynamic from "next/dynamic";

const GameCanvas = dynamic(
  () => import("../../components/GameCanvas"),
  { ssr: false }
);

export default function IntroPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Phaser Canvas */}
      <GameCanvas />

      {/* UI Overlay */}
      <div className="absolute bottom-20 w-full flex justify-center">
<button className="
  px-10 py-4
  text-lg font-semibold tracking-wide
  text-black bg-emerald-400
  rounded-md
  shadow-[0_0_20px_rgba(16,185,129,0.7)]
  hover:shadow-[0_0_30px_rgba(16,185,129,1)]
  transition-all duration-300
">
  ▶ START JOURNEY
</button>

      </div>
    </div>
  );
}
