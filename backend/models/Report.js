const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    customerName: String,
    reportDate: String,
    siteLocation: String,
    serviceType: String,
    contactPerson: String,
    technician: String,

    equipment: {
        machineName: String,
        makeModel: String,
        serialNumber: String,
        plcModel: String
    },

    technicalChecklist: [
        {
            parameter: String,
            reading: String,
            status: String,
            remarks: String
        }
    ],

    workDescription: {
        description: String,
        partsReplaced: String
    },

    finalStatus: {
        machineOK: Boolean,
        followUp: Boolean,
        criticalAlert: Boolean,
        recommendation: String
    },

    technicianSignature: String,
    customerSignature: String,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Report", reportSchema);