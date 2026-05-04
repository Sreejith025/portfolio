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
                        <div style="display: flex; gap: 5px;">
                            <button class="btn-clear" onclick="viewReport('${report._id}')" style="font-size: 12px; padding: 4px 8px;">View</button>
                            <button class="btn-primary" onclick="downloadReport('${report._id}')" style="font-size: 12px; padding: 4px 8px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Download</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: red; padding: 20px;">Error loading reports. Make sure your server is running.</td></tr>`;
    }
});

function generateReportHTML(report) {
    let attachmentsHtml = '';
    if (report.attachments && report.attachments.length > 0) {
        attachmentsHtml = `
            <div class="form-section" style="margin-top: 20px;">
                <h3 style="margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Attachments</h3>
                <div style="display: block; width: 100%;">
                    ${report.attachments.map(att => `<div style="display: inline-block; vertical-align: top; margin-right: 10px; margin-bottom: 10px; page-break-inside: avoid; break-inside: avoid;"><img src="${att}" style="max-width: 200px; max-height: 200px; object-fit: contain; border: 1px solid #ddd; border-radius: 5px; padding: 5px; background: #fff;" crossorigin="anonymous" /></div>`).join('')}
                </div>
            </div>
        `;
    }

    let signaturesHtml = `
        <div class="form-section" style="margin-top: 20px; page-break-inside: avoid; break-inside: avoid; display: inline-block; width: 100%;">
            <h3 style="margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Signatures</h3>
            <div style="display: block; width: 100%;">
                ${report.technicianSignature ? `<div style="display: inline-block; vertical-align: top; margin-right: 20px; page-break-inside: avoid; break-inside: avoid;"><p><strong>Technician:</strong></p><img src="${report.technicianSignature}" style="max-width: 200px; border: 1px solid #eee; background: #fafafa;" crossorigin="anonymous" /></div>` : '<div style="display: inline-block; vertical-align: top; margin-right: 20px;"><p>No Technician Signature</p></div>'}
                ${report.customerSignature ? `<div style="display: inline-block; vertical-align: top; margin-right: 20px; page-break-inside: avoid; break-inside: avoid;"><p><strong>Customer:</strong></p><img src="${report.customerSignature}" style="max-width: 200px; border: 1px solid #eee; background: #fafafa;" crossorigin="anonymous" /></div>` : '<div style="display: inline-block; vertical-align: top; margin-right: 20px;"><p>No Customer Signature</p></div>'}
            </div>
        </div>
    `;

    let statusLabels = [];
    if (report.finalStatus?.machineOK) statusLabels.push("Machine OK");
    if (report.finalStatus?.followUp) statusLabels.push("Follow-up Required");
    if (report.finalStatus?.criticalAlert) statusLabels.push("Critical Alert");
    
    let finalStatusHtml = `
        <div class="form-section" style="margin-top: 20px; page-break-inside: avoid; break-inside: avoid;">
            <h3 style="margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Final Status & Recommendation</h3>
            <p style="margin-bottom: 8px;"><strong>Status:</strong> ${statusLabels.length > 0 ? statusLabels.join(", ") : "-"}</p>
            <p><strong>Recommendation:</strong> ${report.finalStatus?.recommendation || "-"}</p>
        </div>
    `;

    return `
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
                        <tr style="page-break-inside: avoid; break-inside: avoid;">
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

        ${finalStatusHtml}
        ${signaturesHtml}
        ${attachmentsHtml}
    `;
}

window.viewReport = function (id) {
    const report = window.allReports.find(r => r._id === id);
    if (!report) return;

    const modal = document.getElementById('reportModal');
    const modalBody = document.getElementById('modalBody');
    const modalDate = document.getElementById('modalDate');

    const date = report.reportDate ? new Date(report.reportDate).toLocaleDateString() : new Date(report.createdAt).toLocaleDateString();
    modalDate.textContent = `Report Date: ${date}`;

    modalBody.innerHTML = generateReportHTML(report);

    // Set up download button in modal
    const downloadBtn = document.getElementById('downloadModalBtn');
    if (downloadBtn) {
        downloadBtn.onclick = () => window.downloadReport(id);
    }

    modal.style.display = "block";
};

// Close modal logic
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById('reportModal');
    const closeBtn = document.querySelector('.close-modal');

    if (closeBtn && modal) {
        closeBtn.onclick = function () {
            modal.style.display = "none";
        };
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    }
});

window.downloadReport = function (id) {
    const report = window.allReports.find(r => r._id === id);
    if (!report) return;

    // Show a loading state or indicate downloading
    const date = report.reportDate ? new Date(report.reportDate).toLocaleDateString() : new Date(report.createdAt).toLocaleDateString();

    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.color = '#333';
    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">
            <h1 style="color: #0056b3; margin: 0;">SimpleVolt Service Report</h1>
            <p style="margin: 5px 0 0 0; color: #555;">Date: ${date}</p>
        </div>
        ${generateReportHTML(report)}
    `;

    const opt = {
        margin: 0.5,
        filename: `Service_Report_${report.customerName?.replace(/\s+/g, '_') || 'Unknown'}_${date.replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
    };

    html2pdf().set(opt).from(container).save();
};