const mongoose = require("mongoose");

const schema = mongoose.Schema(
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

const User = mongoose.model("User", schema);

module.exports = User;
