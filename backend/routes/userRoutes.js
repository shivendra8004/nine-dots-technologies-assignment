const express = require("express");
const auth = require("../middlewares/authenticateUser");
const userController = require("../controllers/userControllers");
const userRouter = express.Router();

userRouter.get("/getuser/:id", auth, userController.getuser);
userRouter.get("/verify-token",auth,userController.verifyToken);

userRouter.post("/login", userController.login);

userRouter.post("/register", userController.register);

module.exports = userRouter;
