import { MongoClient } from "mongodb";
import { ROLES, USER_STATUS, PERMISSIONS } from "../global.js";

/**
 * Migration script to update existing users with new schema fields
 * Run this script once to update existing users in the database
 */

async function updateUserSchema() {
  let client = null;

  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);
    const db = client.db(process.env.DB_NAME);
    const usersCollection = db.collection("Users");

    console.log("Starting user schema migration...");

    // Get all users that don't have the new fields
    const usersToUpdate = await usersCollection
      .find({
        $or: [
          { status: { $exists: false } },
          { permissions: { $exists: false } },
          { createdAt: { $exists: false } },
          { updatedAt: { $exists: false } },
        ],
      })
      .toArray();

    console.log(`Found ${usersToUpdate.length} users to update`);

    for (const user of usersToUpdate) {
      const updateData = {
        $set: {
          status: USER_STATUS.ACTIVE,
          permissions: getDefaultPermissions(user.role),
          updatedAt: new Date(),
          lastLogin: null,
          deletedAt: null,
        },
      };

      // Only set createdAt if it doesn't exist
      if (!user.createdAt) {
        updateData.$set.createdAt = new Date();
      }

      await usersCollection.updateOne({ _id: user._id }, updateData);

      console.log(`Updated user: ${user.email}`);
    }

    // Create indexes for better query performance
    await usersCollection.createIndex({ role: 1 });
    await usersCollection.createIndex({ status: 1 });
    await usersCollection.createIndex({ email: 1 });
    await usersCollection.createIndex({ createdAt: 1 });
    await usersCollection.createIndex({ lastLogin: 1 });

    console.log("User schema migration completed successfully!");
    console.log(
      "Created indexes on: role, status, email, createdAt, lastLogin"
    );
  } catch (error) {
    console.error("Error during migration:", error);
    throw error;
  } finally {
    if (client) {
      client.close();
    }
  }
}

function getDefaultPermissions(role) {
  switch (role) {
    case ROLES.ADMIN:
      return Object.values(PERMISSIONS);
    case ROLES.EDITOR:
      return [PERMISSIONS.EDIT_USER, PERMISSIONS.VIEW_LOGS];
    case ROLES.USER:
    default:
      return [];
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateUserSchema()
    .then(() => {
      console.log("Migration completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}

export default updateUserSchema;
