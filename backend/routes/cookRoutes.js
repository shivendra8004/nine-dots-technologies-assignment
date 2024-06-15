const express = require("express");
const auth = require("../middlewares/authenticateUser");
const cookController = require("../controllers/cookController");
const cookRouter = express.Router();

cookRouter.get("/getAllCooks", auth, cookController.getAllCooks);
cookRouter.get("/getCook/:id", auth, cookController.getCook);

cookRouter.post("/addCook", auth, cookController.addCook);

cookRouter.put("/updateCook/:id", auth, cookController.updateCook);

cookRouter.delete("/deleteCook/:id", auth, cookController.deleteCook);
module.exports = cookRouter;
