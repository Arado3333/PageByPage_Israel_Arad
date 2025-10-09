/**
 * Client-side authentication utilities
 * These functions work in client components and use browser APIs
 */

/**
 * Get JWT token from cookies (client-side)
 */
export function getTokenFromCookies() {
  if (typeof document === "undefined") {
    return null; // Server-side rendering
  }

  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("authToken=")
  );

  if (tokenCookie) {
    return tokenCookie.split("=")[1];
  }

  return null;
}

/**
 * Get user data from JWT token (client-side)
 */
export function getUserFromToken(token) {
  if (!token) {
    return null;
  }

  try {
    // Decode JWT token (client-side)
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

/**
 * Check if user is authenticated (client-side)
 */
export function isAuthenticated() {
  const token = getTokenFromCookies();
  if (!token) {
    return false;
  }

  const user = getUserFromToken(token);
  if (!user) {
    return false;
  }

  // Check if token is expired
  const currentTime = Date.now() / 1000;
  if (user.exp && user.exp < currentTime) {
    return false;
  }

  return true;
}

/**
 * Check if user has admin role (client-side)
 */
export function isAdmin() {
  const token = getTokenFromCookies();
  if (!token) {
    return false;
  }

  const user = getUserFromToken(token);
  if (!user) {
    return false;
  }

  return user.role === "admin";
}

/**
 * Get current user data (client-side)
 */
export function getCurrentUser() {
  const token = getTokenFromCookies();
  if (!token) {
    return null;
  }

  return getUserFromToken(token);
}

/**
 * Clear authentication (client-side)
 */
export function clearAuth() {
  if (typeof document !== "undefined") {
    // Remove auth token cookie
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
}
