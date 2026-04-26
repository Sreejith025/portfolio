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
        window.allReports = reports; // Store globally for viewing

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
    const report = window.allReports.find(r => r._id === id);
    if (!report) return;

    const modal = document.getElementById('reportModal');
    const modalBody = document.getElementById('modalBody');
    const modalDate = document.getElementById('modalDate');

    const date = report.reportDate ? new Date(report.reportDate).toLocaleDateString() : new Date(report.createdAt).toLocaleDateString();
    modalDate.textContent = `Report Date: ${date}`;

    let attachmentsHtml = '';
    if (report.attachments && report.attachments.length > 0) {
        attachmentsHtml = `
            <div class="form-section" style="margin-top: 20px;">
                <h3 style="margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Attachments</h3>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    ${report.attachments.map(att => `<img src="${att}" style="max-width: 200px; max-height: 200px; object-fit: contain; border: 1px solid #ddd; border-radius: 5px; padding: 5px; background: #fff;" />`).join('')}
                </div>
            </div>
        `;
    }

    let signaturesHtml = `
        <div class="form-section" style="margin-top: 20px;">
            <h3 style="margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Signatures</h3>
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                ${report.technicianSignature ? `<div><p><strong>Technician:</strong></p><img src="${report.technicianSignature}" style="max-width: 200px; border: 1px solid #eee; background: #fafafa;" /></div>` : '<div><p>No Technician Signature</p></div>'}
                ${report.customerSignature ? `<div><p><strong>Customer:</strong></p><img src="${report.customerSignature}" style="max-width: 200px; border: 1px solid #eee; background: #fafafa;" /></div>` : '<div><p>No Customer Signature</p></div>'}
            </div>
        </div>
    `;

    modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div><strong>Customer Name:</strong> ${report.customerName || "-"}</div>
            <div><strong>Site Location:</strong> ${report.siteLocation || "-"}</div>
            <div><strong>Service Type:</strong> ${report.serviceType || "-"}</div>
            <div><strong>Technician:</strong> ${report.technician || "-"}</div>
            <div><strong>Contact Person:</strong> ${report.contactPerson || "-"}</div>
        </div>

        <div class="form-section">
            <h3 style="margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Equipment Details</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div><strong>Machine Name:</strong> ${report.equipment?.machineName || "-"}</div>
                <div><strong>Make/Model:</strong> ${report.equipment?.makeModel || "-"}</div>
                <div><strong>Serial Number:</strong> ${report.equipment?.serialNumber || "-"}</div>
                <div><strong>PLC/VFD Model:</strong> ${report.equipment?.plcModel || "-"}</div>
            </div>
        </div>

        <div class="form-section" style="margin-top: 20px;">
            <h3 style="margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Technical Checklist</h3>
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr style="background: #f4f6fc;">
                        <th style="padding: 8px; border: 1px solid #ddd;">Parameter</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Reading</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Status</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    ${(report.technicalChecklist || []).map(item => `
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;">${item.parameter || "-"}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${item.reading || "-"}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${item.status || "-"}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${item.remarks || "-"}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="form-section" style="margin-top: 20px;">
            <h3 style="margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Work Description</h3>
            <p><strong>Description:</strong> ${report.workDescription?.description || "-"}</p>
            <p><strong>Parts Replaced:</strong> ${report.workDescription?.partsReplaced || "-"}</p>
        </div>

        ${signaturesHtml}
        ${attachmentsHtml}
    `;

    modal.style.display = "block";
}

// Close modal logic
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById('reportModal');
    const closeBtn = document.querySelector('.close-modal');

    if (closeBtn && modal) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
        }
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
});
