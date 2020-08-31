import React from "react";
import HeroSection from "components/HeroSection";
import FeaturesSection from "components/FeaturesSection";
import { useRouter } from "next/router";

function IndexPage(props) {
  const router = useRouter();

  return (
    <>
      <HeroSection
        color="white"
        size="medium"
        backgroundImage=""
        backgroundImageOpacity={1}
        title="Your Game Awaits"
        subtitle="Click on the button below to enter your game."
        buttonText="Enter Game"
        image="https://uploads.divjoy.com/undraw-japan_ubgk.svg"
        buttonOnClick={() => {
          // Navigate to pricing page
          router.push("/game");
        }}
      />
      <FeaturesSection
        color="white"
        size="medium"
        backgroundImage=""
        backgroundImageOpacity={1}
        title="Features"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud."
      />
    </>
  );
}

export default IndexPage;
