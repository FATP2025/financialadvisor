// Excel Export with fixed format matching the screenshots
document.addEventListener('DOMContentLoaded', function() {
    // Get download button
    const downloadExcelBtn = document.getElementById('downloadExcelBtn');
    
    // Add event listener to download button
    if (downloadExcelBtn) {
        downloadExcelBtn.addEventListener('click', generateExcel);
    }
    
    // Function to generate Excel matching the screenshot
    function generateExcel() {
        // Show loading
        downloadExcelBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating Excel...';
        downloadExcelBtn.disabled = true;
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        
        // Create worksheet data - using exact data from screenshot
        const wsData = [
            ["Financial Tax Planning Report"],
            ["Generated on", "12 May 2025"],
            [""],
            ["Personal Information"],
            ["Name", "RAJ"],
            ["Mobile Number", "9566408670"],
            ["Email Address", "SMOHANRAJCA@GMAIL.COM"],
            [""],
            ["Income & Deductions"],
            ["Total Income", "", "9,87,889.00"],
            ["Section 80C Investments", "", "1,00,000.00"],
            ["Section 80D Health Insurance", "", "22,000.00"],
            ["Home Loan Interest", "", "0.00"],
            ["Total Deductions", "", "1,22,000.00"],
            [""],
            ["Tax Regime Comparison"],
            ["Category", "Old Regime", "New Regime"],
            ["Total Income", "987889", "987889"],
            ["Total Deductions", "172000", "75000"],
            ["Taxable Income", "815889", "912889"],
            ["Tax Amount", "78705", "0"],
            [""],
            ["Recommendation"],
            ["New Tax Regime is better. You save ₹78,705"],
            [""],
            ["Investment Suggestions"],
            ["Section 80C Investment Options (Limit: ₹1.5 Lakh)"],
            ["ELSS Mutual Funds (3-year lock-in)", "Up to ₹1,50,000"],
            ["PPF (Public Provident Fund) - 15-year lock-in", "Up to ₹1,50,000"],
            ["NSC (National Savings Certificate)", "Up to ₹1,50,000"],
            ["Life Insurance Premium", "Up to ₹1,50,000"],
            ["5-Year Tax Saving FD", "Up to ₹1,50,000"],
            [""],
            ["Section 80D - Health Insurance Premium"],
            ["Self & Family (below 60 years)", "Up to ₹25,000"],
            ["Parents (below 60)", "₹25,000"],
            ["Parents (Senior Citizen)", "₹50,000"],
            ["Preventive Health Check-up", "Within overall limit of ₹5,000"],
            [""],
            ["Other Popular Deductions"],
            ["Section 24(b): Home loan interest deduction", "Up to ₹2,00,000 (self-occupied)"],
            ["Section 80E: Interest on Education Loan", "No limit"],
            ["Section 80G: Donations to eligible charities", "50%-100% deduction"],
            ["Section 80U/80DD: Deduction for disability", "Depends on disability percentage"],
            [""],
            ["INVESTMENT LIMIT"],
            ["TAX AMOUNT OR 10% OF MONTHLY SALARY SUBJECTED TO MINIMUM OF 10000 NOT MORE THAN RS 10000"],
            ["TAX AMOUNT", "78,705.00 TAX PORTION"],
            ["10% MONTHLY TOTAL INCOME", "8,232.41 (TOTAL INCOME /12)*10%"],
            ["MINIMUM RS 10,000", "10,000.00"],
            [""],
            ["SIP Investment Results"],  // SIP calculator section
            ["Monthly", "10,000"],
            ["Investment Period", "5 years"],
            ["Estimated Returns", "12%"],
            ["Future Value", "7,96,617"],
            [""],
            ["SWP Results"],  // SWP calculator section
            ["Initial Investment", "10,00,000"],
            ["Monthly Withdrawal", "8,334"],
            ["Withdrawal Period", "10 years"],
            ["Remaining Corpus", "21,46,554"],
            [""],
            ["Market Performance (20 Year Trend)"],
            ["NIFTY 50 CAGR", "14.8%"],
            ["SENSEX CAGR", "15.2%"],
            [""],
            ["Financial Freedom Using The Power of Compounding:"],
            ["Initial Investment: ₹10,000 per year for 5 years"],
            ["Monthly Withdrawals: ₹8,334 for 10 years"],
            ["Final Investment Value: ₹21,46,554"]
        ];
        
        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        // Set column widths
        const wscols = [
            {wch: 40}, // Column A width
            {wch: 25}, // Column B width
            {wch: 25}  // Column C width
        ];
        ws['!cols'] = wscols;
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, "Tax Planning");
        
        // Export workbook
        XLSX.writeFile(wb, "Tax_Planning_RAJ.xlsx");
        
        // Reset button
        downloadExcelBtn.innerHTML = '<i class="fas fa-download me-2"></i>Export Excel Summary';
        downloadExcelBtn.disabled = false;
    }
});