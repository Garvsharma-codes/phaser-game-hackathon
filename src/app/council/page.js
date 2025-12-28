"use client";

import { useState } from "react";

export default function CouncilPage() {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const question = {
    text: "A system is failing under heavy load. What do you fix first?",
    options: [
      {
        id: "a",
        text: "Increase server capacity immediately",
        quality: "brute",
      },
      {
        id: "b",
        text: "Profile the bottleneck and optimize the slowest part",
        quality: "smart",
      },
      {
        id: "c",
        text: "Rewrite the entire system from scratch",
        quality: "reckless",
      },
    ],
  };

  function submitAnswer() {
    if (!selected) return;
    setSubmitted(true);

    // Save weapon quality (temporary)
    localStorage.setItem("weaponQuality", selected.quality);
  }

  return (
    <div className="min-h-screen bg-black text-cyan-300 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Council Intro */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-mono tracking-widest">
            COUNCIL OF SAGES
          </h1>
          <p className="text-sm text-cyan-400">
            Power without understanding always collapses.
          </p>
        </div>

        {/* Question */}
        <div className="bg-zinc-900 border border-cyan-700 rounded-lg p-6 space-y-4">
          <p className="font-mono text-lg">{question.text}</p>

          <div className="space-y-3">
            {question.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelected(opt)}
                className={`w-full text-left px-4 py-3 rounded-md border transition
                  ${
                    selected?.id === opt.id
                      ? "border-cyan-400 bg-cyan-900/40"
                      : "border-zinc-700 hover:border-cyan-600"
                  }
                `}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>

        {/* Action */}
        {!submitted ? (
          <button
            onClick={submitAnswer}
            className="w-full py-3 bg-cyan-500 text-black font-semibold rounded-md hover:bg-cyan-400 transition"
          >
            FORGE WEAPON
          </button>
        ) : (
          <div className="text-center space-y-2">
            <p className="text-green-400 font-mono">
              Weapon forged based on your thinking.
            </p>
            <p className="text-sm text-cyan-500">
              (Next: combat scene)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
