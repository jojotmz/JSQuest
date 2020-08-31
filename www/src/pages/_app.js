import React from "react";
import "styles/global.scss";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import { ProvideAuth } from "util/auth.js";

function MyApp({ Component, pageProps }) {
  return (
    <ProvideAuth>
      <>
        <Navbar
          color="white"
          spaced={true}
          logo="https://uploads.divjoy.com/logo.svg"
        />

        <Component {...pageProps} />

        <Footer
          color="light"
          size="normal"
          backgroundImage=""
          backgroundImageOpacity={1}
          copyright="© 2019 Company"
          logo="https://uploads.divjoy.com/logo.svg"
        />
      </>
    </ProvideAuth>
  );
}

export default MyApp;
