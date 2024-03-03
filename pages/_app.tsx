import "../styles/globals.css";
import React, { useEffect } from "react";
import { UserProvider, useUser } from "@auth0/nextjs-auth0/client";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";

const SessionHandler: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;
    if (!user && router.pathname !== "/") {
      router.push("/");
    }
  }, [user, router]);

  if (isLoading || (!user && router.pathname !== "/")) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-10">
        <Image
          src="/Online_bla.svg"
          width={300}
          height={100}
          alt="Online logo"
          className="animate-pulse"
        />
        <div className="text-xl">Vent litt...</div>
      </div>
    );
  }

  return <>{children}</>;
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: any) {
  return (
    <UserProvider>
      <Head>
        <link rel="icon" href="/Online_hvit_o.svg" />
        <title>Online Komitéopptak</title>
      </Head>
      <SessionHandler>
        <Toaster />
        <Component {...pageProps} />
      </SessionHandler>
    </UserProvider>
  );
}

export default MyApp;
