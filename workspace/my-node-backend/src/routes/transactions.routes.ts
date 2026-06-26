import { Request, Response, NextFunction, Router } from "express";
import { getTransactions, addTransaction } from "../db/database.js";

const router = Router();

const showTransactions = async (
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

    const transactions = await getTransactions(req.session.user.user_id);

    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

const createTransaction = async (
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

    const {category_id,amount,date,description,goal_id} = req.body;

     if (!category_id || !amount || !date) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

     const result = await addTransaction(
      req.session.user.user_id,
      category_id,
      amount,
      date,
      description,
      goal_id ?? null
    );

    return res.status(201).json({
      success: true,
      message: "Transaction added"
    });


    } catch (error) {
        next(error);
    }
}

router.get("/show", showTransactions)
router.post("/add", createTransaction);

export default router