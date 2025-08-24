describe("Registration Tests", () => {
  const validUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "Test@123!",
    confirmPassword: "Test@123!",
  };

  const invalidUser = {
    name: "Invalid User",
    email: "invalid-email",
    password: "short",
    confirmPassword: "different",
  };

  beforeEach(() => {
    // Clear cookies and localStorage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe("Registration Page", () => {
    it("should load the registration page correctly", () => {
      cy.visit("http://localhost:3000/register");

      // Check for essential elements
      cy.get("h1").should("contain", "Create Account");
      cy.get("p").should("contain", "Join Page by Page");
      cy.get('input[id="email"]').should("be.visible");
      cy.get('input[id="name"]').should("be.visible");
      cy.get('input[id="password"]').should("be.visible");
      cy.get('input[id="confirmPassword"]').should("be.visible");
      cy.get('button[type="submit"]').should("be.visible");
      cy.get('a[href="/signin"]').should("be.visible");
    });

    it("should have proper form labels", () => {
      cy.visit("http://localhost:3000/register");

      cy.get('label[for="email"]').should("contain", "Email");
      cy.get('label[for="name"]').should("contain", "Name");
      cy.get('label[for="password"]').should("contain", "Password");
      cy.get('label[for="confirmPassword"]').should(
        "contain",
        "Confirm Password"
      );
    });

    it("should have proper input types", () => {
      cy.visit("http://localhost:3000/register");

      cy.get('input[id="email"]').should("have.attr", "type", "email");
      cy.get('input[id="name"]').should("have.attr", "type", "text");
      cy.get('input[id="password"]').should("have.attr", "type", "password");
      cy.get('input[id="confirmPassword"]').should(
        "have.attr",
        "type",
        "password"
      );
    });

    it("should have required attributes", () => {
      cy.visit("http://localhost:3000/register");

      cy.get('input[id="email"]').should("have.attr", "required");
      cy.get('input[id="name"]').should("have.attr", "required");
      cy.get('input[id="password"]').should("have.attr", "required");
      cy.get('input[id="confirmPassword"]').should("have.attr", "required");
    });
  });

  describe("Successful Registration", () => {
    it("should register successfully with valid data", () => {
      cy.visit("http://localhost:3000/register");

      // Fill in the registration form
      cy.get('input[id="name"]').type(validUser.name);
      cy.get('input[id="email"]').type(validUser.email);
      cy.get('input[id="password"]').type(validUser.password);
      cy.get('input[id="confirmPassword"]').type(validUser.confirmPassword);

      // Submit the form
      cy.get('button[type="submit"]').click();

      // Wait for registration to complete
      cy.wait(2000);

      // Should show success message
      cy.get(".auth-success").should("be.visible");
      cy.get(".auth-success").should("contain", "successfully");

      // Should redirect to signin page
      cy.url().should("include", "/signin");
    });

    it("should show loading state during registration", () => {
      cy.visit("http://localhost:3000/register");

      // Fill in the registration form
      cy.get('input[id="name"]').type(validUser.name);
      cy.get('input[id="email"]').type(validUser.email);
      cy.get('input[id="password"]').type(validUser.password);
      cy.get('input[id="confirmPassword"]').type(validUser.confirmPassword);

      // Submit the form
      cy.get('button[type="submit"]').click();

      // Should show loading state
      cy.get('button[type="submit"]').should("contain", "Loading...");
      cy.get(".register-icon").should("have.class", "spinning");
    });
  });

  describe("Password Validation", () => {
    it("should show error for password less than 6 characters", () => {
      cy.visit("http://localhost:3000/register");

      cy.get('input[id="name"]').type(validUser.name);
      cy.get('input[id="email"]').type(validUser.email);
      cy.get('input[id="password"]').type("short");
      cy.get('input[id="confirmPassword"]').type("short");

      cy.get('button[type="submit"]').click();

      cy.get(".auth-error").should("be.visible");
      cy.get(".auth-error").should("contain", "at least 6 characters");
    });

    it("should show error for password without special characters", () => {
      cy.visit("http://localhost:3000/register");

      cy.get('input[id="name"]').type(validUser.name);
      cy.get('input[id="email"]').type(validUser.email);
      cy.get('input[id="password"]').type("password123");
      cy.get('input[id="confirmPassword"]').type("password123");

      cy.get('button[type="submit"]').click();

      cy.get(".auth-error").should("be.visible");
      cy.get(".auth-error").should("contain", "special character");
    });

    it("should show error when passwords do not match", () => {
      cy.visit("http://localhost:3000/register");

      cy.get('input[id="name"]').type(validUser.name);
      cy.get('input[id="email"]').type(validUser.email);
      cy.get('input[id="password"]').type(validUser.password);
      cy.get('input[id="confirmPassword"]').type("differentpassword");

      cy.get('button[type="submit"]').click();

      cy.get(".auth-error").should("be.visible");
      cy.get(".auth-error").should("contain", "do not match");
    });
  });

  describe("Email Validation", () => {
    it("should show error for invalid email format", () => {
      cy.visit("http://localhost:3000/register");

      cy.get('input[id="name"]').type(validUser.name);
      cy.get('input[id="email"]').type("invalid-email");
      cy.get('input[id="password"]').type(validUser.password);
      cy.get('input[id="confirmPassword"]').type(validUser.confirmPassword);

      cy.get('button[type="submit"]').click();

      // Browser validation should prevent submission
      cy.url().should("include", "/register");
    });

    it("should show error for empty email", () => {
      cy.visit("http://localhost:3000/register");

      cy.get('input[id="name"]').type(validUser.name);
      cy.get('input[id="password"]').type(validUser.password);
      cy.get('input[id="confirmPassword"]').type(validUser.confirmPassword);

      cy.get('button[type="submit"]').click();

      // Form validation should prevent submission
      cy.url().should("include", "/register");
    });
  });

  describe("Password Visibility Toggle", () => {
    it("should toggle password visibility", () => {
      cy.visit("http://localhost:3000/register");

      // Password should be hidden by default
      cy.get('input[id="password"]').should("have.attr", "type", "password");
      cy.get('input[id="confirmPassword"]').should(
        "have.attr",
        "type",
        "password"
      );

      // Click the eye icon to show password
      cy.get(".password-toggle").first().click();
      cy.get('input[id="password"]').should("have.attr", "type", "text");

      // Click again to hide password
      cy.get(".password-toggle").first().click();
      cy.get('input[id="password"]').should("have.attr", "type", "password");
    });

    it("should toggle confirm password visibility", () => {
      cy.visit("http://localhost:3000/register");

      // Confirm password should be hidden by default
      cy.get('input[id="confirmPassword"]').should(
        "have.attr",
        "type",
        "password"
      );

      // Click the eye icon to show confirm password
      cy.get(".password-toggle").last().click();
      cy.get('input[id="confirmPassword"]').should("have.attr", "type", "text");

      // Click again to hide confirm password
      cy.get(".password-toggle").last().click();
      cy.get('input[id="confirmPassword"]').should(
        "have.attr",
        "type",
        "password"
      );
    });
  });

  describe("Form Validation", () => {
    it("should prevent submission with empty fields", () => {
      cy.visit("http://localhost:3000/register");

      // Try to submit empty form
      cy.get('button[type="submit"]').click();

      // Should stay on registration page
      cy.url().should("include", "/register");
    });

    it("should clear form fields after successful registration", () => {
      cy.visit("http://localhost:3000/register");

      // Fill in the registration form
      cy.get('input[id="name"]').type(validUser.name);
      cy.get('input[id="email"]').type(validUser.email);
      cy.get('input[id="password"]').type(validUser.password);
      cy.get('input[id="confirmPassword"]').type(validUser.confirmPassword);

      // Submit the form
      cy.get('button[type="submit"]').click();

      // Wait for registration to complete
      cy.wait(2000);

      // Should redirect to signin page
      cy.url().should("include", "/signin");

      // Go back to register page
      cy.visit("http://localhost:3000/register");

      // Form fields should be empty
      cy.get('input[id="name"]').should("have.value", "");
      cy.get('input[id="email"]').should("have.value", "");
      cy.get('input[id="password"]').should("have.value", "");
      cy.get('input[id="confirmPassword"]').should("have.value", "");
    });
  });

  describe("Navigation Links", () => {
    it("should have link to signin page", () => {
      cy.visit("http://localhost:3000/register");

      cy.get('a[href="/signin"]').should("be.visible");
      cy.get('a[href="/signin"]').should("contain", "Sign In");
    });

    it("should navigate to signin page when link is clicked", () => {
      cy.visit("http://localhost:3000/register");

      cy.get('a[href="/signin"]').click();
      cy.url().should("include", "/signin");
    });
  });

  describe("Error Handling", () => {
    it("should show error for duplicate email", () => {
      // First registration
      cy.visit("http://localhost:3000/register");
      cy.get('input[id="name"]').type(validUser.name);
      cy.get('input[id="email"]').type(validUser.email);
      cy.get('input[id="password"]').type(validUser.password);
      cy.get('input[id="confirmPassword"]').type(validUser.confirmPassword);
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Try to register with same email
      cy.visit("http://localhost:3000/register");
      cy.get('input[id="name"]').type("Another User");
      cy.get('input[id="email"]').type(validUser.email);
      cy.get('input[id="password"]').type(validUser.password);
      cy.get('input[id="confirmPassword"]').type(validUser.confirmPassword);
      cy.get('button[type="submit"]').click();

      // Should show error
      cy.get(".auth-error").should("be.visible");
    });

    it("should clear error message when form is modified", () => {
      cy.visit("http://localhost:3000/register");

      // Trigger an error
      cy.get('input[id="password"]').type("short");
      cy.get('input[id="confirmPassword"]').type("short");
      cy.get('button[type="submit"]').click();

      // Should show error
      cy.get(".auth-error").should("be.visible");

      // Modify the form
      cy.get('input[id="password"]').clear().type(validUser.password);
      cy.get('input[id="confirmPassword"]')
        .clear()
        .type(validUser.confirmPassword);

      // Error should still be visible until form is submitted again
      cy.get(".auth-error").should("be.visible");
    });
  });

  describe("Accessibility", () => {
    it("should have proper tab order", () => {
      cy.visit("http://localhost:3000/register");

      // Tab through form elements
      cy.get("body").tab();
      cy.focused().should("have.attr", "id", "name");

      cy.get("body").tab();
      cy.focused().should("have.attr", "id", "email");

      cy.get("body").tab();
      cy.focused().should("have.attr", "id", "password");

      cy.get("body").tab();
      cy.focused().should("have.attr", "id", "confirmPassword");
    });

    it("should have proper ARIA labels", () => {
      cy.visit("http://localhost:3000/register");

      // Check that password toggle buttons have proper attributes
      cy.get(".password-toggle").should("have.attr", "tabindex", "-1");
    });
  });
});
