describe("Theme Toggle Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("should display the initial theme as light or dark based on localStorage", () => {
    // Check the localStorage for theme setting
    cy.window().then((win) => {
      const theme = win.localStorage.getItem("theme");
      if (theme === "dark") {
        cy.get("html").should("have.class", "dark");
      } else {
        cy.get("html").should("not.have.class", "dark");
      }
    });
  });

  it("should toggle to dark theme and store in localStorage", () => {
    cy.get('[data-cy="theme-toggle"]').click();
    cy.get("html").should("have.class", "dark");

    // Check if localStorage is set to dark
    cy.window().then((win) => {
      expect(win.localStorage.getItem("theme")).to.equal("dark");
    });
  });

  it("should persist dark theme after page refresh", () => {
    cy.get('[data-cy="theme-toggle"]').click();
    cy.get("html").should("have.class", "dark");

    cy.reload();

    // Verify that the theme remains dark
    cy.get("html").should("have.class", "dark");
    cy.window().then((win) => {
      expect(win.localStorage.getItem("theme")).to.equal("dark");
    });
  });

  it("should toggle back to light theme and store in localStorage", () => {
    cy.get('[data-cy="theme-toggle"]').click();
    cy.get("html").should("have.class", "dark");

    cy.get('[data-cy="theme-toggle"]').click();
    cy.get("html").should("not.have.class", "dark");

    // Check if localStorage is set to light
    cy.window().then((win) => {
      expect(win.localStorage.getItem("theme")).to.equal("light");
    });
  });

  it("should persist light theme after page refresh", () => {
    cy.get('[data-cy="theme-toggle"]').click();
    cy.get("html").should("have.class", "dark");

    cy.get('[data-cy="theme-toggle"]').click();
    cy.get("html").should("not.have.class", "dark");

    cy.reload();

    // Verify that the theme remains light
    cy.get("html").should("not.have.class", "dark");
    cy.window().then((win) => {
      expect(win.localStorage.getItem("theme")).to.equal("light");
    });
  });
});
