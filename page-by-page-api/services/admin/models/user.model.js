import { MongoClient, ObjectId } from "mongodb";
import { USER_STATUS } from "../../../global.js";

export default class AdminUserModel {
  // Get users with pagination and filtering
  static async getAllUsersPaginated(filter = {}, skip = 0, limit = 20) {
    let client = null;

    try {
      client = await MongoClient.connect(process.env.CONNECTION_STRING);
      const db = client.db(process.env.DB_NAME);

      return await db
        .collection("Users")
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
    } catch (error) {
      console.error("Error fetching paginated users:", error);
      throw error;
    } finally {
      if (client) {
        client.close();
      }
    }
  }

  // Get total count of users matching filter
  static async getUsersCount(filter = {}) {
    let client = null;

    try {
      client = await MongoClient.connect(process.env.CONNECTION_STRING);
      const db = client.db(process.env.DB_NAME);

      return await db.collection("Users").countDocuments(filter);
    } catch (error) {
      console.error("Error counting users:", error);
      throw error;
    } finally {
      if (client) {
        client.close();
      }
    }
  }

  // Get user by ID
  static async getUserById(userId) {
    let client = null;

    try {
      client = await MongoClient.connect(process.env.CONNECTION_STRING);
      const db = client.db(process.env.DB_NAME);

      return await db
        .collection("Users")
        .findOne({ _id: new ObjectId(userId) });
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    } finally {
      if (client) {
        client.close();
      }
    }
  }

  // Update user
  static async updateUser(userId, updateData) {
    let client = null;

    try {
      client = await MongoClient.connect(process.env.CONNECTION_STRING);
      const db = client.db(process.env.DB_NAME);

      const result = await db
        .collection("Users")
        .updateOne({ _id: new ObjectId(userId) }, { $set: updateData });

      if (result.matchedCount === 0) {
        throw new Error("User not found");
      }

      return await this.getUserById(userId);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    } finally {
      if (client) {
        client.close();
      }
    }
  }

  // Get user statistics
  static async getUserStats() {
    let client = null;

    try {
      client = await MongoClient.connect(process.env.CONNECTION_STRING);
      const db = client.db(process.env.DB_NAME);

      const pipeline = [
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            activeUsers: {
              $sum: { $cond: [{ $eq: ["$status", USER_STATUS.ACTIVE] }, 1, 0] },
            },
            suspendedUsers: {
              $sum: {
                $cond: [{ $eq: ["$status", USER_STATUS.SUSPENDED] }, 1, 0],
              },
            },
            deletedUsers: {
              $sum: {
                $cond: [{ $eq: ["$status", USER_STATUS.DELETED] }, 1, 0],
              },
            },
            adminUsers: {
              $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] },
            },
            editorUsers: {
              $sum: { $cond: [{ $eq: ["$role", "editor"] }, 1, 0] },
            },
            regularUsers: {
              $sum: { $cond: [{ $eq: ["$role", "user"] }, 1, 0] },
            },
          },
        },
      ];

      const result = await db.collection("Users").aggregate(pipeline).toArray();
      return (
        result[0] || {
          totalUsers: 0,
          activeUsers: 0,
          suspendedUsers: 0,
          deletedUsers: 0,
          adminUsers: 0,
          editorUsers: 0,
          regularUsers: 0,
        }
      );
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw error;
    } finally {
      if (client) {
        client.close();
      }
    }
  }

  // Get recent user activity
  static async getRecentUserActivity(limit = 10) {
    let client = null;

    try {
      client = await MongoClient.connect(process.env.CONNECTION_STRING);
      const db = client.db(process.env.DB_NAME);

      return await db
        .collection("Users")
        .find({ status: { $ne: USER_STATUS.DELETED } })
        .sort({ lastLogin: -1 })
        .limit(limit)
        .project({
          name: 1,
          email: 1,
          role: 1,
          status: 1,
          lastLogin: 1,
          createdAt: 1,
        })
        .toArray();
    } catch (error) {
      console.error("Error fetching recent user activity:", error);
      throw error;
    } finally {
      if (client) {
        client.close();
      }
    }
  }
}
