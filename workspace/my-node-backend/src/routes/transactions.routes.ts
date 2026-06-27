import { Request, Response, NextFunction, Router } from "express";
import { getTransactions, addTransaction, getTransactionSum } from "../db/database.js";

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

    console.log({
      category_id,
      amount,
      date,
      description,
      goal_id,
    });

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
      goal_id ?? undefined
    );

    return res.status(201).json({
      success: true,
      message: "Transaction added"
    });


    } catch (error) {
        next(error);
    }
}

const getTotal = async (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const total = await getTransactionSum(req.session.user.user_id);

  res.json({ total });
};


router.get("/show", showTransactions)
router.post("/add", createTransaction);
router.get("/total", getTotal)

export default router