import Image from "next/image";
import { HomeHero } from "../components/Home/HomeHero";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl">
        <HomeHero />
      </div>
    </main>
  );
}
