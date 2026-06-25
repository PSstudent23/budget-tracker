import { Request, Response, NextFunction, Router } from "express";
import { getTransactions } from "../db/database.js";

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
        message: "Not logged in.",
      });
    }

    const transactions = await getTransactions(req.session.user.user_id);

    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

router.get("/show", showTransactions)

export default router