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
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const creatSession = (user_id, user_type, expires_at) => {
    return prisma.session.create({
        data: {
            expires_at,
            user_type,
            user_id,
        },
    });
};
const login = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = request.body;
        // check db
        let user = yield prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            throw new Error("user with Given Email Doesn't exists");
        }
        const encrypted_password = user.password;
        const password_match = yield bcrypt_1.default.compare(password, encrypted_password);
        if (!password_match) {
            throw new Error("Incorrect Password");
        }
        // create session
        let expire_time = parseInt(process.env.SESSION_EXPIRE_TIME || "1");
        const expiry = new Date(Date.now() + 24 * expire_time * 60 * 60 * 1000);
        const session = yield creatSession(user.id, "USER", expiry);
        const token_secret = process.env.SECRET || "secret";
        const token = jsonwebtoken_1.default.sign({ session_id: session.id }, token_secret, {
            expiresIn: `${process.env.SESSION_EXPIRE_TIME}h`,
        });
        response.setHeader("access-token", token);
        response.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                "access-token": token,
            },
        });
    }
    catch (error) {
        console.log(error.type);
        return response.status(400).json({
            errors: [{ type: error.type, message: error.message, error: error }],
        });
    }
});
const register = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, phone, email, password } = request.body;
    if (!password)
        return response.status(400).json({
            errors: [
                {
                    type: "Missing Credentials",
                    message: "Password Missing",
                    error: {},
                },
            ],
        });
    const salt = yield bcrypt_1.default.genSalt(10);
    const encrypted_password = yield bcrypt_1.default.hash(password, salt);
    prisma.user
        .findUnique({
        where: {
            email,
        },
    })
        .then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user) {
            throw new Error("Email already exists.");
        }
        return prisma.user.create({
            data: {
                name,
                phone,
                email,
                password: encrypted_password,
            },
        });
    }))
        .then((result) => {
        response.status(200).json({
            message: "User Registered Successfully.",
        });
    })
        .catch((error) => {
        return response.status(400).json({
            errors: [{ type: error.type, message: error.message, error: error }],
        });
    });
});
const logout = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        prisma.session
            .delete({
            where: {
                id: request.current_session.id,
            },
        })
            .then(() => response.status(200).json({ message: "User LogOut Succesfull" }));
    }
    catch (error) {
        return response.status(400).json({
            errors: [{ type: error.type, message: error.message, error: error }],
        });
    }
});
exports.default = { register, login, logout };
//# sourceMappingURL=user.js.map