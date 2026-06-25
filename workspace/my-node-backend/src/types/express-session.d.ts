import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      user_id: number;
      first_name: string;
      last_name: string;
      email: string;
      monthly_income: number;
    };
  }
}