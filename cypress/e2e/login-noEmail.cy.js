it("should not login with no email", () => {
  // Visit the login page
  cy.visit("http://localhost:3000/signin");

  // Fill in the login form
  cy.get('input[name="password"]').type("Aa135123!");

  // Submit the form
  cy.get('button[type="submit"]').click();

  // Verify that the user is not logged in
  cy.url().should("include", "/signin");
  cy.get("[data-testid='cypress-signin-title']").should("contain", "Sign In");
});