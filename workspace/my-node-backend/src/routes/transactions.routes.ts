import multer from "multer";
import { Request, Response, NextFunction, Router } from "express";
import { getTransactions, addTransaction, getTransactionSum, addFile, deleteTransaction } from "../db/database.js";

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

    console.log(transactions)

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

const getTotal = async (
  req: Request, 
  res: Response
) => {
  if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Not logged in",
      });
    }

  const total = await getTransactionSum(req.session.user.user_id);

  res.json({ total });
};

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
});

const addAttachment = async (
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

    const { transaction_id } = req.body;
    const file = req.file;

    if (!file || !transaction_id) {
      return res.status(400).json({
          success: false,
          message: "Missing required fields",
      });
    }

    const result = await addFile( req.session.user.user_id, transaction_id, file.originalname, file.mimetype, file.buffer );

    return res.status(201).json({
      success: true,
      message: "File added"
    });
  } catch (error) {
    next(error)
  } 
}

const deleteATransaction = async (
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

    const { transaction_id } = req.body;
    const result = await deleteTransaction(Number(transaction_id));

    return res.status(201).json({
      success: true,
      message: "Transaction Deleted"
    });

  } catch (error) {
    next(error);
  }
};


router.get("/show", showTransactions)
router.post("/add", createTransaction);
router.get("/total", getTotal)
router.delete("/delete", deleteATransaction)
router.post("/upload", upload.single("file"), addAttachment);

export default router