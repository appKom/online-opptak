import { auth } from "../auth";

Cypress.Commands.add("getUserInfo", (accessToken) => {
  return cy.wrap(
    new Cypress.Promise((resolve, reject) => {
      auth.client.userInfo(accessToken, (err: any, user: any) => {
        if (err) {
          reject(err);
        }

        resolve(user);
      });
    })
  );
});
