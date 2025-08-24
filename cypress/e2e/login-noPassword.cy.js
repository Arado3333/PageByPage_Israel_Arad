it("should not login with no password", () => {
  // Visit the login page
  cy.visit("http://localhost:3000/signin");

  // Fill in the login form
  cy.get('input[name="email"]').type("test1@test.com");

  // Submit the form
  cy.get('button[type="submit"]').click();

  // Verify that the user is not logged in
  cy.url().should("include", "/signin");
  cy.get("[data-testid='cypress-signin-title']").should("contain", "Sign In");
});