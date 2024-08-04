describe("Test login", () => {
  it("should display login prompt when user is not logged in", () => {
    cy.session([Cypress.env("EMAIL"), Cypress.env("PASSWORD")], () => {
      cy.visit("/");
      cy.contains("Logg inn").should("exist");
      cy.contains("Logg inn").click();

      const auth0Issuer = Cypress.env("AUTH0_ISSUER");

      cy.origin(
        auth0Issuer,
        {
          args: {
            email: Cypress.env("EMAIL"),
            password: Cypress.env("PASSWORD"),
          },
        },
        ({ email, password }) => {
          cy.get('input[name="username"]').type(email);
          cy.wait(1000);
          cy.get('button[data-action-button-primary="true"]').click();
          cy.wait(1000);
          cy.get('input[name="password"]').type(password);
          cy.wait(1000);
          cy.get('button[data-action-button-primary="true"]').click();
          cy.wait(1000);
        }
      );
    });
  });
});
