describe("Login Test", () => {
  it("should login successfully", () => {
    // Visit the login page
    cy.visit("http://localhost:3000");

    // Fill in the login form
    cy.get('input[name="email"]').type("test1@test.com");
    cy.get('input[name="password"]').type("Aa135123!");

    // Submit the form
    cy.get('button[type="submit"]').click();

    cy.wait(10000);
    // Verify successful login - should redirect to dashboard
    cy.url().should("include", "/dashboard");
  });
});

