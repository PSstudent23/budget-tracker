import multer from "multer";
import { Request, Response, NextFunction, Router } from "express";
import { getTransactions, addTransaction, getTransactionSum, addFile, deleteTransaction, updateGoalAmount, getTransaction, deleteFile, addNotification, getBudgets, recentTransactions, spendingByCategory, getFile } from "../db/database.js";

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

    //console.log(transactions)

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

    //console.log(result)

    if (goal_id) {
      await updateGoalAmount(req.session.user.user_id, Number(goal_id), Number(amount));

      await addNotification(
      req.session.user.user_id,
      category_id,
      "goal_progress",
      "Goal updated",
      `You added ${amount}€ to your goal`
      );
    }

    const budgets = await getBudgets(req.session.user.user_id);

    console.log(budgets)

    for (const b of budgets) {
      //console.log("budget category:" + b.category_id, "sent" + category_id)
      if (Number(b.category_id) !== Number(category_id)) continue;
      //if (b.category_id !== category_id) continue;
        const spent = Number(b.total_amount)
        const limit = Number(b.budget_limit)


        //console.log("budget category:" + b.category_id, "sent" + category_id + "INSIDE THE FUCKING")

        //console.log(`spent: ${spent}, limit: ${limit}`)

        if (spent > limit) {
            await addNotification(
            req.session.user.user_id,
            category_id,
            "budget_exceeded",
            "Budget exceeded",
            `Budget exceded by ${spent - limit}€`
          );
        }
    }
    


    return res.status(201).json({
      success: true,
      message: "Transaction added"
    });


    } catch (error) {
        next(error);
    }
};

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

const deleteAttachment = async (
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

    const { attachment_id } = req.body;
    const result = await deleteFile(attachment_id);

    
    return res.status(201).json({
      success: true,
      message: "File deleted"
    });


  } catch (error) {
    next(error)
  }
}

const downloadAttachment = async (
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

    const { attachment_id } = req.body;
    const rows = await getFile(Number(attachment_id));

    const { filename, file_type, file_data } = rows[0];

    res.setHeader("Content-Type", file_type);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(file_data);
  } catch (error) {
    next(error);
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

    const rows = await getTransaction(Number(transaction_id));
    const transaction = rows[0];

    if (transaction.goal_id) {
      await updateGoalAmount(transaction.goal_id, -transaction.amount, req.session.user.user_id);
    }

    const result = await deleteTransaction(Number(transaction_id));

    return res.status(201).json({
      success: true,
      message: "Transaction Deleted"
    });

  } catch (error) {
    next(error);
  }
};

const lastTransactions = async (
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

    const recent = await recentTransactions(req.session.user.user_id);

    res.json(recent)

  } catch (error) {
    next(error);
  }
}


const spentByCategory = async (
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

    const spent = await spendingByCategory(req.session.user.user_id);

    res.json(spent)

  } catch (error) {
    next(error);
  }
}

router.get("/show", showTransactions);
router.post("/add", createTransaction);
router.get("/total", getTotal);
router.delete("/delete", deleteATransaction);
router.post("/upload", upload.single("file"), addAttachment);
router.delete("/deleteFile", deleteAttachment);
router.get("/recent", lastTransactions)
router.get("/spent", spentByCategory)
router.post("/download", downloadAttachment);
export default router