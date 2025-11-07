import express from "express";
import {
  checkUser,
  login,
  logout,
  regester,
} from "../controllers/auth.controllers.js";
import { authmiddlware } from "../middleware/auth.middlewares.js";
const router = express.Router();

router.get("/check", authmiddlware, checkUser);
router.post("/signup", regester);
router.post("/login", login);
router.get("/logout", authmiddlware, logout);

export default router;
