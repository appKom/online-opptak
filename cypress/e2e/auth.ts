import auth0 from "auth0-js";

export const auth = new auth0.WebAuth({
  domain: Cypress.env("auth0Domain"),
  clientID: Cypress.env("auth0ClientId"),
});
