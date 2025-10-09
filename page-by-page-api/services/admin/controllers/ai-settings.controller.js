import AISettingsModel from "../models/ai-settings.model.js";

// Get all AI settings
export async function getAllAISettings(req, res) {
  try {
    const settings = await AISettingsModel.getAllSettings();

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Error fetching AI settings:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching AI settings",
    });
  }
}

// Get global AI settings
export async function getGlobalAISettings(req, res) {
  try {
    const settings = await AISettingsModel.getGlobalSettings();

    res.status(200).json({
      success: true,
      settings: settings || {
        promptOverrides: {
          rewrite:
            "Please rewrite the following text to improve clarity and flow:",
          summarize: "Please provide a concise summary of the following text:",
          brainstorm: "Please help brainstorm ideas for the following topic:",
        },
        tokenLimits: {
          maxInputTokens: 4000,
          maxOutputTokens: 2000,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching global AI settings:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching global AI settings",
    });
  }
}

// Get user-specific AI settings
export async function getUserAISettings(req, res) {
  try {
    const { userId } = req.params;
    const settings = await AISettingsModel.getUserSettings(userId);

    res.status(200).json({
      success: true,
      settings: settings || null,
    });
  } catch (error) {
    console.error("Error fetching user AI settings:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user AI settings",
    });
  }
}

// Get merged settings (user-specific + global defaults)
export async function getMergedAISettings(req, res) {
  try {
    const { userId } = req.query;
    const settings = await AISettingsModel.getMergedSettings(userId);

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Error fetching merged AI settings:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching merged AI settings",
    });
  }
}

// Create or update AI settings
export async function upsertAISettings(req, res) {
  try {
    const { userId, promptOverrides, tokenLimits, isGlobal = false } = req.body;

    // Validate required fields
    if (!promptOverrides && !tokenLimits) {
      return res.status(400).json({
        success: false,
        message:
          "At least one setting (promptOverrides or tokenLimits) is required",
      });
    }

    // Validate token limits
    if (tokenLimits) {
      if (
        tokenLimits.maxInputTokens &&
        (tokenLimits.maxInputTokens < 100 || tokenLimits.maxInputTokens > 10000)
      ) {
        return res.status(400).json({
          success: false,
          message: "maxInputTokens must be between 100 and 10000",
        });
      }

      if (
        tokenLimits.maxOutputTokens &&
        (tokenLimits.maxOutputTokens < 50 || tokenLimits.maxOutputTokens > 5000)
      ) {
        return res.status(400).json({
          success: false,
          message: "maxOutputTokens must be between 50 and 5000",
        });
      }
    }

    const settingsData = {
      userId: userId ? userId : null,
      isGlobal: isGlobal || !userId,
      promptOverrides,
      tokenLimits,
      createdBy: req.user.userId,
      updatedBy: req.user.userId,
    };

    const result = await AISettingsModel.upsertSettings(settingsData);

    // Log settings update
    await logEvent({
      eventType: "settings",
      action: "update_ai_settings",
      userId: req.user.userId,
      details: {
        targetUserId: userId,
        isGlobal: isGlobal || !userId,
        changes: { promptOverrides, tokenLimits },
      },
    });

    res.status(200).json({
      success: true,
      message: "AI settings updated successfully",
      result,
    });
  } catch (error) {
    console.error("Error updating AI settings:", error);
    res.status(500).json({
      success: false,
      message: "Error updating AI settings",
    });
  }
}

// Delete AI settings
export async function deleteAISettings(req, res) {
  try {
    const { settingsId } = req.params;

    const result = await AISettingsModel.deleteSettings(settingsId);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "AI settings not found",
      });
    }

    // Log settings deletion
    await logEvent({
      eventType: "settings",
      action: "delete_ai_settings",
      userId: req.user.userId,
      details: {
        deletedSettingsId: settingsId,
      },
    });

    res.status(200).json({
      success: true,
      message: "AI settings deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting AI settings:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting AI settings",
    });
  }
}

// Initialize default settings
export async function initializeDefaultAISettings(req, res) {
  try {
    await AISettingsModel.initializeDefaultSettings();

    res.status(200).json({
      success: true,
      message: "Default AI settings initialized successfully",
    });
  } catch (error) {
    console.error("Error initializing default AI settings:", error);
    res.status(500).json({
      success: false,
      message: "Error initializing default AI settings",
    });
  }
}

// Simple logging function (will be replaced with proper logging system)
async function logEvent(eventData) {
  try {
    // For now, just log to console
    // In Phase 4, this will be replaced with proper logging system
    console.log("AI Settings Event:", {
      timestamp: new Date().toISOString(),
      ...eventData,
    });
  } catch (error) {
    console.error("Error logging event:", error);
  }
}
