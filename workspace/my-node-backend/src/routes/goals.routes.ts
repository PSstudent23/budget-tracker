import { Request, Response, NextFunction, Router } from "express";
import { getGoals, addGoal, deleteGoal } from "../db/database.js";

const router = Router();

const showGoals = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Not logged in",
      });
    }

    const goals = await getGoals(req.session.user.user_id);

    res.json(goals);
  } catch (error) {
    next(error);
  }
};


const createGoals = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Not logged in",
      });
    }

    const {name,target_amount,target_date,status,priority,created_at,completed_at} = req.body;

     if (!name || !target_amount || !target_date || !priority) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const result = await addGoal(
        req.session.user.user_id,
        name,
        target_amount,
        target_date,
        status,
        priority
    );

    return res.status(201).json({
      success: true,
      message: "Budget created"
    });


    } catch (error) {
        next(error);
    }
}


const deleteAGoal = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Not logged in",
      });
    }

    const { goal_id } = req.body;
    const result = await deleteGoal(Number(goal_id));

    return res.status(201).json({
      success: true,
      message: "Goal Deleted"
    });

  } catch (error) {
    next(error);
  }
};

router.get("/show", showGoals)
router.post("/add", createGoals);
router.delete("/delete", deleteAGoal)

export default router