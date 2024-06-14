const { Cook, cookSchema } = require("../models/cookModel");
const getAllCooks = async (req, res) => {
    try {
        const cooks = await Cook.find();
        return res.send({ ok: true, data: cooks });
    } catch (error) {
        res.status(500).send({ ok: false, message: "Unable to get cooks" });
    }
};
const addCook = async (req, res) => {
    try {
        // Validate the request body using Zod
        const validatedData = cookSchema.parse(req.body);

        // Create a new Cook instance with the validated data
        const cook = new Cook(validatedData);
        await cook.save();

        return res.status(201).send({ ok: true, message: "Cook added successfully" });
    } catch (error) {
        if (error.name === "ZodError") {
            // Handle Zod validation errors
            return res.status(400).send({
                ok: false,
                message: "Validation failed",
                errors: error.errors,
            });
        }
        // Handle other errors (including Mongoose validation errors)
        console.error("Error adding cook:", error);
        res.status(500).send({ ok: false, message: "Unable to add cook" });
    }
};

const updateCook = async (req, res) => {
    try {
        // Validate the request body using Zod
        const validatedData = cookSchema.partial().parse(req.body);

        const cook = await Cook.findById(req.params.id);
        if (!cook) {
            return res.status(404).send({ ok: false, message: "Cook not found" });
        }

        // Update the cook with validated data
        Object.assign(cook, validatedData);

        // Manually validate the updated document
        await cook.validate();

        // Save the changes
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
module.exports = { getAllCooks, addCook, updateCook, deleteCook };
