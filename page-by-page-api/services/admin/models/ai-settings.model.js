import { MongoClient, ObjectId } from "mongodb";

export default class AISettingsModel {
  // Get all AI settings
  static async getAllSettings() {
    let client = null;

    try {
      client = await MongoClient.connect(process.env.CONNECTION_STRING);
      const db = client.db(process.env.DB_NAME);

      return await db.collection("AISettings").find({}).toArray();
    } catch (error) {
      console.error("Error fetching AI settings:", error);
      throw error;
    } finally {
      if (client) {
        client.close();
      }
    }
  }

  // Get global AI settings
  static async getGlobalSettings() {
    let client = null;

    try {
      client = await MongoClient.connect(process.env.CONNECTION_STRING);
      const db = client.db(process.env.DB_NAME);

      return await db.collection("AISettings").findOne({
        userId: null,
        isGlobal: true,
      });
    } catch (error) {
      console.error("Error fetching global AI settings:", error);
      throw error;
    } finally {
      if (client) {
        client.close();
      }
    }
  }

  // Get user-specific AI settings
  static async getUserSettings(userId) {
    let client = null;

    try {
      client = await MongoClient.connect(process.env.CONNECTION_STRING);
      const db = client.db(process.env.DB_NAME);

      return await db.collection("AISettings").findOne({
        userId: new ObjectId(userId),
      });
    } catch (error) {
      console.error("Error fetching user AI settings:", error);
      throw error;
    } finally {
      if (client) {
        client.close();
      }
    }
  }

  // Create or update AI settings
  static async upsertSettings(settingsData) {
    let client = null;

    try {
      client = await MongoClient.connect(process.env.CONNECTION_STRING);
      const db = client.db(process.env.DB_NAME);

      const filter = settingsData.userId
        ? { userId: new ObjectId(settingsData.userId) }
        : { isGlobal: true };

      const updateData = {
        ...settingsData,
        updatedAt: new Date(),
        $setOnInsert: {
          createdAt: new Date(),
        },
      };

      const result = await db
        .collection("AISettings")
        .updateOne(filter, { $set: updateData }, { upsert: true });

      return result;
    } catch (error) {
      console.error("Error upserting AI settings:", error);
      throw error;
    } finally {
      if (client) {
        client.close();
      }
    }
  }

  // Delete AI settings
  static async deleteSettings(settingsId) {
    let client = null;

    try {
      client = await MongoClient.connect(process.env.CONNECTION_STRING);
      const db = client.db(process.env.DB_NAME);

      const result = await db.collection("AISettings").deleteOne({
        _id: new ObjectId(settingsId),
      });

      return result;
    } catch (error) {
      console.error("Error deleting AI settings:", error);
      throw error;
    } finally {
      if (client) {
        client.close();
      }
    }
  }

  // Get merged settings (user-specific + global defaults)
  static async getMergedSettings(userId) {
    try {
      const [globalSettings, userSettings] = await Promise.all([
        this.getGlobalSettings(),
        userId ? this.getUserSettings(userId) : null,
      ]);

      // Start with default settings
      const defaultSettings = {
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
      };

      // Merge with global settings
      const merged = {
        ...defaultSettings,
        ...globalSettings,
        promptOverrides: {
          ...defaultSettings.promptOverrides,
          ...(globalSettings?.promptOverrides || {}),
        },
        tokenLimits: {
          ...defaultSettings.tokenLimits,
          ...(globalSettings?.tokenLimits || {}),
        },
      };

      // Override with user-specific settings if they exist
      if (userSettings) {
        merged.promptOverrides = {
          ...merged.promptOverrides,
          ...(userSettings.promptOverrides || {}),
        };
        merged.tokenLimits = {
          ...merged.tokenLimits,
          ...(userSettings.tokenLimits || {}),
        };
      }

      return merged;
    } catch (error) {
      console.error("Error getting merged AI settings:", error);
      throw error;
    }
  }

  // Initialize default global settings
  static async initializeDefaultSettings() {
    try {
      const existingGlobal = await this.getGlobalSettings();

      if (!existingGlobal) {
        const defaultSettings = {
          isGlobal: true,
          userId: null,
          promptOverrides: {
            rewrite:
              "Please rewrite the following text to improve clarity and flow:",
            summarize:
              "Please provide a concise summary of the following text:",
            brainstorm: "Please help brainstorm ideas for the following topic:",
          },
          tokenLimits: {
            maxInputTokens: 4000,
            maxOutputTokens: 2000,
          },
          createdBy: "system",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await this.upsertSettings(defaultSettings);
        console.log("Default global AI settings initialized");
      }
    } catch (error) {
      console.error("Error initializing default AI settings:", error);
      throw error;
    }
  }
}
