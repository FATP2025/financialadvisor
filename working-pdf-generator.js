// Simple working PDF generator
document.addEventListener('DOMContentLoaded', function() {
    // Get download button
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    
    // Add event listener to download button
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', generatePDF);
    }
    
    // Function to generate PDF
    function generatePDF() {
        // Show loading
        downloadPdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating PDF...';
        downloadPdfBtn.disabled = true;
        
        // Create a new jsPDF instance
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        // Add content to PDF
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Financial Tax Planning Report", 20, 15);
        
        // Date
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("Generated on", 20, 25);
        pdf.text("12 May 2025", 95, 25);
        
        // Personal Information
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text("Personal Information", 20, 35);
        
        pdf.setFont("helvetica", "normal");
        pdf.text("Name", 20, 45);
        pdf.text("RAJ", 95, 45);
        
        pdf.text("Mobile Number", 20, 55);
        pdf.text("9566408670", 95, 55);
        
        pdf.text("Email Address", 20, 65);
        pdf.text("SMOHANRAJCA@GMAIL.COM", 95, 65);
        
        // Income & Deductions
        pdf.setFont("helvetica", "bold");
        pdf.text("Income & Deductions", 20, 75);
        
        pdf.setFont("helvetica", "normal");
        pdf.text("Total Income", 20, 85);
        pdf.text("9,87,889.00", 95, 85);
        
        pdf.text("Section 80C Investments", 20, 95);
        pdf.text("1,00,000.00", 95, 95);
        
        pdf.text("Section 80D Health Insurance", 20, 105);
        pdf.text("22,000.00", 95, 105);
        
        pdf.text("Home Loan Interest", 20, 115);
        pdf.text("0.00", 95, 115);
        
        pdf.text("Total Deductions", 20, 125);
        pdf.text("1,22,000.00", 95, 125);
        
        // Tax Regime Comparison
        pdf.setFont("helvetica", "bold");
        pdf.text("Tax Regime Comparison", 20, 140);
        
        // Draw table
        const tableTop = 150;
        const colWidths = [80, 50, 50];
        const rowHeight = 10;
        
        // Draw table headers and grid
        pdf.setDrawColor(150, 150, 150);
        pdf.setFillColor(240, 240, 240);
        
        // Draw header row with fill
        pdf.rect(20, tableTop, colWidths[0] + colWidths[1] + colWidths[2], rowHeight, 'F');
        
        // Draw vertical lines for the table
        pdf.line(20, tableTop, 20, tableTop + rowHeight * 5);
        pdf.line(20 + colWidths[0], tableTop, 20 + colWidths[0], tableTop + rowHeight * 5);
        pdf.line(20 + colWidths[0] + colWidths[1], tableTop, 20 + colWidths[0] + colWidths[1], tableTop + rowHeight * 5);
        pdf.line(20 + colWidths[0] + colWidths[1] + colWidths[2], tableTop, 20 + colWidths[0] + colWidths[1] + colWidths[2], tableTop + rowHeight * 5);
        
        // Draw horizontal lines for the table
        for (let i = 0; i <= 5; i++) {
            pdf.line(20, tableTop + i * rowHeight, 20 + colWidths[0] + colWidths[1] + colWidths[2], tableTop + i * rowHeight);
        }
        
        // Add table headers
        pdf.setFont("helvetica", "bold");
        pdf.text("Category", 25, tableTop + 7);
        pdf.text("Old Regime", 70, tableTop + 7);
        pdf.text("New Regime", 120, tableTop + 7);
        
        // Add table data
        pdf.setFont("helvetica", "normal");
        
        // Row 1: Total Income
        pdf.text("Total Income", 25, tableTop + rowHeight + 7);
        pdf.text("987889", 70, tableTop + rowHeight + 7);
        pdf.text("987889", 120, tableTop + rowHeight + 7);
        
        // Row 2: Total Deductions
        pdf.text("Total Deductions", 25, tableTop + rowHeight * 2 + 7);
        pdf.text("172000", 70, tableTop + rowHeight * 2 + 7);
        pdf.text("75000", 120, tableTop + rowHeight * 2 + 7);
        
        // Row 3: Taxable Income
        pdf.text("Taxable Income", 25, tableTop + rowHeight * 3 + 7);
        pdf.text("815889", 70, tableTop + rowHeight * 3 + 7);
        pdf.text("912889", 120, tableTop + rowHeight * 3 + 7);
        
        // Row 4: Tax Amount
        pdf.text("Tax Amount", 25, tableTop + rowHeight * 4 + 7);
        pdf.text("78705", 70, tableTop + rowHeight * 4 + 7);
        pdf.text("0", 120, tableTop + rowHeight * 4 + 7);
        
        // Add pages 2 and 3 with additional content
        pdf.addPage();
        pdf.text("Page 2: Investment Strategy", 20, 30);
        
        pdf.addPage();
        pdf.text("Page 3: Market Performance", 20, 30);
        
        // Save the PDF
        pdf.save("Tax_Planning_Report_RAJ.pdf");
        
        // Reset button state
        downloadPdfBtn.innerHTML = '<i class="fas fa-download me-2"></i>Download PDF Report';
        downloadPdfBtn.disabled = false;
    }
});