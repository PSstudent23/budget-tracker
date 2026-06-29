import { Request, Response, NextFunction, Router } from "express";
import { addNotification, getNotifications, readAll } from "../db/database.js";

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

    console.log(notifications)

    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

const readAllNotifications = async (
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

    const read = await readAll(req.session.user.user_id);

    res.json(read);
  } catch (error) {
    next(error);
  }
};



const createNotification = async (
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

    const { category_id, type, title, message } = req.body;

    const result = await addNotification( req.session.user.user_id, category_id, type, title, message );

    return res.status(201).json({
      success: true,
      message: "Notification created",
    });

  } catch (error) {
    next(error);
  }
};

/*
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
router.post("/readAll", readAllNotifications)
router.post("/create", createNotification);
//router.delete("/delete", deleteABudget)

export default router