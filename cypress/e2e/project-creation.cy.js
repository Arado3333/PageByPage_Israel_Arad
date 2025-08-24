describe("Project Creation Tests", () => {
  const validProject = {
    title: "Test Project",
    author: "Test Author",
    tags: "Fiction, Sci-fi, Adventure",
    description: "This is a test project description for testing purposes.",
    status: "Draft",
  };

  const invalidProject = {
    title: "",
    author: "",
    tags: "",
    description: "",
    status: "Draft",
  };

  beforeEach(() => {
    // Clear cookies and localStorage before each test
    cy.clearCookies();
    cy.clearLocalStorage();

    // Login before each test
    cy.visit("http://localhost:3000/signin");
    cy.get('input[name="email"]').type("test1@test.com");
    cy.get('input[name="password"]').type("Aa135123!");
    cy.get('button[type="submit"]').click();
    cy.wait(2000);
    cy.url().should("include", "/dashboard");
  });

  describe("Navigation to Project Creation", () => {
    it("should navigate to books page and show new project button", () => {
      // Navigate to books page
      cy.visit("http://localhost:3000/books");
      cy.wait(1000);

      // Check for the New Book button
      cy.get("[data-testid='cypress-new-project-btn']").should("be.visible");
      cy.get("[data-testid='cypress-new-project-btn']").should("contain", "New Project");
    });

    it("should open new project form when New Book button is clicked", () => {
      cy.visit("http://localhost:3000/books");
      cy.wait(1000);

      // Click the New Book button
      cy.get("[data-testid='cypress-new-project-btn']").click();

      // Should show the new project form
      cy.get("h1").should("contain", "Create New Project");
      cy.get("form").should("be.visible");
    });

    it("should show create first book button when no books exist", () => {
      cy.visit("http://localhost:3000/books");
      cy.wait(1000);

      // If no books exist, should show "Create Your First Book" button
      cy.get("body").then(($body) => {
        if (
          $body.find("button").contains("Create Your First Book").length > 0
        ) {
          cy.get("button")
            .contains("Create Your First Book")
            .should("be.visible");
          cy.get("button").contains("Create Your First Book").click();
          cy.get("h1").should("contain", "Create New Project");
        }
      });
    });
  });

  describe("New Project Form", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/books");
      cy.wait(1000);
      cy.get("[data-testid='cypress-new-project-btn']").click();
    });

    it("should load the new project form correctly", () => {
      // Check for essential form elements
      cy.get("h1").should("contain", "Create New Project");
      cy.get('input[id="title"]').should("be.visible");
      cy.get('input[id="author"]').should("be.visible");
      cy.get('input[id="tags"]').should("be.visible");
      cy.get('select[id="status"]').should("be.visible");
      cy.get('textarea[id="description"]').should("be.visible");
      cy.get('button[type="submit"]').should("be.visible");
      cy.get("button").contains("Cancel").should("be.visible");
    });

    it("should have proper form labels", () => {
      cy.get('label[for="title"]').should("contain", "Project Title");
      cy.get('label[for="author"]').should("contain", "Author");
      cy.get('label[for="tags"]').should("contain", "Tags");
      cy.get('label[for="status"]').should("contain", "Status");
      cy.get('label[for="description"]').should("contain", "Description");
    });

    it("should have proper input types and attributes", () => {
      cy.get('input[id="title"]').should("have.attr", "type", "text");
      cy.get('input[id="author"]').should("have.attr", "type", "text");
      cy.get('input[id="tags"]').should("have.attr", "type", "text");
      cy.get('select[id="status"]').should("be.visible");
      cy.get('textarea[id="description"]').should("be.visible");
    });

    it("should have required attributes for mandatory fields", () => {
      cy.get('input[id="title"]').should("have.attr", "required");
      cy.get('input[id="author"]').should("have.attr", "required");
      cy.get('select[id="status"]').should("have.attr", "required");
    });

    it("should have proper placeholders", () => {
      cy.get('input[id="title"]').should(
        "have.attr",
        "placeholder",
        "Enter your project title"
      );
      cy.get('input[id="author"]').should(
        "have.attr",
        "placeholder",
        "Who's writing the book?"
      );
      cy.get('input[id="tags"]').should(
        "have.attr",
        "placeholder",
        "Fiction, Memoir, Sci-fi (comma separated)"
      );
      cy.get('textarea[id="description"]').should(
        "have.attr",
        "placeholder",
        "Brief description of your project"
      );
    });

    it("should have proper status options", () => {
      cy.get('select[id="status"] option[value="Draft"]').should("be.visible");
      cy.get('select[id="status"] option[value="In Progress"]').should(
        "be.visible"
      );
      cy.get('select[id="status"]').should("have.value", "Draft");
    });
  });

  describe("Successful Project Creation", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/books");
      cy.wait(1000);
      cy.get("[data-testid='cypress-new-project-btn']").click();
    });

    it("should create project successfully with all fields filled", () => {
      // Fill in the project form
      cy.get('input[id="title"]').type(validProject.title);
      cy.get('input[id="author"]').type(validProject.author);
      cy.get('input[id="tags"]').type(validProject.tags);
      cy.get('select[id="status"]').select(validProject.status);
      cy.get('textarea[id="description"]').type(validProject.description);

      // Submit the form
      cy.get('button[type="submit"]').click();

      // Wait for project creation to complete
      cy.wait(2000);

      // Should redirect back to books page
      cy.url().should("include", "/books");

      // Should show the newly created project in the library
      cy.get("h1").should("contain", "My Books Library");
      cy.get(".card").should("contain", validProject.title);
    });

    it("should create project with minimal required fields", () => {
      // Fill only required fields
      cy.get('input[id="title"]').type("Minimal Project");
      cy.get('input[id="author"]').type("Minimal Author");

      // Submit the form
      cy.get('button[type="submit"]').click();

      // Wait for project creation to complete
      cy.wait(2000);

      // Should redirect back to books page
      cy.url().should("include", "/books");

      // Should show the newly created project
      cy.get(".card").should("contain", "Minimal Project");
    });

    it("should handle tags with commas correctly", () => {
      // Fill in the project form with tags
      cy.get('input[id="title"]').type("Tagged Project");
      cy.get('input[id="author"]').type("Tag Author");
      cy.get('input[id="tags"]').type("Fiction, Sci-fi, Adventure, Mystery");

      // Submit the form
      cy.get('button[type="submit"]').click();

      // Wait for project creation to complete
      cy.wait(2000);

      // Should redirect back to books page
      cy.url().should("include", "/books");

      // Should show the newly created project
      cy.get(".card").should("contain", "Tagged Project");
    });

    it("should create project with different status", () => {
      // Fill in the project form
      cy.get('input[id="title"]').type("In Progress Project");
      cy.get('input[id="author"]').type("Progress Author");
      cy.get('select[id="status"]').select("In Progress");

      // Submit the form
      cy.get('button[type="submit"]').click();

      // Wait for project creation to complete
      cy.wait(2000);

      // Should redirect back to books page
      cy.url().should("include", "/books");

      // Should show the newly created project
      cy.get(".card").should("contain", "In Progress Project");
    });
  });

  describe("Form Validation", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/books");
      cy.wait(1000);
      cy.get("[data-testid='cypress-new-project-btn']").click();
    });

    it("should prevent submission with empty title", () => {
      // Fill all fields except title
      cy.get('input[id="author"]').type(validProject.author);
      cy.get('input[id="tags"]').type(validProject.tags);
      cy.get('textarea[id="description"]').type(validProject.description);

      // Submit button should be disabled
      cy.get('button[type="submit"]').should("be.disabled");
    });

    it("should prevent submission with empty author", () => {
      // Fill all fields except author
      cy.get('input[id="title"]').type(validProject.title);
      cy.get('input[id="tags"]').type(validProject.tags);
      cy.get('textarea[id="description"]').type(validProject.description);

      // Submit button should be disabled
      cy.get('button[type="submit"]').should("be.disabled");
    });

    it("should allow submission with empty optional fields", () => {
      // Fill only required fields
      cy.get('input[id="title"]').type("Optional Fields Project");
      cy.get('input[id="author"]').type("Optional Author");

      // Submit button should be enabled
      cy.get('button[type="submit"]').should("not.be.disabled");

      // Submit the form
      cy.get('button[type="submit"]').click();

      // Wait for project creation to complete
      cy.wait(2000);

      // Should redirect back to books page
      cy.url().should("include", "/books");
    });

    it("should trim whitespace from title", () => {
      // Fill title with leading/trailing spaces
      cy.get('input[id="title"]').type("  Trimmed Title  ");
      cy.get('input[id="author"]').type("Trim Author");

      // Submit the form
      cy.get('button[type="submit"]').click();

      // Wait for project creation to complete
      cy.wait(2000);

      // Should redirect back to books page
      cy.url().should("include", "/books");

      // Should show the trimmed title
      cy.get(".card").should("contain", "Trimmed Title");
    });
  });

  describe("Cancel Functionality", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/books");
      cy.wait(1000);
      cy.get("[data-testid='cypress-new-project-btn']").click();
    });

    it("should return to books page when cancel is clicked", () => {
      // Fill some data
      cy.get('input[id="title"]').type("Cancel Test Project");
      cy.get('input[id="author"]').type("Cancel Author");

      // Click cancel button
      cy.get("button").contains("Cancel").click();

      // Should return to books page
      cy.url().should("include", "/books");
      cy.get("h1").should("contain", "My Books Library");
    });

    it("should not create project when cancel is clicked", () => {
      // Fill some data
      cy.get('input[id="title"]').type("Cancel Test Project");
      cy.get('input[id="author"]').type("Cancel Author");

      // Click cancel button
      cy.get("button").contains("Cancel").click();

      // Should return to books page
      cy.url().should("include", "/books");

      // Should not show the project that was being created
      cy.get(".card").should("not.contain", "Cancel Test Project");
    });
  });

  describe("Project Library Display", () => {
    beforeEach(() => {
      // Create a test project first
      cy.visit("http://localhost:3000/books");
      cy.wait(1000);
      cy.get("[data-testid='cypress-new-project-btn']").click();
      cy.get('input[id="title"]').type("Library Test Project");
      cy.get('input[id="author"]').type("Library Author");
      cy.get('input[id="tags"]').type("Test, Library");
      cy.get('textarea[id="description"]').type(
        "This is a test project for library display"
      );
      cy.get('button[type="submit"]').click();
      cy.wait(2000);
    });

    it("should display created project in library", () => {
      // Should be on books page
      cy.url().should("include", "/books");

      // Should show the created project
      cy.get(".card").should("contain", "Library Test Project");
      cy.get(".card").should("contain", "Library Author");
    });

    it("should display project details correctly", () => {
      // Should show project title
      cy.get(".card").should("contain", "Library Test Project");

      // Should show author
      cy.get(".card").should("contain", "Library Author");

      // Should show status badge
      cy.get(".badge").should("contain", "Draft");

      // Should show tags
      cy.get(".badge").should("contain", "Test");
      cy.get(".badge").should("contain", "Library");
    });

    it("should show project actions", () => {
      // Should show action buttons
      cy.get("button").contains("View").should("be.visible");
      cy.get("button").contains("Edit").should("be.visible");
      cy.get("button").contains("Delete").should("be.visible");
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/books");
      cy.wait(1000);
      cy.get("[data-testid='cypress-new-project-btn']").click();
    });

    it("should handle network errors gracefully", () => {
      // Intercept the API call and force an error
      cy.intercept("POST", "**/api/projects/**", { forceNetworkError: true });

      // Fill and submit form
      cy.get('input[id="title"]').type("Error Test Project");
      cy.get('input[id="author"]').type("Error Author");
      cy.get('button[type="submit"]').click();

      // Should handle the error gracefully
      cy.wait(2000);
    });

    it("should handle server errors gracefully", () => {
      // Intercept the API call and return an error
      cy.intercept("POST", "**/api/projects/**", {
        statusCode: 500,
        body: { message: "Internal server error" },
      });

      // Fill and submit form
      cy.get('input[id="title"]').type("Server Error Project");
      cy.get('input[id="author"]').type("Server Author");
      cy.get('button[type="submit"]').click();

      // Should handle the error gracefully
      cy.wait(2000);
    });
  });

  describe("Accessibility", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/books");
      cy.wait(1000);
      cy.get("[data-testid='cypress-new-project-btn']").click();
    });

    it("should have proper tab order", () => {
      // Tab through form elements
      cy.get("body").tab();
      cy.focused().should("have.attr", "id", "title");

      cy.get("body").tab();
      cy.focused().should("have.attr", "id", "author");

      cy.get("body").tab();
      cy.focused().should("have.attr", "id", "tags");

      cy.get("body").tab();
      cy.focused().should("have.attr", "id", "status");

      cy.get("body").tab();
      cy.focused().should("have.attr", "id", "description");
    });

    it("should have proper ARIA labels", () => {
      // Check that form elements have proper labels
      cy.get('input[id="title"]').should("have.attr", "required");
      cy.get('input[id="author"]').should("have.attr", "required");
      cy.get('select[id="status"]').should("have.attr", "required");
    });
  });
});
