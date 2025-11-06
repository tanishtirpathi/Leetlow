import express from "express";
import {
  checkUser,
  login,
  logout,
  regester,
} from "../controllers/auth.controllers.js";
const router = express.Router();

router.get("check", checkUser);
router.post("signup", regester);
router.post("login ", login);
router.get("logout", logout);

export default router;
