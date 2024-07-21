export const isProd = process.env.NODE_ENV == "production";

export const LOCAL_HOST = "http://localhost:3000";

export const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

  return `https://${baseUrl}`;
};

export const BASE_URL = isProd ? getBaseUrl() : LOCAL_HOST;
