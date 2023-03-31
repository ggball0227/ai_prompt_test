import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { NextIntlProvider } from 'next-intl'
import "../styles/globals.css";
import "../styles/markdown.css";
import { CookiesProvider } from "react-cookie";


function MyApp({ Component, pageProps }: AppProps) {
  return (

    <NextIntlProvider
      messages={pageProps.messages}
    >
      <Component {...pageProps} />
      <Analytics />
      {/* <CookiesProvider>
      <Component {...pageProps} />
    </CookiesProvider> */}
    </NextIntlProvider>

   
 
  );
}


export default MyApp;
