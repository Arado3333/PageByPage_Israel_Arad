import { getGoalsFromDB, createGoalInDB, getGoalByIdFromDB, updateGoalInDB } from "./goals.db.js";

export default class Goal {
    constructor(
        id,
        userId,
        title = "New Goal",
        category = "Writing",
        isCompleted = false
    ) {
        if (!userId) {
            return {
                error: "Cannot create goal. No user id",
            };
        }
        this.id = id || `goal_${Date.now()}`;
        this.userId = userId;
        this.title = title;
        this.category = category;
        this.isCompleted = isCompleted;
    }

    static async getAllGoals(userId) {
        try {
            return await getGoalsFromDB(userId);
        } catch (error) {
            throw new Error("Error while fetching goals\n", error);
        }
    }

    static async getGoalById(goalId)
    {
        try {
            return await getGoalByIdFromDB(goalId)
        } catch (error) {
            throw new Error("Error while fetching goal by id\n", error);
        }
    }

    async createGoal() {
        try {
            return await createGoalInDB(this);
        } catch (error) {
            throw new Error("Error while creating goal\n", error);
        }
    }

    setIsCompleted(completed) {
        this.isCompleted = completed;
    }

    async updateGoal() {
        try {
            return await updateGoalInDB(this);
        } catch (error) {
            throw new Error("Error while updating goal\n", error);
        }
    }
}
