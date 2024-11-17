import "../styles/globals.css";
import React, { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingPage from "../components/LoadingPage";
import Signature from "../lib/utils/Signature";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "../components/theme/ThemeContext";

const queryClient = new QueryClient({
  defaultOptions: {
    // TODO: go over default options
    queries: {
      staleTime: 1000 * 60 * 10,
    },
  },
});

const SessionHandler: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  //Tihi
  useEffect(() => {
    console.log(Signature);
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!session && router.pathname !== "/") {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading" || (!session && router.pathname !== "/")) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: any) {
  return (
    <SessionProvider session={session}>
      <Head>
        <link rel="icon" href="/Online_hvit_o.svg" />
        <title>Online Komitéopptak</title>
      </Head>
      <SessionHandler>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <div className="flex flex-col min-h-screen bg-white dark:text-white dark:bg-gray-900">
              <Toaster />
              <Navbar />
              <div className="flex-grow py-10">
                <Component {...pageProps} />
              </div>
              <Footer />
            </div>
          </ThemeProvider>
        </QueryClientProvider>
      </SessionHandler>

      <Analytics />
    </SessionProvider>
  );
}

export default MyApp;
