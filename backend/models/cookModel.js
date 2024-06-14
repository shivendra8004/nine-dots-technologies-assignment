const mongoose = require("mongoose");
const { z } = require("zod");

// Zod schema for validation
const cookSchema = z.object({
    name: z.string().min(3),
    mobile: z.number().int().gte(1000000000).lte(9999999999),
    cuisines: z.array(z.enum(["Bengali", "Chettinad", "Continental", "Mexican", "French", "Hyderabadi"])).nonempty(),
    city: z.enum(["Benglore", "Chennai", "Delhi", "Mumbai", "Kolkata"]),
    description: z.string().min(5),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

// Mongoose schema
const mongooseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minLength: 3,
        },
        mobile: {
            type: Number,
            required: true,
            minLength: 10,
        },
        cuisines: {
            type: [String],
            enum: ["Bengali", "Chettinad", "Continental", "Mexican", "French", "Hyderabadi"],
            required: true,
        },
        city: {
            type: String,
            enum: ["Benglore", "Chennai", "Delhi", "Mumbai", "Kolkata"],
            required: true,
        },
        description: {
            type: String,
            required: true,
            minLength: 5,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Middleware to validate data with Zod before saving
mongooseSchema.pre("save", function (next) {
    try {
        cookSchema.parse(this.toObject());
        next();
    } catch (error) {
        next(error);
    }
});

const Cook = mongoose.model("Cook", mongooseSchema);

module.exports = { Cook, cookSchema };
