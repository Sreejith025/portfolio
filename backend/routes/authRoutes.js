const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const token = jwt.sign({ role: "admin" }, "secretkey", {
            expiresIn: "1h"
        });

        return res.json({ token });
    }

    res.status(401).json({ message: "Invalid credentials" });
});

module.exports = router;