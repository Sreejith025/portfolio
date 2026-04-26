const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ msg: "No token" });

    try {
        jwt.verify(token, "secretkey");
        next();
    } catch {
        res.status(401).json({ msg: "Invalid token" });
    }
}

// POST - Save Report
router.post("/submit", auth, async (req, res) => {
    try {
        const report = new Report(req.body);
        await report.save();
        res.json({ message: "Report saved successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - All Reports (for future dashboard)
router.get("/", auth, async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;