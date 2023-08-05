import express from "express";
import { user } from "../lib/auth";
import user_controller from "../controllers/user";

const router = express.Router();

router.post("/register", user_controller.register);

router.post("/login", user_controller.login);

router.delete("/logout", user, user_controller.logout);

module.exports = router;
