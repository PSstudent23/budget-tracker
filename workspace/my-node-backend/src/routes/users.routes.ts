import { Request, Response, NextFunction, Router } from "express";
import { authUser, createUser } from "../db/database.js";

const router = Router();

//Login
const loginUser = async (
    req: Request, 
    res: Response, 
    next: NextFunction) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const queryResult = await authUser(email);

    if (queryResult.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User is not registered.",
      });
    }

    const user = queryResult[0];

    if (password !== user.password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    req.session.user = {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
    };

    res.status(200).json({
    success: true,
    message: "Login successful.",
    user: {
        user_id: user.user_id,        
        first_name: user.first_name,  
        last_name: user.last_name,
        email: user.email,           
    },
    });
  } catch (error) {
    next(error);
  }
};

//Register
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { first_name, last_name, email, password, monthly_income } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const queryResult = await createUser(
        first_name,
        last_name,
        email,
        password,
        monthly_income ? Number(monthly_income) : null  // ← convert or null
    );

    if (queryResult.affectedRows === 1) {
      return res.status(201).json({
        success: true,
        message: "User registered.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "User was not registered.",
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = (
  req: Request,
  res: Response
) => {
  if (!req.session.user) {
    res.status(200).json({
      loggedIn: false,
      user: null,
    });

    return;
  }

  res.status(200).json({
    loggedIn: true,
    user: req.session.user,
  });
};

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/me", getCurrentUser);

export default router;