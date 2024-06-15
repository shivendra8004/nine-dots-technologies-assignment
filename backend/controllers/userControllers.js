const { User, userSchema } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const getuser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).send({ ok: false, message: "User not found" });
        }
        return res.send({ ok: true, data: user });
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).send({ ok: false, message: "Unable to get user" });
    }
};

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
});

const login = async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ ok: false, message: "Email not found" });
        }

        const verifyPass = await bcrypt.compare(password, user.password);
        if (!verifyPass) {
            return res.status(400).send({ ok: false, message: "Invalid password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "2 hours",
        });

        return res.status(200).send({ ok: true, message: "User logged in successfully", token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).send({ ok: false, message: "Invalid input", errors: error.errors });
        }
        console.error("Error logging in user:", error);
        res.status(500).send({ ok: false, message: "Unable to login user due to technical error" });
    }
};

const register = async (req, res) => {
    try {
        const validatedData = userSchema.parse(req.body);

        const emailPresent = await User.findOne({ email: validatedData.email });
        if (emailPresent) {
            return res.status(400).send({ ok: false, message: "Email already exists" });
        }

        const hashedPass = await bcrypt.hash(validatedData.password, 10);
        const user = new User({ ...validatedData, password: hashedPass });
        await user.save();

        return res.status(201).send({ ok: true, message: "User registered successfully" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).send({ ok: false, message: "Invalid input", errors: error.errors });
        }
        console.error("Error registering user:", error);
        res.status(500).send({ ok: false, message: "Unable to register user" });
    }
};
const verifyToken = async (req, res) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId });

        if (!user) {
            throw new Error("User not found");
        }

        res.status(200).send({ ok: true, message: "Token verified", userId: user._id });
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).send({ ok: false, message: "Please authenticate" });
    }
};
module.exports = {
    getuser,
    login,
    register,
    verifyToken,
};
