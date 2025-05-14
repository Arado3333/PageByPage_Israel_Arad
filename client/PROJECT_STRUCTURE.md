# Project Structure and Overview

This document provides an overview of the project's structure, the relationships between directories, and guidance on where to start editing the code.

## Project Structure

```
components.json
next.config.mjs
package.json
pnpm-lock.yaml
postcss.config.mjs
server.js
tailwind.config.ts
app/
  ClientLayout.jsx
  globals.css
  layout.jsx
  page.jsx
  admin-dashboard/
    layout.jsx
    page.jsx
  ai-consultant/
    layout.jsx
    page.jsx
  analytics/
  book-editor/
    layout.jsx
    page.jsx
  books/
    layout.jsx
    page.jsx
  components/
    AppLayout.jsx
  contact/
    layout.jsx
    page.jsx
  context/
    AuthContext.jsx
  dashboard/
    layout.jsx
    page.jsx
  drafts/
    layout.jsx
    page.jsx
  forgot-password/
    page.jsx
  help/
  register/
    page.jsx
  reports/
  settings/
    layout.jsx
    page.jsx
  signin/
    page.jsx
  storage/
    layout.jsx
    page.jsx
  style/
    AdminDashboard.css
    AIConsultant.css
    AppLayout.css
    BookEditor.css
    Books.css
    ClientLayout.css
    Contact.css
    Dashboard.css
    DashboardLayout.css
    Drafts.css
    ForgotPassword.css
    HomePage.css
    Register.css
    Settings.css
    SignIn.css
    Storage.css
    SupportDashboard.css
    TaskManager.css
    VersionHistory.css
  support-dashboard/
    layout.jsx
    page.jsx
  task-manager/
    layout.jsx
    page.jsx
  users/
  version-history/
    layout.jsx
    page.jsx
components/
  ui/
    use-toast.ts
hooks/
  use-toast.ts
lib/
  utils.ts
public/
  placeholder-logo.png
  placeholder-logo.svg
  placeholder-user.jpg
  placeholder.jpg
  placeholder.svg
server/
  auth.js
  user.js
src/
  components/
    Card.jsx
    FormDescription.jsx
    PageHeader.jsx
  pages/
    AIAssistant.jsx
    Characters.jsx
    HelpCenter.jsx
    HomePage.jsx
    Insights.jsx
    PlotBuilder.jsx
    Settings.jsx
    VersionHistory.jsx
    WorldBuilding.jsx
    WritingGoals.jsx
  style/
    AIAssistant.css
    Characters.css
    global.css
    HelpCenter.css
    HomePage.css
    Insights.css
    PlotBuilder.css
    Settings.css
    VersionHistory.css
    WorldBuilding.css
    WritingGoals.css
styles/
  globals.css
```

## Directory Relationships and Purpose

### Root Files

-   **components.json**: Configuration for UI components, including Tailwind CSS and aliases.
-   **next.config.mjs**: Next.js configuration file with experimental features and build settings.
-   **package.json**: Contains project dependencies and scripts.
-   **tailwind.config.ts**: Tailwind CSS configuration file.

### `app/`

This directory contains the main application pages and layouts. Each subdirectory represents a feature or section of the app.

-   **`admin-dashboard/`**: Admin-specific pages.
-   **`ai-consultant/`**: AI-related features.
-   **`book-editor/`**: Book editing tools.
-   **`context/`**: Shared React contexts, e.g., `AuthContext.jsx` for authentication.
-   **`style/`**: CSS files for individual components and layouts.

### `components/`

Reusable UI components and utilities.

-   **`ui/`**: Contains utility hooks like `use-toast.ts`.

### `hooks/`

Custom React hooks for shared logic.

### `lib/`

Utility functions and shared logic.

### `public/`

Static assets like images and logos.

### `server/`

Backend logic and API routes.

-   **`auth.js`**: Authentication logic.
-   **`user.js`**: User-related logic.

### `src/`

Source files for additional components and pages.

-   **`components/`**: Reusable components like `Card.jsx`.
-   **`pages/`**: Individual pages for features like `AIAssistant.jsx` and `Settings.jsx`.
-   **`style/`**: CSS files for these pages.

## Where to Start Editing

### Frontend

-   **Layouts and Pages**: Start in the `app/` directory for main layouts and pages.
-   **Reusable Components**: Check `components/` and `src/components/` for shared UI elements.
-   **Styling**: Modify CSS files in `app/style/` or `src/style/`.

### Backend

-   **API Logic**: Edit files in the `server/` directory for backend functionality.

### Configuration

-   **Next.js Config**: Update `next.config.mjs` for build and runtime settings.
-   **Tailwind CSS**: Modify `tailwind.config.ts` for styling configurations.

### Utilities and Hooks

-   **Custom Hooks**: Add or edit logic in `hooks/`.
-   **Utility Functions**: Update shared logic in `lib/utils.ts`.

### Static Assets

-   Add or replace images in the `public/` directory.

This structure should help you navigate and edit the project efficiently.
