import { defineConfig } from "cypress";
require("dotenv").config();

export default defineConfig({
  e2e: {
    chromeWebSecurity: false,
    baseUrl: "http://localhost:3000",
  },
  env: {
    auth0_username: process.env.AUTH0_USERNAME,
    auth0_password: process.env.AUTH0_PASSWORD,
    auth0_domain: "https://auth.online.ntnu.no",
    auth0_audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    auth0_scope: process.env.REACT_APP_AUTH0_SCOPE,
    auth0_client_id: process.env.REACT_APP_AUTH0_CLIENTID,
    auth0_client_secret: process.env.AUTH0_CLIENT_SECRET,
  },
});
