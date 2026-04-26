const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/reports", require("./routes/reportRoutes"));

app.use("/api/auth", require("./routes/authRoutes"));

app.listen(process.env.PORT || 5000, () => {
    console.log("🚀 Server running on port 5000");
});