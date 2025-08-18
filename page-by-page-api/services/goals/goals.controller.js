import Goal from "./goal.model.js";

export async function getUserGoals(req, res) {
    const { userId } = req.params;

    try {
        const result = await Goal.getAllGoals(userId);
        res.status(200).json({
            success: true,
            goals: result,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "Error while fetching goals",
        });
    }
}

export async function createGoal(req, res) {
    const { userId } = req.params;

    const { title, category, isCompleted } = req.body;

    try {
        const newGoal = new Goal(userId, title, category, isCompleted);
        const result = await newGoal.createGoal();
        res.status(200).json({
            success: true,
            message: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while creating goal",
        });
    }
}

export async function updateGoal(req, res) {
    const { goalId } = req.params;
    const { isCompleted } = req.body; //boolean --> true/false

    const selectedGoal = await getGoalById(goalId);
    console.log(selectedGoal);

    const { id, title, category, userId } = selectedGoal;
    const updated = new Goal(id, userId, title, category, isCompleted);
    const result = await updated.updateGoal();

    console.log(result);

    res.status(200).json({
        success: true,
        message: result,
    });
}

async function getGoalById(goalId) {
    return await Goal.getGoalById(goalId);
}
