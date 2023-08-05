"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const makeTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, payment_id, status, to_user_id } = req.body;
        const from_user_id = req.current_user.id;
        prisma.transaction
            .create({
            data: {
                amount: amount,
                payment_id: payment_id,
                status: status,
                from_user_id: from_user_id,
                to_user_id: to_user_id,
            },
        })
            .then((result) => {
            if (result) {
                res.status(200).json({
                    message: "Transaction Created Successfully",
                    data: result,
                });
            }
            else {
                throw new Error("Something went wrong while creating transaction.");
            }
        });
    }
    catch (error) {
        return res.status(400).json({
            errors: [
                {
                    type: error.type,
                    message: error.message,
                    error: error,
                },
            ],
        });
    }
});
const fetchAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.current_user.id;
        prisma.transaction
            .findMany({
            where: {
                OR: [{ from_user_id: user_id }, { to_user_id: user_id }],
            },
            include: {
                from_user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                to_user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        })
            .then((result) => {
            if (result) {
                return res.status(200).json(result);
            }
        });
    }
    catch (error) {
        return res.status(400).json({
            errors: [
                {
                    type: error.type,
                    message: error.message,
                    error: error,
                },
            ],
        });
    }
});
const fetch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction_id = req.params.id;
        if (!transaction_id) {
            throw new Error("Please provide transaction id to fetch details.");
        }
        prisma.transaction
            .findUnique({
            where: {
                id: parseInt(transaction_id),
            },
            include: {
                from_user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                to_user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
            // select: {
            //   id: true,
            //   payment_id: true,
            //   amount: true,
            //   status: true,
            //   created_at: true,
            // },
        })
            .then((result) => {
            if (result) {
                return res.status(200).json({
                    result,
                });
            }
            else {
                throw new Error("Error fetching transaction details.");
            }
        })
            .catch((err) => {
            return res.status(400).json({
                errors: [
                    {
                        type: err.type,
                        message: err.message,
                        error: err,
                    },
                ],
            });
        });
    }
    catch (error) {
        return res.status(400).json({
            errors: [
                {
                    type: error.type,
                    message: error.message,
                    error: error,
                },
            ],
        });
    }
});
const getBalance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.current_user.id;
        prisma.user
            .findUnique({
            where: {
                id: user_id,
            },
        })
            .then((result) => {
            if (result) {
                return res.status(200).json({
                    data: {
                        balance: result.balance,
                    },
                });
            }
        })
            .catch((err) => {
            return res.status(400).json({
                errors: [
                    {
                        type: err.type,
                        message: err.message,
                        error: err,
                    },
                ],
            });
        });
    }
    catch (error) {
        return res.status(400).json({
            errors: [
                {
                    type: error.type,
                    message: error.message,
                    error: error,
                },
            ],
        });
    }
});
exports.default = { makeTransaction, fetchAll, fetch, getBalance };
//# sourceMappingURL=transaction.js.map