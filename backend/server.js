const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const cookRouter = require("./routes/cookRoutes");
const app = express();

dotenv.config();
require("./db/connection");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.status(200).json({ ok: true, message: "Backend server is running perfectly" });
});
app.use("/v1/api/user", userRouter);
app.use("/v1/api/cooks", cookRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
