// src/pages/Home.jsx

import Banner from "./Banner";
import LocationSection from "../components/LocationSection";
import About from "../components/About";
import Promotions from "../components/Promotions";
import Testimonials from "../components/Testimonials";

import ContactUs from "../components/ContactUs";
import Achievements from "../components/Achievements";
import HowItWorks from "../components/HowitWorks";

export default function Home() {
  return (
    <>
      <Banner />
      <About></About>

      <Testimonials></Testimonials>
      <ContactUs></ContactUs>
      <div className=" mx-auto">
        <LocationSection />
      </div>
      <div>
        {" "}
        <Promotions></Promotions>
      </div>
      <div>
        <Achievements></Achievements>
      </div>
      <div>
        <HowItWorks></HowItWorks>
      </div>
    </>
  );
}
