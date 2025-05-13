// Simple PDF Generator for Financial Tax Planner
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
        
        // Get form data
        const name = document.getElementById('fullName').value || 'RAJ';
        const mobile = document.getElementById('mobileNumber').value || '9566408670';
        const email = document.getElementById('emailAddress').value || 'SMOHANRAJCA@GMAIL.COM';
        
        // Create a new jsPDF instance
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        // Add content to PDF
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("Financial Tax Planning Report", 105, 20, { align: "center" });
        
        // Date
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'MMMM',
            year: 'numeric'
        });
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text("Generated on", 70, 30);
        pdf.text(dateStr, 180, 30);
        
        // Personal Information
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Personal Information", 20, 40);
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text("Name", 50, 50);
        pdf.text(name.toUpperCase(), 100, 50);
        
        pdf.text("Mobile Number", 50, 57);
        pdf.text(mobile, 100, 57);
        
        pdf.text("Email Address", 50, 64);
        pdf.text(email.toUpperCase(), 100, 64);
        
        // Income & Deductions
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Income & Deductions", 20, 80);
        
        // Income data
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text("Total Income", 50, 90);
        pdf.text("9,87,889.00", 190, 90, { align: "right" });
        
        pdf.text("Section 80C Investments", 50, 97);
        pdf.text("1,00,000.00", 190, 97, { align: "right" });
        
        pdf.text("Section 80D Health Insurance", 50, 104);
        pdf.text("22,000.00", 190, 104, { align: "right" });
        
        pdf.text("Home Loan Interest", 50, 111);
        pdf.text("0.00", 190, 111, { align: "right" });
        
        pdf.text("Total Deductions", 50, 118);
        pdf.text("1,22,000.00", 190, 118, { align: "right" });
        
        // Tax Regime Comparison
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Tax Regime Comparison", 20, 128);
        
        // Table headers
        pdf.setFontSize(11);
        pdf.text("Category", 20, 138);
        pdf.text("Old Regime", 140, 138, { align: "right" });
        pdf.text("New Regime", 190, 138, { align: "right" });
        
        // Table data
        pdf.setFont("helvetica", "normal");
        pdf.text("Total Income", 20, 145);
        pdf.text("987889", 140, 145, { align: "right" });
        pdf.text("987889", 190, 145, { align: "right" });
        
        pdf.text("Total Deductions", 20, 152);
        pdf.text("172000", 140, 152, { align: "right" });
        pdf.text("75000", 190, 152, { align: "right" });
        
        pdf.text("Taxable Income", 20, 159);
        pdf.text("815889", 140, 159, { align: "right" });
        pdf.text("912889", 190, 159, { align: "right" });
        
        pdf.text("Tax Amount", 20, 166);
        pdf.text("78705", 140, 166, { align: "right" });
        pdf.text("0", 190, 166, { align: "right" });
        
        // Recommendation
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Recommendation", 20, 180);
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text("New Tax Regime is better. You save ₹78,705", 20, 190);
        
        // Investment Suggestions
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Investment Suggestions", 20, 200);
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text("Section 80C Investment Options (Limit: ₹1.5 Lakh)", 20, 210);
        
        pdf.setFont("helvetica", "normal");
        pdf.text("ELSS Mutual Funds (3-year lock-in)", 20, 220);
        pdf.text("Up to ₹1,50,000", 150, 220);
        
        pdf.text("PPF (Public Provident Fund) - 15-year lock-in", 20, 227);
        pdf.text("Up to ₹1,50,000", 150, 227);
        
        pdf.text("NSC (National Savings Certificate)", 20, 234);
        pdf.text("Up to ₹1,50,000", 150, 234);
        
        pdf.text("Life Insurance Premium", 20, 241);
        pdf.text("Up to ₹1,50,000", 150, 241);
        
        pdf.text("5-Year Tax Saving FD", 20, 248);
        pdf.text("Up to ₹1,50,000", 150, 248);
        
        // Add a new page
        pdf.addPage();
        
        // Section 80D
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text("Section 80D - Health Insurance Premium", 20, 20);
        
        pdf.setFont("helvetica", "normal");
        pdf.text("Self & Family (below 60 years)", 20, 27);
        pdf.text("Up to ₹25,000", 150, 27);
        
        pdf.text("Parents (below 60)", 20, 34);
        pdf.text("₹25,000", 150, 34);
        
        pdf.text("Parents (Senior Citizen)", 20, 41);
        pdf.text("₹50,000", 150, 41);
        
        pdf.text("Preventive Health Check-up", 20, 48);
        pdf.text("Within overall limit of ₹5,000", 150, 48);
        
        // Other deductions
        pdf.setFont("helvetica", "bold");
        pdf.text("Other Popular Deductions", 20, 58);
        
        pdf.setFont("helvetica", "normal");
        pdf.text("Section 24(b): Home loan interest deduction", 20, 65);
        pdf.text("Up to ₹2,00,000 (self-occupied)", 150, 65);
        
        pdf.text("Section 80E: Interest on Education Loan", 20, 72);
        pdf.text("No limit", 150, 72);
        
        pdf.text("Section 80G: Donations to eligible charities", 20, 79);
        pdf.text("50%-100% deduction", 150, 79);
        
        pdf.text("Section 80U/80DD: Deduction for disability", 20, 86);
        pdf.text("Depends on disability percentage", 150, 86);
        
        // Investment limit
        pdf.setFont("helvetica", "bold");
        pdf.text("INVESTMENT LIMIT", 20, 96);
        
        pdf.setFont("helvetica", "normal");
        pdf.text("TAX AMOUNT OR 10% OF MONTHLY SALARY SUBJECTED TO MINIMUM OF 10000 NOT MORE THAN RS 10000", 20, 103);
        
        pdf.text("TAX AMOUNT", 20, 110);
        pdf.text("78,705.00 TAX PORTION", 190, 110, { align: "right" });
        
        pdf.text("10% MONTHLY TOTAL INCOME", 20, 117);
        pdf.text("8,232.41 (TOTAL INCOME /12)*10%", 190, 117, { align: "right" });
        
        pdf.text("MINIMUM RS 10,000", 20, 124);
        pdf.text("10,000.00", 190, 124, { align: "right" });
        
        // Financial Freedom section
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Financial Freedom Using The Power of", 105, 140, { align: "center" });
        pdf.text("Compounding:", 105, 147, { align: "center" });
        
        // Create simple compounding diagram
        pdf.setDrawColor(100, 100, 100);
        pdf.setLineWidth(0.5);
        
        // Main timeline arrow
        pdf.line(30, 165, 170, 165);
        
        // Year markers
        const yearMarkers = [
            { x: 30, label: "Year 1", subtext: "Initial Investment" },
            { x: 60, label: "Year 5", subtext: "Annual investments\ncease, compounding\ncontinues" },
            { x: 90, label: "Year 6", subtext: "Monthly\nWithdrawals\nBegin" },
            { x: 140, label: "Year 15", subtext: "Withdrawals\nEnd" },
            { x: 170, label: "Year 16", subtext: "Final\nInvestment\nValue" }
        ];
        
        // Add the year markers
        yearMarkers.forEach(marker => {
            // Draw marker dot
            pdf.circle(marker.x, 165, 1, 'F');
            
            // Draw label
            pdf.setFontSize(9);
            pdf.setFont("helvetica", "bold");
            pdf.text(marker.label, marker.x, 160, { align: "center" });
            
            // Draw subtext
            pdf.setFontSize(8);
            pdf.setFont("helvetica", "normal");
            const lines = marker.subtext.split('\n');
            let y = 170;
            lines.forEach(line => {
                pdf.text(line, marker.x, y, { align: "center" });
                y += 5;
            });
        });
        
        // Add key values
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        pdf.text("₹10,000 invested\nannually for five\nyears", 30, 190, { align: "center" });
        pdf.text("₹8,334 withdrawn\nmonthly for ten\nyears", 90, 190, { align: "center" });
        pdf.text("₹21,46,554 achieved\nthrough\ncompounding", 170, 190, { align: "center" });
        
        // Add a new page for abstract and details
        pdf.addPage();
        
        // Abstract
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Abstract", 20, 20);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("This document explores the remarkable impact of compounding on investments through a", 20, 30);
        pdf.text("hypothetical scenario where an individual invests ₹10,000 annually for the first five years.", 20, 35);
        pdf.text("Following this initial investment period, the individual opts for a Systematic Withdrawal", 20, 40);
        pdf.text("Plan (SWP) to withdraw ₹8,334 monthly for the next ten years. The analysis culminates", 20, 45);
        pdf.text("in a substantial final investment value of ₹21,46,554 at the end of the 15-year period.", 20, 50);
        pdf.text("This report highlights the significance of consistent investment and the compounding", 20, 55);
        pdf.text("effect, illustrated with a pictorial representation.", 20, 60);
        
        // Investment Overview
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Investment Overview", 20, 75);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text("1. Initial Investment:", 30, 85);
        
        pdf.setFont("helvetica", "normal");
        pdf.text("• Amount: ₹10,000 per year", 40, 95);
        pdf.text("• Duration: 5 years", 40, 100);
        pdf.text("• Total Investment: ₹50,000", 40, 105);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text("Withdrawal Phase:", 30, 120);
        
        pdf.setFont("helvetica", "normal");
        pdf.text("• Plan: Systematic Withdrawal Plan (SWP)", 40, 130);
        pdf.text("• Monthly Withdrawal: ₹8,334", 40, 135);
        pdf.text("• Duration: 10 years", 40, 140);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text("3. Final Investment Value:", 30, 155);
        
        pdf.setFont("helvetica", "normal");
        pdf.text("• Amount at the end of 15 years: ₹21,46,554", 40, 165);
        
        // The Compounding Effect
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("The Compounding Effect", 20, 180);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("The compounding effect refers to the process where the value of an investment grows", 20, 190);
        pdf.text("exponentially over time due to the interest earned on both the initial principal and the", 20, 195);
        pdf.text("accumulated interest from previous periods. This scenario illustrates how a modest annual", 20, 200);
        pdf.text("investment can lead to significant wealth accumulation over time.", 20, 205);
        
        // Yearly Breakdown
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Yearly Breakdown of Investment Growth", 20, 220);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("• Years 1-5:", 30, 230);
        pdf.text("• Each ₹10,000 investment grows at a compounded rate.", 40, 235);
        pdf.text("• Years 6-15:", 30, 245);
        pdf.text("• The investment continues to grow even as withdrawals are made.", 40, 250);
        
        // Conclusion section
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Conclusion", 20, 265);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("Investing just ₹10,000 annually for the first five years can lead to a remarkable financial", 20, 275);
        pdf.text("outcome due to the power of compounding. The ability to withdraw ₹8,334 monthly for", 20, 280);
        pdf.text("the next ten years while still ending up with a significant investment value of", 20, 285);
        
        // Add a new page to finish the document
        pdf.addPage();
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("₹21,46,554 underscores the importance of starting early and remaining consistent in", 20, 20);
        pdf.text("investment practices. This scenario serves as a compelling example of how even a", 20, 25);
        pdf.text("small percentage of one's salary can yield substantial returns over time through the", 20, 30);
        pdf.text("power of compounding.", 20, 35);
        
        // Save the PDF
        pdf.save("Tax_Planning_Report_" + name.replace(/\s+/g, '_') + ".pdf");
        
        // Reset button state
        downloadPdfBtn.innerHTML = '<i class="fas fa-download me-2"></i>Download Investment Report';
        downloadPdfBtn.disabled = false;
    }
});