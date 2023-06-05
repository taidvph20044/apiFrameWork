import express from "express";
import { signin, signup, get } from "../controllers/auth";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/user", get);
export default router;
