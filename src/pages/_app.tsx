// File: src/pages/_app.tsx

import "@/styles/globals.css"; // ← VERY IMPORTANT
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Layout from "@/components/Layout"; // ← ADD THIS

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>GasTrip</title>
        <meta
          name="description"
          content="Find today’s gas prices, exclusive deals, and more at GasTrip!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon3.ico" />
      </Head>

      <SessionProvider session={pageProps.session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </>
  );
}