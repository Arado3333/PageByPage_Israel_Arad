"use client";

/**
 * Utility functions for managing task data in localStorage
 * to persist between page refreshes
 */

const TASKS_STORAGE_KEY = "page-by-page-tasks";
const TASKS_TIMESTAMP_KEY = "page-by-page-tasks-timestamp";
const TASKS_CACHE_DURATION = 1000 * 60 * 30; // 30 minutes in milliseconds

/**
 * Save tasks to localStorage
 * @param {Array} tasks - Array of task objects
 */
export function saveTasks(tasks) {
    if (typeof window !== "undefined") {
        try {
            localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
            localStorage.setItem(TASKS_TIMESTAMP_KEY, Date.now().toString());
        } catch (error) {
            console.error("Error saving tasks to localStorage:", error);
        }
    }
}

/**
 * Get tasks from localStorage
 * @returns {Array|null} Array of task objects or null if not found
 */
export function getTasks() {
    if (typeof window !== "undefined") {
        try {
            const tasksJson = localStorage.getItem(TASKS_STORAGE_KEY);
            if (!tasksJson) return null;
            return JSON.parse(tasksJson);
        } catch (error) {
            console.error("Error retrieving tasks from localStorage:", error);
            return null;
        }
    }
    return null;
}

/**
 * Check if cached tasks are still valid (not expired)
 * @returns {boolean} True if cache is valid, false otherwise
 */
export function isTaskCacheValid() {
    if (typeof window !== "undefined") {
        try {
            const timestamp = localStorage.getItem(TASKS_TIMESTAMP_KEY);
            if (!timestamp) return false;

            const lastUpdate = parseInt(timestamp, 10);
            const now = Date.now();

            // Return true if cache is less than TASKS_CACHE_DURATION old
            return now - lastUpdate < TASKS_CACHE_DURATION;
        } catch (error) {
            console.error("Error checking task cache validity:", error);
            return false;
        }
    }
    return false;
}

/**
 * Clear task cache
 */
export function clearTaskCache() {
    if (typeof window !== "undefined") {
        try {
            localStorage.removeItem(TASKS_STORAGE_KEY);
            localStorage.removeItem(TASKS_TIMESTAMP_KEY);
        } catch (error) {
            console.error("Error clearing task cache:", error);
        }
    }
}
