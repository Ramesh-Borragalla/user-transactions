"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const client_1 = require("@prisma/client");
const transaction_1 = __importDefault(require("../controllers/transaction"));
const auth_1 = require("../lib/auth");
const prisma = new client_1.PrismaClient();
const authenticate = auth_1.user;
router.post("/create", authenticate, transaction_1.default.makeTransaction);
router.get("/history", authenticate, transaction_1.default.fetchAll);
router.get("/details/:id", authenticate, transaction_1.default.fetch);
router.get("/get_balance", authenticate, transaction_1.default.getBalance);
module.exports = router;
//# sourceMappingURL=transaction.js.map