const { Cook, cookSchema } = require("../models/cookModel");
const getAllCooks = async (req, res) => {
    try {
        const cooks = await Cook.find();
        return res.send({ ok: true, data: cooks });
    } catch (error) {
        res.status(500).send({ ok: false, message: "Unable to get cooks" });
    }
};
const getCook = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ ok: false, message: "Cook ID is required" });
        }

        const cook = await Cook.findById(id);
        if (!cook) {
            return res.status(404).json({ ok: false, message: "Cook not found" });
        }

        res.status(200).json({ ok: true, data: cook });
    } catch (error) {
        console.error("Error fetching cook:", error);
        res.status(500).json({ ok: false, message: "Internal server error" });
    }
};
const addCook = async (req, res) => {
    try {
        const validatedData = cookSchema.parse(req.body);

        const cook = new Cook(validatedData);
        await cook.save();

        return res.status(201).send({ ok: true, message: "Cook added successfully" });
    } catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).send({
                ok: false,
                message: "Validation failed",
                errors: error.errors,
            });
        }
        console.error("Error adding cook:", error);
        res.status(500).send({ ok: false, message: "Unable to add cook" });
    }
};

const updateCook = async (req, res) => {
    try {
        const validatedData = cookSchema.partial().parse(req.body);

        const cook = await Cook.findById(req.params.id);
        if (!cook) {
            return res.status(404).send({ ok: false, message: "Cook not found" });
        }

        Object.assign(cook, validatedData);

        await cook.validate();

        await cook.save();

        return res.send({ ok: true, message: "Cook updated successfully" });
    } catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).send({
                ok: false,
                message: "Validation failed",
                errors: error.errors,
            });
        }
        if (error.name === "ValidationError") {
            return res.status(400).send({
                ok: false,
                message: "Mongoose validation failed",
                errors: error.errors,
            });
        }
        console.error("Error updating cook:", error);
        res.status(500).send({ ok: false, message: "Unable to update cook", error: error.message });
    }
};
const deleteCook = async (req, res) => {
    try {
        const cook = await Cook.findByIdAndDelete(req.params.id);
        if (!cook) {
            return res.status(404).send({ ok: false, message: "Cook not found" });
        }
        return res.status(200).send({ ok: true, message: "Cook deleted successfully" });
    } catch (error) {
        console.error("Error deleting cook:", error);
        return res.status(500).send({ ok: false, message: "Unable to delete cook", error: error.message });
    }
};
module.exports = { getAllCooks, getCook, addCook, updateCook, deleteCook };
