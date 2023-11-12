import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { setProfile } from "../lib/redux/profileSlice";
import { useDispatch } from "react-redux";
import Image from "next/image";

const CallbackComponent = () => {
  const router = useRouter();
  const { code } = router.query;
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuth = async () => {
      if (typeof code === "string") {
        try {
          const body = new URLSearchParams();
          body.append("grant_type", "authorization_code");
          body.append("code", code);
          body.append(
            "redirect_uri",
            process.env.NEXT_PUBLIC_REDIRECT_URI as string
          );
          body.append("client_id", process.env.NEXT_PUBLIC_CLIENT_ID as string);

          const authorizationResponse = await fetch(
            "https://old.online.ntnu.no/openid/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: body,
            }
          );

          const authorization = await authorizationResponse.json();

          if (!authorizationResponse.ok) {
            throw new Error(authorization.error || "Authorization failed");
          }

          Cookies.remove("token");
          Cookies.set("token", authorization.access_token, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
          });

          const profileResponse = await fetch(
            "https://old.online.ntnu.no/api/v1/profile",
            {
              headers: {
                Authorization: `Bearer ${authorization.access_token}`,
              },
            }
          );

          if (!profileResponse.ok) {
            throw new Error("Failed to fetch profile");
          }

          const profileData = await profileResponse.json();

          dispatch(setProfile(profileData));
          router.push("/");
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("An unexpected error occurred, please try again.");
          }
        }
      }
    };

    if (code) {
      fetchAuth();
    }
  }, [code, dispatch, router]);
  const { push } = useRouter();

  if (Cookies.get("token")) {
    push("/");
  }

  return (
    <div className="flex flex-col justify-center items-center gap-10 h-screen">
      <Image
        src="/Online_bla.svg"
        width={300}
        height={100}
        alt="Online logo"
        className="animate-pulse"
      />
      <div className="text-xl">
        {error ? <>An error occurred: {error}</> : <>Redirecting...</>}
      </div>
    </div>
  );
};

export default CallbackComponent;
