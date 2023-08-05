import express from "express";
const app = express();
import bodyParser from "body-parser";
require("dotenv").config({ path: process.env.DOTENV_PATH });
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/transaction", require("./routes/transaction"));
app.use("/user", require("./routes/user"));

app.listen(port, () => {
  return console.log(`Server running at http://localhost:${port}`);
});
