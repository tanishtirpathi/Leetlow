import express from "express";
import {
  createProblem,
  deleteProblemById,
  getALlProblm,
  updateProblemById,
  getProblemById,
  getSolvedProblemByUser,
} from "../controllers/problem.controllers.js";
import { authmiddlware, checkAdmin } from "../middleware/auth.middlewares.js";
const router = express.Router();
router.get("get-all-problem ", authmiddlware, getALlProblm);

router.get("get-problem/:id", authmiddlware, getProblemById);

router.put("update-problem/:id ", authmiddlware, checkAdmin, updateProblemById);

router.delete(
  "deleteProblem/:id",
  authmiddlware,
  checkAdmin,
  deleteProblemById
);

router.get("get-solved-problem", authmiddlware, getSolvedProblemByUser);

router.post("createProblem", authmiddlware, checkAdmin, createProblem);

export default router;
