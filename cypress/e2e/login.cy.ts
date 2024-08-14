describe("Test login", () => {
  it("should login and authenticate an API call", () => {
    cy.login().then(() => {
      cy.request("http://localhost:3000/api/auth/me").then(({ body: user }) => {
        expect(user).to.have.property("sub");
        expect(user).to.have.property("email");

        const { email, sub } = user;

        expect(email).to.equal(credentialsDefault.username);
        expect(sub).to.be.a("string");
      });
    });
  });
  it("should display login prompt when user is not logged in", () => {
    cy.clearCookies();
    cy.visit("/");
    cy.contains("Logg inn").should("exist");
    cy.contains("Logg inn").click();

    cy.get('input[name="username"]').type(Cypress.env("EMAIL"));
    cy.wait(1000);
    cy.get('button[data-action-button-primary="true"]').click();
    cy.wait(1000);
    cy.get('input[name="password"]').type(Cypress.env("PASSWORD"));
    cy.wait(1000);
    cy.get('button[data-action-button-primary="true"]').click();
    cy.wait(1000);
  });
});
