// src/pages/Home.jsx

import Banner from "./Banner";
import LocationSection from "../components/LocationSection";
import About from "../components/About";
import Promotions from "../components/Promotions";

export default function Home() {
  return (
    <>
      <Banner />
      <About></About>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <LocationSection />
      </div>
      <div className=" py-10">
        {" "}
        <Promotions></Promotions>
      </div>
    </>
  );
}
