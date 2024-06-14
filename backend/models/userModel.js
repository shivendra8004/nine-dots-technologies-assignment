const mongoose = require("mongoose");
const { z } = require("zod");

// Zod schema for validation
const userSchema = z.object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(5),
    pic: z.string().url().optional().default("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"),
});

// Mongoose schema
const mongooseSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 3,
        },
        lastName: {
            type: String,
            required: true,
            minLength: 3,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 5,
        },
        pic: {
            type: String,
            default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
    },
    {
        timestamps: true,
    }
);

// Middleware to validate data with Zod before saving
mongooseSchema.pre("save", function (next) {
    try {
        userSchema.parse(this.toObject());
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model("User", mongooseSchema);

module.exports = { User, userSchema };
