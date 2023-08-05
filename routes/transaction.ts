import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";
import transaction_controller from "../controllers/transaction";
import { user } from "../lib/auth";

const prisma: PrismaClient = new PrismaClient();

const authenticate = user;

router.post("/create", authenticate, transaction_controller.makeTransaction);

router.get("/history", authenticate, transaction_controller.fetchAll);

router.get("/details/:id", authenticate, transaction_controller.fetch);

router.get("/get_balance", authenticate, transaction_controller.getBalance);

module.exports = router;
