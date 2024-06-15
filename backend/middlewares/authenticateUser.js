const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ ok: false, message: "Authorization header missing or invalid" });
        }

        const token = authHeader.split(" ")[1];
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

        req.locals = verifyToken.userId;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ ok: false, message: "Token expired" });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ ok: false, message: "Token invalid" });
        }

        return res.status(500).json({ ok: false, message: "Internal server error" });
    }
};

module.exports = auth;
