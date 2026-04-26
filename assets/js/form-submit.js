document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submitBtn");
    const form = document.querySelector(".report-form");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            // Collect signatures
            const techCanvas = document.getElementById("tech-signature");
            const custCanvas = document.getElementById("cust-signature");
            
            const techSignature = techCanvas ? techCanvas.toDataURL("image/png") : "";
            const custSignature = custCanvas ? custCanvas.toDataURL("image/png") : "";

            // Helper function to convert file to Base64
            const fileToBase64 = (file) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });

            // Process attachments
            const attachments = [];
            for (let i = 1; i <= 4; i++) {
                const fileInput = document.getElementById(`attachment${i}`);
                if (fileInput && fileInput.files.length > 0) {
                    try {
                        const base64String = await fileToBase64(fileInput.files[0]);
                        attachments.push(base64String);
                    } catch (error) {
                        console.error(`Error converting attachment ${i}:`, error);
                    }
                }
            }

            // Gather Form Data
            const reportData = {
                customerName: document.getElementById("customerName")?.value || "",
                reportDate: document.getElementById("reportDate")?.value || "",
                siteLocation: document.getElementById("siteLocation")?.value || "",
                serviceType: document.getElementById("serviceType")?.value || "",
                contactPerson: document.getElementById("contactPerson")?.value || "",
                technician: document.getElementById("technician")?.value || "",

                equipment: {
                    machineName: document.getElementById("machineName")?.value || "",
                    makeModel: document.getElementById("makeModel")?.value || "",
                    serialNumber: document.getElementById("serialNumber")?.value || "",
                    plcModel: document.getElementById("plcModel")?.value || ""
                },

                technicalChecklist: [
                    {
                        parameter: "Incoming Voltage",
                        reading: document.getElementById("reading1")?.value || "",
                        status: document.getElementById("status1")?.value || "",
                        remarks: document.getElementById("remarks1")?.value || ""
                    },
                    {
                        parameter: "Control Voltage",
                        reading: document.getElementById("reading2")?.value || "",
                        status: document.getElementById("status2")?.value || "",
                        remarks: document.getElementById("remarks2")?.value || ""
                    },
                    {
                        parameter: "Motor Load",
                        reading: document.getElementById("reading3")?.value || "",
                        status: document.getElementById("status3")?.value || "",
                        remarks: document.getElementById("remarks3")?.value || ""
                    }
                ],

                workDescription: {
                    description: document.getElementById("workDescription")?.value || "",
                    partsReplaced: document.getElementById("partsReplaced")?.value || ""
                },

                finalStatus: {
                    machineOK: document.getElementById("machineOK")?.checked || false,
                    followUp: document.getElementById("followUp")?.checked || false,
                    criticalAlert: document.getElementById("criticalAlert")?.checked || false,
                    recommendation: document.getElementById("recommendation")?.value || ""
                },
                
                technicianSignature: techSignature,
                customerSignature: custSignature,
                attachments: attachments
            };

            // Disable button and show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Submitting...";
            }

            try {
                const token = localStorage.getItem("token");
                const response = await fetch("https://portfolio-132f.onrender.com/api/reports/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    },
                    body: JSON.stringify(reportData)
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Report submitted successfully!");
                    // Optionally redirect
                    window.location.href = "thank-you.html";
                } else {
                    alert("Failed to submit report: " + (data.error || "Unknown error"));
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = "Submit Report";
                    }
                }
            } catch (error) {
                console.error("Error submitting report:", error);
                alert("An error occurred. Please make sure the backend is running.");
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Submit Report";
                }
            }
        });
    }
});
