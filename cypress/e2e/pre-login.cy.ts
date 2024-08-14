describe("Home Page Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display login prompt when user is not logged in", () => {
    cy.contains(
      "Vennligst logg inn for å få tilgang til opptakssystemet"
    ).should("exist");
  });

  it("should display login prompt when user is not logged in on small screens", () => {
    cy.viewport("iphone-6");
    cy.contains(
      "Vennligst logg inn for å få tilgang til opptakssystemet"
    ).should("exist");
  });
});

describe("Navbar Component Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display login button when user is not logged in", () => {
    cy.contains("Logg inn").should("exist");
  });

  it("should toggle dropdown menu on small screens", () => {
    cy.viewport("iphone-6");
    cy.get('[data-cy="toggle-dropdown"]').click();

    cy.get('[data-cy="dropdown-menu"]').should("exist");
    cy.get('[data-cy="dropdown-menu"]').should("be.visible");

    cy.get('[data-cy="toggle-dropdown"]').click();
    cy.get('[data-cy="dropdown-menu"]').should("not.exist");
  });
});

describe("Footer Component Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display correct contact information", () => {
    cy.contains("Skjedd en feil? Ta kontakt med").should("exist");
    cy.contains("Appkom").should(
      "have.attr",
      "href",
      "mailto:appkom@online.ntnu.no"
    );
  });

  it("should display correct contact information on small screens", () => {
    cy.viewport("iphone-6");
    cy.contains("Skjedd en feil? Ta kontakt med").should("exist");
    cy.contains("Appkom").should(
      "have.attr",
      "href",
      "mailto:appkom@online.ntnu.no"
    );
  });
});
