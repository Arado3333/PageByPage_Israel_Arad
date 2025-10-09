/**
 * Client-side logging system for admin events
 * Stores logs in localStorage with automatic rotation
 * User-specific logging system
 */

import { getTokenFromCookies, getUserFromToken } from "./clientAuth.js";

const LOG_STORAGE_PREFIX = "admin_logs_";
const MAX_LOGS = 1000;

/**
 * Get the storage key for a specific user
 * @param {string} userId - User ID
 * @returns {string} Storage key
 */
function getLogStorageKey(userId) {
  return `${LOG_STORAGE_PREFIX}${userId}`;
}

/**
 * Get current user ID from JWT token in cookies
 * @returns {string|null} Current user ID
 */
function getCurrentUserId() {
  try {
    const token = getTokenFromCookies();
    if (!token) {
      return null;
    }

    const user = getUserFromToken(token);
    if (!user) {
      return null;
    }

    return user.userId || user.id || user.sub || user._id;
  } catch (error) {
    console.error("Error getting current user ID:", error);
    return null;
  }
}

/**
 * Get current user email from JWT token in cookies
 * @returns {string|null} Current user email
 */
function getCurrentUserEmail() {
  try {
    const token = getTokenFromCookies();
    if (!token) {
      return null;
    }

    const user = getUserFromToken(token);
    if (!user) {
      return null;
    }

    return user.email || user.userEmail;
  } catch (error) {
    console.error("Error getting current user email:", error);
    return null;
  }
}

export const EVENT_TYPES = {
  AUTH: "auth",
  USER_MANAGEMENT: "user_management",
  BOOK: "book",
  CHAPTER: "chapter",
  DRAFT: "draft",
  AI_USAGE: "ai_usage",
  EXPORT: "export",
  SETTINGS: "settings",
};

/**
 * Log an event to localStorage (user-specific)
 * @param {Object} eventData - Event data to log
 * @param {string} userId - Optional user ID, will use current user if not provided
 */
export function logEvent(eventData, userId = null) {
  try {
    const currentUserId = userId || getCurrentUserId();

    if (!currentUserId) {
      console.warn("No user ID available for logging");
      return;
    }

    const logEntry = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      userId: currentUserId,
      ...eventData,
    };

    // Get existing logs for this user
    const existingLogs = getLogs(currentUserId);

    // Add new log entry
    const updatedLogs = [logEntry, ...existingLogs];

    // Keep only the most recent logs
    const trimmedLogs = updatedLogs.slice(0, MAX_LOGS);

    // Save to localStorage with user-specific key
    const storageKey = getLogStorageKey(currentUserId);
    localStorage.setItem(storageKey, JSON.stringify(trimmedLogs));

    console.log("Event logged for user:", currentUserId, logEntry);
  } catch (error) {
    console.error("Error logging event:", error);
  }
}

/**
 * Get all logs from localStorage (user-specific)
 * @param {string} userId - Optional user ID, will use current user if not provided
 * @returns {Array} Array of log entries
 */
export function getLogs(userId = null) {
  try {
    const currentUserId = userId || getCurrentUserId();

    if (!currentUserId) {
      console.warn("No user ID available for retrieving logs");
      return [];
    }

    const storageKey = getLogStorageKey(currentUserId);
    const logs = localStorage.getItem(storageKey);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error("Error retrieving logs:", error);
    return [];
  }
}

/**
 * Get filtered logs (user-specific)
 * @param {Object} filters - Filter options
 * @param {string} userId - Optional user ID, will use current user if not provided
 * @returns {Array} Filtered log entries
 */
