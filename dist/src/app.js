"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const body_parser_1 = __importDefault(require("body-parser"));
require("dotenv").config({ path: process.env.DOTENV_PATH });
const port = process.env.PORT || 3000;
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/transaction", require("./routes/transaction"));
app.use("/user", require("./routes/user"));
app.listen(port, () => {
    return console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map