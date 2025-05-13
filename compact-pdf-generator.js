// Compact PDF Generator for Financial Tax Planner
document.addEventListener('DOMContentLoaded', function() {
    // Get download button
    const downloadCompactPdfBtn = document.getElementById('downloadCompactPdfBtn');
    
    // Add event listener to download button
    if (downloadCompactPdfBtn) {
        downloadCompactPdfBtn.addEventListener('click', generateCompactPDF);
    }
    
    // Function to generate compact PDF
    function generateCompactPDF() {
        // Show loading
        if (!downloadCompactPdfBtn) return;
        downloadCompactPdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating Compact PDF...';
        downloadCompactPdfBtn.disabled = true;
        
        // Get form data
        const name = document.getElementById('fullName').value || 'User';
        const mobile = document.getElementById('mobileNumber').value || '';
        const email = document.getElementById('emailAddress').value || '';
        
        // Tax calculation data
        const totalIncome = parseFloat(document.getElementById('totalIncome').value) || 0;
        const section80C = parseFloat(document.getElementById('section80C').value) || 0;
        const section80D = parseFloat(document.getElementById('section80D').value) || 0;
        const homeLoanInterest = parseFloat(document.getElementById('homeLoanInterest').value) || 0;
        
        // Standard deductions for both regimes
        const stdDeductionOld = 50000; // For old regime
        const stdDeductionNew = 75000; // For new regime
        
        // Calculate deductions for old regime
        const totalDeductions = section80C + section80D + homeLoanInterest + stdDeductionOld;
        const taxableIncomeOldRegime = Math.max(totalIncome - totalDeductions, 0);
        
        // Calculate old regime tax
        const oldRegimeTax = calculateOldRegimeTax(taxableIncomeOldRegime);
        
        // Calculate new regime tax (standard deduction but no other deductions)
        const taxableIncomeNewRegime = Math.max(totalIncome - stdDeductionNew, 0);
        const newRegimeTax = calculateNewRegimeTax(taxableIncomeNewRegime);
        
        // Determine which regime is better
        let betterRegime = "Equal";
        let taxSavings = 0;
        if (oldRegimeTax < newRegimeTax) {
            betterRegime = "Old";
            taxSavings = newRegimeTax - oldRegimeTax;
        } else if (newRegimeTax < oldRegimeTax) {
            betterRegime = "New";
            taxSavings = oldRegimeTax - newRegimeTax;
        }
        
        // Get today's date for the report
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        // Calculate 10% of monthly income (subject to minimum of 10,000)
        const monthlyIncome = totalIncome / 12;
        const tenPercentMonthly = monthlyIncome * 0.1;
        const investmentAmount = Math.max(Math.min(oldRegimeTax, 10000), tenPercentMonthly, 10000);
        
        // Create a new jsPDF instance - single page, landscape orientation
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });
        
        // Add content to the PDF - optimized for one page
        // Page title
        pdf.setFontSize(20);
        pdf.setFont("helvetica", "bold");
        pdf.text("Financial Tax & Investment Plan - FY 2025-26", 150, 10, { align: "center" });
        
        // Date and personal info in a small section
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Generated on: ${dateStr} | Name: ${name} | Mobile: ${mobile} | Email: ${email}`, 150, 16, { align: "center" });
        
        // Draw border line
        pdf.setDrawColor(200, 200, 200);
        pdf.line(10, 18, 285, 18);
        
        // Left column - Tax information
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Tax Regime Comparison", 20, 25);
        
        // Tax comparison table
        pdf.setFontSize(9);
        pdf.setDrawColor(150, 150, 150);
        pdf.setFillColor(240, 240, 240);
        
        // Table headers
        pdf.setFont("helvetica", "bold");
        pdf.rect(15, 28, 130, 7, 'F');
        pdf.text("Category", 18, 33);
        pdf.text("Old Regime", 90, 33, { align: "right" });
        pdf.text("New Regime", 140, 33, { align: "right" });
        
        // Table data
        pdf.setFont("helvetica", "normal");
        pdf.text("Total Income (₹)", 18, 40);
        pdf.text(Math.round(totalIncome).toLocaleString('en-IN'), 90, 40, { align: "right" });
        pdf.text(Math.round(totalIncome).toLocaleString('en-IN'), 140, 40, { align: "right" });
        
        pdf.text("Standard Deduction (₹)", 18, 46);
        pdf.text(stdDeductionOld.toLocaleString('en-IN'), 90, 46, { align: "right" });
        pdf.text(stdDeductionNew.toLocaleString('en-IN'), 140, 46, { align: "right" });
        
        pdf.text("Section 80C Investments (₹)", 18, 52);
        pdf.text(section80C.toLocaleString('en-IN'), 90, 52, { align: "right" });
        pdf.text("Not Applicable", 140, 52, { align: "right" });
        
        pdf.text("Section 80D Health Insurance (₹)", 18, 58);
        pdf.text(section80D.toLocaleString('en-IN'), 90, 58, { align: "right" });
        pdf.text("Not Applicable", 140, 58, { align: "right" });
        
        pdf.text("Home Loan Interest (₹)", 18, 64);
        pdf.text(homeLoanInterest.toLocaleString('en-IN'), 90, 64, { align: "right" });
        pdf.text("Not Applicable", 140, 64, { align: "right" });
        
        pdf.text("Taxable Income (₹)", 18, 70);
        pdf.text(Math.round(taxableIncomeOldRegime).toLocaleString('en-IN'), 90, 70, { align: "right" });
        pdf.text(Math.round(taxableIncomeNewRegime).toLocaleString('en-IN'), 140, 70, { align: "right" });
        
        pdf.text("Tax Amount (₹)", 18, 76);
        pdf.text(Math.round(oldRegimeTax).toLocaleString('en-IN'), 90, 76, { align: "right" });
        pdf.text(Math.round(newRegimeTax).toLocaleString('en-IN'), 140, 76, { align: "right" });
        
        // Draw border line for the tax section
        pdf.line(15, 80, 145, 80);
        
        // Recommendation
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        if (betterRegime === "Old") {
            pdf.text(`Recommendation: Choose Old Tax Regime and save ₹${Math.round(taxSavings).toLocaleString('en-IN')}`, 80, 87, { align: "center" });
        } else if (betterRegime === "New") {
            pdf.text(`Recommendation: Choose New Tax Regime and save ₹${Math.round(taxSavings).toLocaleString('en-IN')}`, 80, 87, { align: "center" });
        } else {
            pdf.text("Both tax regimes result in the same tax amount.", 80, 87, { align: "center" });
        }
        
        // Investment Calculation
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Investment Recommendation", 80, 95, { align: "center" });
        
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.text("Based on higher of tax amount or 10% monthly income (min ₹10,000):", 80, 100, { align: "center" });
        pdf.text(`Recommended Monthly Investment: ₹${Math.round(investmentAmount).toLocaleString('en-IN')}`, 80, 105, { align: "center" });
        
        // Investment Growth Section
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Investment Growth Projection (15% Annual Return)", 80, 115, { align: "center" });
        
        // Set up investment scenario
        const annualInvestment = investmentAmount * 12;
        const yearlyInterestRate = 0.15;
        const initialPeriod = 5;
        const withdrawalPeriod = 10;
        
        // Calculate future value after initial period
        let futureValue = 0;
        for (let i = 0; i < initialPeriod; i++) {
            futureValue = (futureValue + annualInvestment) * (1 + yearlyInterestRate);
        }
        
        // Calculate monthly withdrawal that allows continued growth
        const monthlyWithdrawal = Math.round(futureValue * 0.005);
        
        // Calculate final value after withdrawal period
        let finalValue = futureValue;
        for (let i = 0; i < withdrawalPeriod; i++) {
            finalValue = (finalValue - (monthlyWithdrawal * 12)) * (1 + yearlyInterestRate);
        }
        
        // Create a compact visual timeline
        pdf.setFontSize(9);
        pdf.setDrawColor(100, 100, 100);
        
        // Draw timeline
        pdf.setLineWidth(0.5);
        pdf.line(20, 125, 140, 125);
        
        // Timeline points
        const timelinePoints = [
            { x: 20, y: 125, label: "Year 1", subtext: "Start Investing" },
            { x: 50, y: 125, label: "Year 5", subtext: "Investment Value:" },
            { x: 80, y: 125, label: "Years 6-15", subtext: "Monthly Withdrawals:" },
            { x: 140, y: 125, label: "Year 16", subtext: "Final Value:" }
        ];
        
        // Draw points and labels
        timelinePoints.forEach(point => {
            // Draw point
            pdf.circle(point.x, point.y, 1.5, 'F');
            
            // Draw label
            pdf.setFont("helvetica", "bold");
            pdf.text(point.label, point.x, point.y - 5, { align: "center" });
            
            // Draw subtext
            pdf.setFont("helvetica", "normal");
            pdf.text(point.subtext, point.x, point.y + 8, { align: "center" });
        });
        
        // Add values
        pdf.setFont("helvetica", "bold");
        pdf.text(`₹${Math.round(investmentAmount).toLocaleString('en-IN')}/month`, 20, 125 + 16, { align: "center" });
        pdf.text(`₹${Math.round(futureValue).toLocaleString('en-IN')}`, 50, 125 + 16, { align: "center" });
        pdf.text(`₹${monthlyWithdrawal.toLocaleString('en-IN')}/month`, 80, 125 + 16, { align: "center" });
        pdf.text(`₹${Math.round(finalValue).toLocaleString('en-IN')}`, 140, 125 + 16, { align: "center" });
        
        // Right side - Investment Options
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Recommended Investment Options", 220, 25, { align: "center" });
        
        // Investment Options Table
        pdf.setFontSize(9);
        pdf.setDrawColor(150, 150, 150);
        pdf.setFillColor(240, 240, 240);
        
        // Table headers
        pdf.rect(155, 28, 130, 7, 'F');
        pdf.setFont("helvetica", "bold");
        pdf.text("Investment Type", 158, 33);
        pdf.text("Tax Benefit", 210, 33);
        pdf.text("Recommended Allocation", 258, 33, { align: "right" });
        
        // Investment options
        const investmentOptions = [
            { type: "ELSS Mutual Funds", benefit: "Sec 80C (₹1.5L limit)", allocation: "25%" },
            { type: "PPF (Public Provident Fund)", benefit: "Sec 80C", allocation: "20%" },
            { type: "NPS Tier-1 Account", benefit: "Sec 80CCD(1B) - Extra ₹50K", allocation: "15%" },
            { type: "Health Insurance", benefit: "Sec 80D (₹25K/₹50K)", allocation: "10%" },
            { type: "ULIP (Insurance + Investment)", benefit: "Sec 80C", allocation: "15%" },
            { type: "Equity Mutual Funds", benefit: "LTCG taxed at 10% > ₹1L", allocation: "10%" },
            { type: "SGB (Sovereign Gold Bonds)", benefit: "No tax on maturity", allocation: "5%" }
        ];
        
        // Draw investment options
        let yPos = 40;
        investmentOptions.forEach(option => {
            pdf.setFont("helvetica", "normal");
            pdf.text(option.type, 158, yPos);
            pdf.text(option.benefit, 210, yPos);
            pdf.text(option.allocation, 258, yPos, { align: "right" });
            yPos += 6;
        });
        
        // Draw border line
        pdf.line(155, 80, 285, 80);
        
        // Market Performance Section
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("10-Year Market Performance", 220, 90, { align: "center" });
        
        // Simplified market data (mock data for 10 years)
        const nifty50Data = [
            { year: "2015", value: 8550 },
            { year: "2016", value: 8636 },
            { year: "2017", value: 9918 },
            { year: "2018", value: 10760 },
            { year: "2019", value: 12168 },
            { year: "2020", value: 13982 },
            { year: "2021", value: 17132 },
            { year: "2022", value: 17894 },
            { year: "2023", value: 19425 },
            { year: "2024", value: 21840 },
            { year: "2025", value: 23500 }
        ];
        
        const sensexData = [
            { year: "2015", value: 28044 },
            { year: "2016", value: 27957 },
            { year: "2017", value: 34057 },
            { year: "2018", value: 36068 },
            { year: "2019", value: 41254 },
            { year: "2020", value: 47751 },
            { year: "2021", value: 59307 },
            { year: "2022", value: 60841 },
            { year: "2023", value: 65568 },
            { year: "2024", value: 71605 },
            { year: "2025", value: 76200 }
        ];
        
        // Draw mini chart for market performance (simplified)
        // X-axis
        pdf.setLineWidth(0.2);
        pdf.line(158, 145, 280, 145);
        
        // Y-axis
        pdf.line(158, 95, 158, 145);
        
        // Draw NIFTY 50 line (in blue)
        pdf.setDrawColor(0, 0, 255);
        for (let i = 0; i < nifty50Data.length - 1; i++) {
            const x1 = 158 + (i * 12);
            const y1 = 145 - ((nifty50Data[i].value / 24000) * 50);
            const x2 = 158 + ((i + 1) * 12);
            const y2 = 145 - ((nifty50Data[i + 1].value / 24000) * 50);
            pdf.line(x1, y1, x2, y2);
        }
        
        // Draw SENSEX line (in red)
        pdf.setDrawColor(255, 0, 0);
        for (let i = 0; i < sensexData.length - 1; i++) {
            const x1 = 158 + (i * 12);
            const y1 = 145 - ((sensexData[i].value / 80000) * 50);
            const x2 = 158 + ((i + 1) * 12);
            const y2 = 145 - ((sensexData[i + 1].value / 80000) * 50);
            pdf.line(x1, y1, x2, y2);
        }
        
        // Draw legend
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        pdf.setDrawColor(0, 0, 255);
        pdf.line(160, 155, 170, 155);
        pdf.text("NIFTY 50", 175, 155);
        
        pdf.setDrawColor(255, 0, 0);
        pdf.line(200, 155, 210, 155);
        pdf.text("SENSEX", 215, 155);
        
        // Draw years (x-axis labels)
        pdf.setDrawColor(100, 100, 100);
        pdf.setFontSize(7);
        for (let i = 0; i < nifty50Data.length; i += 2) {
            const x = 158 + (i * 12);
            pdf.text(nifty50Data[i].year, x, 152);
        }
        
        // Footer with disclaimer
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "italic");
        pdf.text("Disclaimer: This report is for informational purposes only and does not constitute financial advice. Past performance is not indicative of future results.", 150, 190, { align: "center" });
        pdf.text("Consult a qualified financial advisor before making investment decisions. All projections are hypothetical and based on assumed rates of return.", 150, 195, { align: "center" });
        
        // Save the PDF
        pdf.save(`Tax_Planning_Compact_${name.replace(/\\s+/g, '_')}.pdf`);
        
        // Reset button
        if (downloadCompactPdfBtn) {
            downloadCompactPdfBtn.innerHTML = '<i class="fas fa-download me-2"></i>Download One-Page Report';
            downloadCompactPdfBtn.disabled = false;
        }
    }
    
    // Calculate tax for old regime (FY 2025-26)
    function calculateOldRegimeTax(taxableIncome) {
        let tax = 0;
        
        if (taxableIncome <= 250000) {
            tax = 0;
        } else if (taxableIncome <= 500000) {
            tax = (taxableIncome - 250000) * 0.05;
        } else if (taxableIncome <= 1000000) {
            tax = 12500 + (taxableIncome - 500000) * 0.2;
        } else {
            tax = 112500 + (taxableIncome - 1000000) * 0.3;
        }
        
        // Apply Section 87A rebate (up to 5 lakh)
        if (taxableIncome <= 500000) {
            tax = Math.max(0, tax - 12500);
        }
        
        // Education Cess (4%)
        tax += tax * 0.04;
        
        return Math.round(tax);
    }
    
    // Calculate tax for new regime (FY 2025-26)
    function calculateNewRegimeTax(taxableIncome) {
        let tax = 0;
        
        if (taxableIncome <= 400000) {
            tax = 0;
        } else if (taxableIncome <= 800000) {
            tax = (taxableIncome - 400000) * 0.05;
        } else if (taxableIncome <= 1200000) {
            tax = 20000 + (taxableIncome - 800000) * 0.1;
        } else if (taxableIncome <= 1600000) {
            tax = 60000 + (taxableIncome - 1200000) * 0.15;
        } else if (taxableIncome <= 2000000) {
            tax = 120000 + (taxableIncome - 1600000) * 0.2;
        } else if (taxableIncome <= 2400000) {
            tax = 200000 + (taxableIncome - 2000000) * 0.25;
        } else {
            tax = 300000 + (taxableIncome - 2400000) * 0.3;
        }
        
        // Apply Section 87A rebate (up to 12 lakh)
        if (taxableIncome <= 1200000) {
            tax = Math.max(0, tax - 60000);
        }
        
        // Education Cess (4%)
        tax += tax * 0.04;
        
        return Math.round(tax);
    }
});