document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const tbody = document.querySelector("#reportsTable tbody");

    if (!token) return;

    try {
        const response = await fetch("https://portfolio-132f.onrender.com/api/reports", {
            headers: {
                "Authorization": token
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch reports");
        }

        const reports = await response.json();

        if (reports.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px;">No reports found.</td></tr>`;
            return;
        }

        tbody.innerHTML = reports.map(report => {
            const date = report.reportDate ? new Date(report.reportDate).toLocaleDateString() : new Date(report.createdAt).toLocaleDateString();
            
            // Derive some status text
            let status = "Pending";
            let statusClass = "pending";

            if (report.finalStatus) {
                if (report.finalStatus.criticalAlert) {
                    status = "Critical";
                    statusClass = "critical";
                } else if (report.finalStatus.followUp) {
                    status = "Follow-up";
                    statusClass = "followup";
                } else if (report.finalStatus.machineOK) {
                    status = "OK";
                    statusClass = "ok";
                }
            }

            return `
                <tr>
                    <td>${date}</td>
                    <td>${report.customerName || "-"}</td>
                    <td>${report.siteLocation || "-"}</td>
                    <td>${report.serviceType || "-"}</td>
                    <td>${report.technician || "-"}</td>
                    <td><span class="status-badge ${statusClass}">${status}</span></td>
                    <td>
                        <button class="btn-clear" onclick="viewReport('${report._id}')" style="font-size: 12px; padding: 4px 8px;">View</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: red; padding: 20px;">Error loading reports. Make sure your server is running.</td></tr>`;
    }
});

function viewReport(id) {
    alert("Viewing report details for ID: " + id + "\n\n(Full report view UI coming soon!)");
}
