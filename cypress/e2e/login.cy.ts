describe("Test login", () => {
  it("should display login prompt when user is not logged in", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("Logg inn").should("exist");
    cy.contains("Logg inn").click();

    const auth0Issuer = Cypress.env("STAGE_AUTH0_ISSUER");

    cy.origin(auth0Issuer, () => {
      const email = Cypress.env("EMAIL");
      const password = Cypress.env("PASSWORD");

      // Ensure the environment variables are set
      expect(email).to.be.a("string").and.not.be.empty;
      expect(password).to.be.a("string").and.not.be.empty;

      cy.get('input[name="username"]').type(email);
      cy.get('button[data-action-button-primary="true"]').click();
      cy.get('input[name="password"]').type(password);
      cy.get('button[data-action-button-primary="true"]').click();
    });
  });
});
