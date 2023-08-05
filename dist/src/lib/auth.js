"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const jwt = require("jsonwebtoken");
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const auth = (req) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(req.headers["access-token"], process.env.SECRET, (error, payload) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(payload && payload.session_id);
                }
            });
        }
        catch (error) {
            reject(new Error("Invalid Payload"));
        }
    })
        .then((session_id) => {
        if (!session_id) {
            throw new Error("Invalid Session");
        }
        return prisma.session.findUnique({
            where: { id: parseInt(session_id) },
        });
    })
        .then((session) => {
        if (!session) {
            throw new Error("Invalid Session");
        }
        else {
            return session;
        }
    });
};
const user = (req, res, next) => {
    auth(req)
        .then((session) => {
        if (session.user_type !== "USER") {
            throw new Error("Invalid Session");
        }
        req.current_session = session;
        return session.user_id;
    })
        .then((user_id) => {
        return prisma.user.findUnique({
            where: { id: user_id },
        });
    })
        .then((user) => {
        if (!user) {
            throw new Error("Invalid Session");
        }
        req.current_user = user;
        next();
    })
        .catch((error) => res.status(400).json({
        errors: [
            {
                type: error.type,
                message: error.message || "Invalid Session",
                error: error,
            },
        ],
    }));
};
exports.user = user;
//# sourceMappingURL=auth.js.map