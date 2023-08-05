"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../lib/auth");
const user_1 = __importDefault(require("../controllers/user"));
const router = express_1.default.Router();
router.post("/register", user_1.default.register);
router.post("/login", user_1.default.login);
router.delete("/logout", auth_1.user, user_1.default.logout);
module.exports = router;
//# sourceMappingURL=user.js.map