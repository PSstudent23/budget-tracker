import { Request, Response, NextFunction, Router } from "express";
import { getNotifications } from "../db/database.js";

const router = Router();

const showNotifications = async (
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

    const notifications = await getNotifications(req.session.user.user_id);

    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

/*
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

const deleteABudget = async (
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

    const { budget_id } = req.body;
    const result = await deleteBudget(Number(budget_id));

    return res.status(201).json({
      success: true,
      message: "Budget Deleted"
    });

  } catch (error) {
    next(error);
  }
};

*/
router.get("/show", showNotifications)
//router.post("/add", createBudget);
//router.delete("/delete", deleteABudget)

export default router