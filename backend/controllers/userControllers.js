const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getuser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        return res.send({ ok: true, data: user });
    } catch (error) {
        res.status(500).send({ ok: false, message: "Unable to get user" });
    }
    u;
};

const login = async (req, res) => {
    try {
        const emailPresent = await User.findOne({ email: req.body.email });
        if (!emailPresent) {
            return res.status(400).send({ ok: false, message: "Email not found" });
        }
        const verifyPass = await bcrypt.compare(req.body.password, emailPresent.password);
        if (!verifyPass) {
            return res.status(400).send({ ok: false, message: "Invalid password" });
        }
        const token = jwt.sign({ userId: emailPresent._id }, process.env.JWT_SECRET, {
            expiresIn: "2 hours",
        });
        return res.status(201).send({ msg: "User logged in successfully", token });
    } catch (error) {
        res.status(500).send({ ok: false, message: "Unable to login user due to technical error" });
    }
};

const register = async (req, res) => {
    try {
        const emailPresent = await User.findOne({ email: req.body.email });
        if (emailPresent) {
            return res.status(400).send({ ok: true, message: "Email already exists" });
        }
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        const user = await User({ ...req.body, password: hashedPass });
        const result = await user.save();
        if (!result) {
            return res.status(500).send({ ok: false, message: "Unable to register user" });
        }
        return res.status(201).send({ ok: true, message: "User registered successfully" });
    } catch (error) {
        res.status(500).send({ ok: false, message: "Unable to register user" });
    }
};

module.exports = {
    getuser,
    login,
    register,
};