export function getFilteredLogs(filters = {}, userId = null) {
  const logs = getLogs(userId);

  return logs.filter((log) => {
    // Filter by event type
    if (filters.eventType && log.eventType !== filters.eventType) {
      return false;
    }

    // Filter by user
    if (filters.userId && log.userId !== filters.userId) {
      return false;
    }

    // Filter by action
    if (filters.action && log.action !== filters.action) {
      return false;
    }

    // Filter by date range
    if (filters.startDate) {
      const logDate = new Date(log.timestamp);
      const startDate = new Date(filters.startDate);
      if (logDate < startDate) {
        return false;
      }
    }

    if (filters.endDate) {
      const logDate = new Date(log.timestamp);
      const endDate = new Date(filters.endDate);
      if (logDate > endDate) {
        return false;
      }
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = [
        log.action,
        log.resource,
        log.details?.message || "",
        log.userEmail || "",
      ]
        .join(" ")
        .toLowerCase();

      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Export logs to JSON (user-specific)
 * @param {Array} logs - Logs to export
 * @param {string} userId - Optional user ID, will use current user if not provided
 * @returns {string} JSON string
 */
export function exportLogsToJSON(logs = null, userId = null) {
  const logsToExport = logs || getLogs(userId);
  return JSON.stringify(logsToExport, null, 2);
}

/**
 * Export logs to CSV (user-specific)
 * @param {Array} logs - Logs to export
 * @param {string} userId - Optional user ID, will use current user if not provided
 * @returns {string} CSV string
 */
export function exportLogsToCSV(logs = null, userId = null) {
  const logsToExport = logs || getLogs(userId);

  if (logsToExport.length === 0) {
    return "";
  }

  // CSV headers
  const headers = [
    "Timestamp",
    "User ID",
    "User Email",
    "Event Type",
    "Action",
    "Resource",
    "Details",
  ];

  // CSV rows
  const rows = logsToExport.map((log) => [
    log.timestamp,
    log.userId || "",
    log.userEmail || "",
    log.eventType || "",
    log.action || "",
    log.resource || "",
    JSON.stringify(log.details || {}),
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) => row.map((field) => `"${field}"`).join(","))
    .join("\n");

  return csvContent;
}

/**
 * Clear all logs (user-specific)
 * @param {string} userId - Optional user ID, will use current user if not provided
 */
export function clearLogs(userId = null) {
  try {
    const currentUserId = userId || getCurrentUserId();

    if (!currentUserId) {
      console.warn("No user ID available for clearing logs");
      return;
    }

    const storageKey = getLogStorageKey(currentUserId);
    localStorage.removeItem(storageKey);
    console.log("Logs cleared for user:", currentUserId);
  } catch (error) {
    console.error("Error clearing logs:", error);
  }
}

/**
 * Get log statistics (user-specific)
 * @param {string} userId - Optional user ID, will use current user if not provided
 * @returns {Object} Log statistics
 */
export function getLogStats(userId = null) {
  const logs = getLogs(userId);

  const stats = {
    total: logs.length,
    byEventType: {},
    byAction: {},
    byUser: {},
    recentActivity: logs.slice(0, 10),
  };

  logs.forEach((log) => {
    // Count by event type
    stats.byEventType[log.eventType] =
      (stats.byEventType[log.eventType] || 0) + 1;

    // Count by action
    stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;

    // Count by user
    if (log.userEmail) {
      stats.byUser[log.userEmail] = (stats.byUser[log.userEmail] || 0) + 1;
    }
  });

  return stats;
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Log authentication events
 */
export function logAuthEvent(action, userId, userEmail, details = {}) {
  logEvent({
    eventType: EVENT_TYPES.AUTH,
    action,
    userId: userId || getCurrentUserId(),
    userEmail: userEmail || getCurrentUserEmail() || "unknown",
    details,
  });
}

/**
 * Log user management events
 */
export function logUserManagementEvent(
  action,
  userId,
  userEmail,
  details = {}
) {
  logEvent({
    eventType: EVENT_TYPES.USER_MANAGEMENT,
    action,
    userId: userId || getCurrentUserId(),
    userEmail: userEmail || getCurrentUserEmail() || "unknown",
    resource: "user",
    details,
  });
}

/**
 * Log book events
 */
export function logBookEvent(action, userId, userEmail, details = {}) {
  logEvent({
    eventType: EVENT_TYPES.BOOK,
    action,
    userId: userId || getCurrentUserId(),
    userEmail: userEmail || getCurrentUserEmail() || "unknown",
    resource: "book",
    details,
  });
}

/**
 * Log AI usage events
 */
export function logAIUsageEvent(action, userId, userEmail, details = {}) {
  logEvent({
    eventType: EVENT_TYPES.AI_USAGE,
    action,
    userId: userId || getCurrentUserId(),
    userEmail: userEmail || getCurrentUserEmail() || "unknown",
    resource: "ai_tool",
    details,
  });
}

/**
 * Get all user log keys (for admin purposes)
 * @returns {Array} Array of user IDs that have logs
 */
export function getAllUserLogKeys() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(LOG_STORAGE_PREFIX)) {
        const userId = key.replace(LOG_STORAGE_PREFIX, "");
        keys.push(userId);
      }
    }
    return keys;
  } catch (error) {
    console.error("Error getting user log keys:", error);
    return [];
  }
}

/**
 * Get logs for all users (admin function)
 * @returns {Array} Array of all logs from all users
 */
export function getAllUsersLogs() {
  try {
    const allLogs = [];
    const userKeys = getAllUserLogKeys();

    userKeys.forEach((userId) => {
      const userLogs = getLogs(userId);
      allLogs.push(...userLogs);
    });

    // Sort by timestamp (newest first)
    return allLogs.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  } catch (error) {
    console.error("Error getting all users logs:", error);
    return [];
  }
}

/**
 * Get filtered logs for all users (admin function)
 * @param {Object} filters - Filter options
 * @returns {Array} Filtered log entries from all users
 */
export function getAllUsersFilteredLogs(filters = {}) {
  const allLogs = getAllUsersLogs();

  return allLogs.filter((log) => {
    // Filter by event type
    if (filters.eventType && log.eventType !== filters.eventType) {
      return false;
    }

    // Filter by user
    if (filters.userId && log.userId !== filters.userId) {
      return false;
    }

    // Filter by action
    if (filters.action && log.action !== filters.action) {
      return false;
    }

    // Filter by date range
    if (filters.startDate) {
      const logDate = new Date(log.timestamp);
      const startDate = new Date(filters.startDate);
      if (logDate < startDate) {
        return false;
      }
    }

    if (filters.endDate) {
      const logDate = new Date(log.timestamp);
      const endDate = new Date(filters.endDate);
      if (logDate > endDate) {
        return false;
      }
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = [
        log.action,
        log.resource,
        log.details?.message || "",
        log.userEmail || "",
      ]
        .join(" ")
        .toLowerCase();

      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }

    return true;
  });
}
