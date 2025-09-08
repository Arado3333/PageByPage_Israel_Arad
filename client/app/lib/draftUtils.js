/**
 * Utility functions for draft operations
 */

/**
 * Find the most recently updated draft from a list of drafts
 * @param {Array} drafts - Array of draft objects
 * @returns {Object|null} - The most recent draft or null if no drafts
 */
export function findMostRecentDraft(drafts) {
  if (!drafts || drafts.length === 0) {
    return null;
  }

  return drafts.reduce((mostRecent, current) => {
    const currentTime = new Date(
      current.lastModified || current.lastEdited || 0
    );
    const mostRecentTime = new Date(
      mostRecent.lastModified || mostRecent.lastEdited || 0
    );

    return currentTime > mostRecentTime ? current : mostRecent;
  });
}

/**
 * Calculate time difference between a date and now
 * @param {string|Date} dateString - The date to compare
 * @returns {Object} - Object with time difference info
 */
export function calculateTimeDifference(dateString) {
  if (!dateString) {
    return { text: "unknown time", hours: 0, minutes: 0 };
  }

  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;

  if (diffMs < 0) {
    return { text: "just now", hours: 0, minutes: 0 };
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return {
      text: `${diffDays} day${diffDays > 1 ? "s" : ""} ago`,
      hours: diffHours,
      minutes: diffMinutes,
    };
  } else if (diffHours > 0) {
    return {
      text: `${diffHours}h ago`,
      hours: diffHours,
      minutes: diffMinutes,
    };
  } else if (diffMinutes > 0) {
    return {
      text: `${diffMinutes}m ago`,
      hours: diffHours,
      minutes: diffMinutes,
    };
  } else {
    return { text: "just now", hours: 0, minutes: 0 };
  }
}

/**
 * Get the most recent draft with time information
 * @param {Array} drafts - Array of draft objects
 * @returns {Object|null} - Object with draft and time info, or null
 */
export function getMostRecentDraftInfo(drafts) {
  const mostRecent = findMostRecentDraft(drafts);

  if (!mostRecent) {
    return null;
  }

  const timeInfo = calculateTimeDifference(
    mostRecent.lastModified || mostRecent.lastEdited
  );

  return {
    draft: mostRecent,
    timeInfo,
    displayText: timeInfo.text,
  };
}
