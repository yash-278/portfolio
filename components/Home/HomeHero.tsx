import React from "react";
import { BackgroundGradientAnimation } from "../ui/background-gradient-animation";

export function HomeHero() {
  return (
    <BackgroundGradientAnimation>
      <div className="pointer-events-none absolute inset-0 z-50 mx-auto flex max-w-7xl flex-col items-start justify-center space-y-3 px-4 text-white">
        <p className="bg-gradient-to-b from-white/50 to-white/50 bg-clip-text font-comfortaa text-4xl font-bold text-transparent drop-shadow-2xl lg:text-7xl">
          Yash Kadam
        </p>
        <p className="bg-clip-text font-josefin text-xl font-normal text-yellow-300 drop-shadow-2xl lg:text-4xl">
          SOFTWARE ENGINEER
        </p>
        <p className="bg-clip-text font-fira text-base text-white drop-shadow-2xl lg:max-w-3xl lg:text-2xl">
          Self-taught programmer motivated by passion and personal projects.
          <br />
          Expert of searching bugs on Google and quickly scanning the best
          StackOverflow answers.
        </p>
      </div>
    </BackgroundGradientAnimation>
  );
}
