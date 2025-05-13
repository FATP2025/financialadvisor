// Excel Export for Financial Tax Planner
document.addEventListener('DOMContentLoaded', function() {
    // Get download button
    const downloadExcelBtn = document.getElementById('downloadExcelBtn');
    
    // Add event listener to download button
    if (downloadExcelBtn) {
        downloadExcelBtn.addEventListener('click', generateExcel);
    }
    
    // Function to generate Excel
    function generateExcel() {
        // Show loading
        downloadExcelBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating Excel...';
        downloadExcelBtn.disabled = true;
        
        // Get form data
        const name = document.getElementById('fullName').value;
        const mobile = document.getElementById('mobileNumber').value;
        const email = document.getElementById('emailAddress').value;
        
        // Tax calculation data
        const totalIncome = parseFloat(document.getElementById('totalIncome').value) || 0;
        const section80C = parseFloat(document.getElementById('section80C').value) || 0;
        const section80D = parseFloat(document.getElementById('section80D').value) || 0;
        const homeLoanInterest = parseFloat(document.getElementById('homeLoanInterest').value) || 0;
        
        // Tax regime comparison
        const oldTotalIncome = document.getElementById('oldRegimeTotalIncome').textContent.replace('₹', '').replace(/,/g, '');
        const oldDeductions = document.getElementById('oldRegimeTotalDeductions').textContent.replace('₹', '').replace(/,/g, '');
        const oldTaxableIncome = document.getElementById('oldRegimeTaxableIncome').textContent.replace('₹', '').replace(/,/g, '');
        const oldTaxAmount = document.getElementById('oldRegimeTaxAmount').textContent.replace('₹', '').replace(/,/g, '');
        
        const newTotalIncome = document.getElementById('newRegimeTotalIncome').textContent.replace('₹', '').replace(/,/g, '');
        const newDeductions = document.getElementById('newRegimeTotalDeductions').textContent.replace('₹', '').replace(/,/g, '');
        const newTaxableIncome = document.getElementById('newRegimeTaxableIncome').textContent.replace('₹', '').replace(/,/g, '');
        const newTaxAmount = document.getElementById('newRegimeTaxAmount').textContent.replace('₹', '').replace(/,/g, '');
        
        // Get today's date for the report
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        // Create workbook data
        const workbook = XLSX.utils.book_new();
        
        // Personal Information worksheet
        const personalData = [
            ['Financial Tax Planning Report'],
            ['Generated on', dateStr],
            [''],
            ['Personal Information'],
            ['Name', name],
            ['Mobile Number', mobile],
            ['Email Address', email],
            ['']
        ];
        
        // Income & Deductions worksheet
        const incomeData = [
            ['Income & Deductions'],
            ['Total Income', totalIncome],
            ['Section 80C Investments', section80C],
            ['Section 80D Health Insurance', section80D],
            ['Home Loan Interest', homeLoanInterest],
            ['Total Deductions', section80C + section80D + homeLoanInterest],
            ['']
        ];
        
        // Tax Comparison worksheet
        const taxComparisonData = [
            ['Tax Regime Comparison'],
            ['Category', 'Old Regime', 'New Regime'],
            ['Total Income', oldTotalIncome, newTotalIncome],
            ['Total Deductions', oldDeductions, newDeductions],
            ['Taxable Income', oldTaxableIncome, newTaxableIncome],
            ['Tax Amount', oldTaxAmount, newTaxAmount],
            [''],
            ['Recommendation'],
            [(parseFloat(oldTaxAmount) < parseFloat(newTaxAmount)) ? 
                'Old Tax Regime is better. You save ₹' + (parseFloat(newTaxAmount) - parseFloat(oldTaxAmount)).toLocaleString('en-IN') : 
                'New Tax Regime is better. You save ₹' + (parseFloat(oldTaxAmount) - parseFloat(newTaxAmount)).toLocaleString('en-IN')],
            ['']
        ];
        
        // Investment Suggestions worksheet
        const investmentData = [
            ['Investment Suggestions'],
            ['Section 80C Investment Options (Limit: ₹1.5 Lakh)'],
            ['ELSS Mutual Funds (3-year lock-in)', 'Up to ₹1,50,000'],
            ['PPF (Public Provident Fund) - 15-year lock-in', 'Up to ₹1,50,000'],
            ['NSC (National Savings Certificate)', 'Up to ₹1,50,000'],
            ['Life Insurance Premium', 'Up to ₹1,50,000'],
            ['5-Year Tax Saving FD', 'Up to ₹1,50,000'],
            [''],
            ['Section 80D - Health Insurance Premium'],
            ['Self & Family (below 60 years)', 'Up to ₹25,000'],
            ['Parents (below 60)', '₹25,000'],
            ['Parents (Senior Citizen)', '₹50,000'],
            ['Preventive Health Check-up', 'Within overall limit of ₹5,000'],
            [''],
            ['Other Popular Deductions'],
            ['Section 24(b): Home loan interest deduction', 'Up to ₹2,00,000 (self-occupied)'],
            ['Section 80E: Interest on Education Loan', 'No limit'],
            ['Section 80G: Donations to eligible charities', '50%-100% deduction'],
            ['Section 80U/80DD: Deduction for disability', 'Depends on disability percentage'],
            ['']
        ];
        
        // Create worksheets
        const personalWorksheet = XLSX.utils.aoa_to_sheet(personalData);
        const incomeWorksheet = XLSX.utils.aoa_to_sheet(incomeData);
        const taxComparisonWorksheet = XLSX.utils.aoa_to_sheet(taxComparisonData);
        const investmentWorksheet = XLSX.utils.aoa_to_sheet(investmentData);
        
        // Add worksheets to workbook
        XLSX.utils.book_append_sheet(workbook, personalWorksheet, "Personal Information");
        XLSX.utils.book_append_sheet(workbook, incomeWorksheet, "Income & Deductions");
        XLSX.utils.book_append_sheet(workbook, taxComparisonWorksheet, "Tax Comparison");
        XLSX.utils.book_append_sheet(workbook, investmentWorksheet, "Investment Options");
        
        // Generate Excel file
        XLSX.writeFile(workbook, `Tax_Planning_Summary_${name.replace(/\s+/g, '_')}.xlsx`);
        
        // Reset button state
        downloadExcelBtn.innerHTML = '<i class="fas fa-download me-2"></i>Export Excel Summary';
        downloadExcelBtn.disabled = false;
    }
});
