import express from "express";

const authRouter = express.Router();
import authController from "../controllers/auth.controller.js";
import authMiddlewares from "../middlewares/auth.middleware.js";

// post /api/auth/register
authRouter.post("/register", authController.registerUserController);

// post /api/auth/login
authRouter.post("/login", authController.logininUserController);

// get/logout
authRouter.get("/logout", authController.logoutUserController);

// get/api/auth/get-me
// get the current login details
authRouter.get(
  "/get-me",
  authMiddlewares.authUser,
  authController.getMeController,
);

export default authRouter;
