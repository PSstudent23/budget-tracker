import { Request, Response, NextFunction, Router } from "express";
import { getBudgets, addBudget} from "../db/database.js";

const router = Router();

const showBudgets = async (
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

    const budgets = await getBudgets(req.session.user.user_id);

    res.json(budgets);
  } catch (error) {
    next(error);
  }
};


const createBudget = async (
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

    const {category_id,start_date,end_date,budget_limit,is_active} = req.body;

    console.log({
      category_id,
      start_date,
      end_date,
      budget_limit,
      is_active,
    });

     if (!category_id || !start_date || !end_date || !budget_limit) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const result = await addBudget(
      req.session.user.user_id,
      category_id,
      start_date,
      end_date,
      budget_limit,
      is_active
    );

    return res.status(201).json({
      success: true,
      message: "Budget created"
    });


    } catch (error) {
        next(error);
    }
}

router.get("/show", showBudgets)
router.post("/add", createBudget);

export default router