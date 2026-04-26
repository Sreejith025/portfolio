const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://abisri024_db_user:smp123@cluster0.wxslaxs.mongodb.net/simplevolt");
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;