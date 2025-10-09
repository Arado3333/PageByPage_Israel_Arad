/**
 * Client-side AI settings management system
 * Stores AI settings in localStorage with user-specific storage
 */

import { getTokenFromCookies, getUserFromToken } from "./clientAuth.js";

const AI_SETTINGS_PREFIX = "ai_settings_";
const GLOBAL_AI_SETTINGS_KEY = "ai_settings_global";

/**
 * Get the storage key for a specific user's AI settings
 * @param {string} userId - User ID
 * @returns {string} Storage key
 */
function getAISettingsStorageKey(userId) {
  return `${AI_SETTINGS_PREFIX}${userId}`;
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
 * Default AI settings
 */
const DEFAULT_AI_SETTINGS = {
  promptOverrides: {
    rewrite: "Please rewrite the following text to improve clarity and flow:",
    summarize: "Please provide a concise summary of the following text:",
    brainstorm: "Please help brainstorm ideas for the following topic:",
    edit: "Please help edit and improve the following text:",
    expand: "Please expand on the following text with more detail:",
  },
  tokenLimits: {
    maxInputTokens: 4000,
    maxOutputTokens: 2000,
  },
  customPrompts: [],
  systemInstructions: "",
  temperature: 0.7,
  model: "gemini-2.5-flash",
};

/**
 * Get user-specific AI settings
 * @param {string} userId - Optional user ID, will use current user if not provided
 * @returns {Object} User AI settings
 */
export function getUserAISettings(userId = null) {
  try {
    const currentUserId = userId || getCurrentUserId();

    if (!currentUserId) {
      console.warn("No user ID available for AI settings");
      return { ...DEFAULT_AI_SETTINGS };
    }

    const storageKey = getAISettingsStorageKey(currentUserId);
    const settings = localStorage.getItem(storageKey);

    if (settings) {
      const parsed = JSON.parse(settings);
      // Merge with defaults to ensure all properties exist
      return { ...DEFAULT_AI_SETTINGS, ...parsed };
    }

    return { ...DEFAULT_AI_SETTINGS };
  } catch (error) {
    console.error("Error getting user AI settings:", error);
    return { ...DEFAULT_AI_SETTINGS };
  }
}

/**
 * Save user-specific AI settings
 * @param {Object} settings - AI settings to save
 * @param {string} userId - Optional user ID, will use current user if not provided
 */
export function saveUserAISettings(settings, userId = null) {
  try {
    const currentUserId = userId || getCurrentUserId();

    if (!currentUserId) {
      console.warn("No user ID available for saving AI settings");
      return false;
    }

    const storageKey = getAISettingsStorageKey(currentUserId);
    localStorage.setItem(storageKey, JSON.stringify(settings));

    console.log("AI settings saved for user:", currentUserId);
    return true;
  } catch (error) {
    console.error("Error saving user AI settings:", error);
    return false;
  }
}

/**
 * Get global AI settings
 * @returns {Object} Global AI settings
 */
export function getGlobalAISettings() {
  try {
    const settings = localStorage.getItem(GLOBAL_AI_SETTINGS_KEY);

    if (settings) {
      const parsed = JSON.parse(settings);
      return { ...DEFAULT_AI_SETTINGS, ...parsed };
    }

    return { ...DEFAULT_AI_SETTINGS };
  } catch (error) {
    console.error("Error getting global AI settings:", error);
    return { ...DEFAULT_AI_SETTINGS };
  }
}

/**
 * Save global AI settings
 * @param {Object} settings - Global AI settings to save
 */
export function saveGlobalAISettings(settings) {
  try {
    localStorage.setItem(GLOBAL_AI_SETTINGS_KEY, JSON.stringify(settings));
    console.log("Global AI settings saved");
    return true;
  } catch (error) {
    console.error("Error saving global AI settings:", error);
    return false;
  }
}

/**
 * Get merged AI settings (user settings override global settings)
 * @param {string} userId - Optional user ID, will use current user if not provided
 * @returns {Object} Merged AI settings
 */
export function getMergedAISettings(userId = null) {
  try {
    const globalSettings = getGlobalAISettings();
    const userSettings = getUserAISettings(userId);

    // Deep merge user settings over global settings
    const merged = {
      ...globalSettings,
      ...userSettings,
      promptOverrides: {
        ...globalSettings.promptOverrides,
        ...userSettings.promptOverrides,
      },
      tokenLimits: {
        ...globalSettings.tokenLimits,
        ...userSettings.tokenLimits,
      },
    };

    return merged;
  } catch (error) {
    console.error("Error getting merged AI settings:", error);
    return { ...DEFAULT_AI_SETTINGS };
  }
}

/**
 * Add a custom prompt to user settings
 * @param {Object} prompt - Custom prompt object with name, content, and type
 * @param {string} userId - Optional user ID, will use current user if not provided
 */
export function addCustomPrompt(prompt, userId = null) {
  try {
    const settings = getUserAISettings(userId);

    if (!settings.customPrompts) {
      settings.customPrompts = [];
    }

    const newPrompt = {
      id: Date.now().toString(),
      name: prompt.name,
      content: prompt.content,
      type: prompt.type || "general",
      createdAt: new Date().toISOString(),
    };

    settings.customPrompts.push(newPrompt);
    saveUserAISettings(settings, userId);

    return newPrompt;
  } catch (error) {
    console.error("Error adding custom prompt:", error);
    return null;
  }
}

/**
 * Update a custom prompt
 * @param {string} promptId - Prompt ID to update
 * @param {Object} updates - Updates to apply
 * @param {string} userId - Optional user ID, will use current user if not provided
 */
export function updateCustomPrompt(promptId, updates, userId = null) {
  try {
    const settings = getUserAISettings(userId);

    if (!settings.customPrompts) {
      return false;
    }

    const promptIndex = settings.customPrompts.findIndex(
      (p) => p.id === promptId
    );
    if (promptIndex === -1) {
      return false;
    }

    settings.customPrompts[promptIndex] = {
      ...settings.customPrompts[promptIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    saveUserAISettings(settings, userId);
    return true;
  } catch (error) {
    console.error("Error updating custom prompt:", error);
    return false;
  }
}

/**
 * Delete a custom prompt
 * @param {string} promptId - Prompt ID to delete
 * @param {string} userId - Optional user ID, will use current user if not provided
 */
export function deleteCustomPrompt(promptId, userId = null) {
  try {
    const settings = getUserAISettings(userId);

    if (!settings.customPrompts) {
      return false;
    }

    settings.customPrompts = settings.customPrompts.filter(
      (p) => p.id !== promptId
    );
    saveUserAISettings(settings, userId);

    return true;
  } catch (error) {
    console.error("Error deleting custom prompt:", error);
    return false;
  }
}

/**
 * Get the most recent custom prompt for a specific type
 * @param {string} type - Prompt type
 * @param {string} userId - Optional user ID, will use current user if not provided
 * @returns {Object|null} Most recent custom prompt or null
 */
export function getMostRecentCustomPrompt(type, userId = null) {
  try {
    const settings = getUserAISettings(userId);

    if (!settings.customPrompts || settings.customPrompts.length === 0) {
      return null;
    }

    const promptsOfType = settings.customPrompts.filter((p) => p.type === type);
    if (promptsOfType.length === 0) {
      return null;
    }

    // Sort by creation date (newest first)
    promptsOfType.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return promptsOfType[0];
  } catch (error) {
    console.error("Error getting most recent custom prompt:", error);
    return null;
  }
}

/**
 * Build system instruction with user's most recent prompt
 * @param {string} baseSystemInstruction - Base system instruction
 * @param {string} promptType - Type of prompt to look for
 * @param {string} userId - Optional user ID, will use current user if not provided
 * @returns {string} Enhanced system instruction
 */
export function buildSystemInstructionWithUserPrompt(
  baseSystemInstruction,
  promptType,
  userId = null
) {
  try {
    const recentPrompt = getMostRecentCustomPrompt(promptType, userId);

    if (recentPrompt && recentPrompt.content) {
      return `${recentPrompt.content}\n\n${baseSystemInstruction}`;
    }

    return baseSystemInstruction;
  } catch (error) {
    console.error("Error building system instruction:", error);
    return baseSystemInstruction;
  }
}

/**
 * Clear all AI settings for a user
 * @param {string} userId - Optional user ID, will use current user if not provided
 */
export function clearUserAISettings(userId = null) {
  try {
    const currentUserId = userId || getCurrentUserId();

    if (!currentUserId) {
      console.warn("No user ID available for clearing AI settings");
      return false;
    }

    const storageKey = getAISettingsStorageKey(currentUserId);
    localStorage.removeItem(storageKey);

    console.log("AI settings cleared for user:", currentUserId);
    return true;
  } catch (error) {
    console.error("Error clearing user AI settings:", error);
    return false;
  }
}

/**
 * Get all users with AI settings (for admin purposes)
 * @returns {Array} Array of user IDs that have AI settings
 */
export function getAllUsersWithAISettings() {
  try {
    const users = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        key.startsWith(AI_SETTINGS_PREFIX) &&
        key !== GLOBAL_AI_SETTINGS_KEY
      ) {
        const userId = key.replace(AI_SETTINGS_PREFIX, "");
        users.push(userId);
      }
    }
    return users;
  } catch (error) {
    console.error("Error getting users with AI settings:", error);
    return [];
  }
}
