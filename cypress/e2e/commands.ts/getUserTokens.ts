import { auth } from "../auth";

const defaultCredentials = {
  username: Cypress.env("auth0Username"),
  password: Cypress.env("auth0Password"),
};

Cypress.Commands.add("getUserTokens", (credentials = defaultCredentials) => {
  const { username, password } = credentials;

  return cy.wrap(
    new Cypress.Promise((resolve, reject) => {
      auth.client.loginWithDefaultDirectory(
        {
          username,
          password,
          audience: Cypress.env("auth0Audience"),
          scope: Cypress.env("auth0Scope"),
          client_secret: Cypress.env("auth0ClientSecret"),
        },
        (err: any, response: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        }
      );
    })
  );
});
