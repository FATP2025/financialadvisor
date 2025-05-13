// Optimized PDF Generator for Financial Tax Planner
document.addEventListener('DOMContentLoaded', function() {
    // Get download button
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    
    // Add event listener to download button
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', generateOptimizedPDF);
    }
    
    // Function to generate PDF
    function generateOptimizedPDF() {
        // Show loading
        downloadPdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating PDF...';
        downloadPdfBtn.disabled = true;
        
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
        
        // Create a new jsPDF instance
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        // First page - Summary
        addFirstPage(pdf, {
            name, 
            mobile, 
            email, 
            dateStr,
            totalIncome,
            section80C,
            section80D,
            homeLoanInterest,
            totalDeductions,
            stdDeductionOld,
            stdDeductionNew,
            taxableIncomeOldRegime,
            taxableIncomeNewRegime,
            oldRegimeTax,
            newRegimeTax,
            betterRegime,
            taxSavings,
            investmentAmount
        });
        
        // Add second page - Investment Compounding
        pdf.addPage();
        addSecondPage(pdf, investmentAmount);
        
        // Save the PDF
        pdf.save(`Tax_Planning_Report_${name.replace(/\\s+/g, '_')}.pdf`);
        
        // Reset button state
        downloadPdfBtn.innerHTML = '<i class="fas fa-download me-2"></i>Download PDF Report';
        downloadPdfBtn.disabled = false;
    }
    
    function addFirstPage(pdf, data) {
        // Set font size and style
        pdf.setFontSize(20);
        pdf.setFont("helvetica", "bold");
        pdf.text("Financial Tax Planning Report", 105, 20, { align: "center" });
        
        // Date
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Generated on ${data.dateStr}`, 105, 30, { align: "center" });
        
        // Personal Information
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Personal Information", 20, 40);
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text("Name", 20, 50);
        pdf.text(data.name, 100, 50);
        
        pdf.text("Mobile Number", 20, 57);
        pdf.text(data.mobile, 100, 57);
        
        pdf.text("Email Address", 20, 64);
        pdf.text(data.email, 100, 64);
        
        // Income & Deductions
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Income & Deductions", 20, 74);
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text("Total Income", 20, 84);
        pdf.text(formatCurrency(data.totalIncome), 160, 84, { align: "right" });
        
        pdf.text("Section 80C Investments", 20, 91);
        pdf.text(formatCurrency(data.section80C), 160, 91, { align: "right" });
        
        pdf.text("Section 80D Health Insurance", 20, 98);
        pdf.text(formatCurrency(data.section80D), 160, 98, { align: "right" });
        
        pdf.text("Home Loan Interest", 20, 105);
        pdf.text(formatCurrency(data.homeLoanInterest), 160, 105, { align: "right" });
        
        pdf.text("Total Deductions", 20, 112);
        pdf.text(formatCurrency(data.totalDeductions), 160, 112, { align: "right" });
        
        // Tax Regime Comparison
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Tax Regime Comparison", 20, 122);
        
        // Table headers
        pdf.setFontSize(11);
        pdf.text("Category", 20, 132);
        pdf.text("Old Regime", 120, 132, { align: "right" });
        pdf.text("New Regime", 180, 132, { align: "right" });
        
        // Table data
        pdf.setFont("helvetica", "normal");
        pdf.text("Total Income", 20, 139);
        pdf.text(Math.round(data.totalIncome).toString(), 120, 139, { align: "right" });
        pdf.text(Math.round(data.totalIncome).toString(), 180, 139, { align: "right" });
        
        pdf.text("Total Deductions", 20, 146);
        pdf.text(Math.round(data.totalDeductions).toString(), 120, 146, { align: "right" });
        pdf.text(Math.round(data.stdDeductionNew).toString(), 180, 146, { align: "right" });
        
        pdf.text("Taxable Income", 20, 153);
        pdf.text(Math.round(data.taxableIncomeOldRegime).toString(), 120, 153, { align: "right" });
        pdf.text(Math.round(data.taxableIncomeNewRegime).toString(), 180, 153, { align: "right" });
        
        pdf.text("Tax Amount", 20, 160);
        pdf.text(Math.round(data.oldRegimeTax).toString(), 120, 160, { align: "right" });
        pdf.text(Math.round(data.newRegimeTax).toString(), 180, 160, { align: "right" });
        
        // Recommendation
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Recommendation", 20, 170);
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        if (data.betterRegime === "Old") {
            pdf.text(`Old Tax Regime is better. You save ₹${Math.round(data.taxSavings).toLocaleString('en-IN')}`, 20, 180);
        } else if (data.betterRegime === "New") {
            pdf.text(`New Tax Regime is better. You save ₹${Math.round(data.taxSavings).toLocaleString('en-IN')}`, 20, 180);
        } else {
            pdf.text("Both tax regimes result in the same tax amount.", 20, 180);
        }
        
        // Investment Calculation
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("INVESTMENT LIMIT", 20, 190);
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text("TAX AMOUNT OR 10% OF MONTHLY SALARY SUBJECTED TO MINIMUM OF 10000 NOT MORE THAN RS 10000", 20, 197);
        pdf.text("TAX AMOUNT", 20, 204);
        pdf.text(formatCurrency(data.oldRegimeTax) + " TAX PORTION", 160, 204, { align: "right" });
        
        pdf.text("10% MONTHLY TOTAL INCOME", 20, 211);
        pdf.text(formatCurrency(data.totalIncome / 12 * 0.1) + " (TOTAL INCOME /12)*10%", 160, 211, { align: "right" });
        
        pdf.text("MINIMUM RS 10,000", 20, 218);
        pdf.text(formatCurrency(10000), 160, 218, { align: "right" });
    }
    
    function addSecondPage(pdf, investmentAmount) {
        // Title
        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        pdf.text("Financial Freedom Using The Power of", 105, 20, { align: "center" });
        pdf.text("Compounding:", 105, 30, { align: "center" });
        
        // Set up the investment scenario
        const annualInvestment = investmentAmount * 12;  // Annual investment for 5 years
        const yearlyInterestRate = 0.15;  // 15% annual interest rate
        const initialPeriod = 5;  // Initial investment period (years)
        const withdrawalPeriod = 10;  // Withdrawal period (years)
        
        // Calculate the future value after initial period
        let futureValue = 0;
        for (let i = 0; i < initialPeriod; i++) {
            futureValue = (futureValue + annualInvestment) * (1 + yearlyInterestRate);
        }
        
        // Calculate monthly withdrawal amount that allows growth
        // We'll use a formula that estimates a sustainable withdrawal amount
        // that allows the principal to continue growing
        const monthlyWithdrawal = Math.round(futureValue * 0.005);  // 0.5% monthly (6% annually)
        
        // Calculate the future value at the end of withdrawal period
        let finalValue = futureValue;
        const totalWithdrawals = monthlyWithdrawal * 12 * withdrawalPeriod;
        
        for (let i = 0; i < withdrawalPeriod; i++) {
            finalValue = (finalValue - (monthlyWithdrawal * 12)) * (1 + yearlyInterestRate);
        }
        
        // Add investment scenario text
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Compounding Investment Scenario", 105, 60, { align: "center" });
        
        // Add scenario details
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text("Year 1", 20, 100);
        pdf.text("Year 5", 50, 110);
        pdf.text("Year 6", 100, 90);
        pdf.text("Year 15", 150, 110);
        pdf.text("Year 16", 180, 90);
        
        pdf.text("Initial", 20, 120);
        pdf.text("Investment", 20, 125);
        
        pdf.text("Annual investments", 50, 90);
        pdf.text("cease, compounding", 50, 95);
        pdf.text("continues", 50, 100);
        
        pdf.text("Monthly", 100, 100);
        pdf.text("Withdrawals", 100, 105);
        pdf.text("Begin", 100, 110);
        
        pdf.text("Withdrawals", 150, 90);
        pdf.text("End", 150, 95);
        
        pdf.text("Final", 180, 120);
        pdf.text("Investment", 180, 125);
        pdf.text("Value", 180, 130);
        
        pdf.text(`₹${Math.round(investmentAmount).toLocaleString('en-IN')} invested`, 20, 140);
        pdf.text("annually for five", 20, 145);
        pdf.text("years", 20, 150);
        
        pdf.text(`₹${monthlyWithdrawal.toLocaleString('en-IN')} withdrawn`, 100, 130);
        pdf.text("monthly for ten", 100, 135);
        pdf.text("years", 100, 140);
        
        pdf.text("Monthly withdrawals", 150, 130);
        pdf.text("stop, investment", 150, 135);
        pdf.text("continues to grow", 150, 140);
        
        pdf.text(`₹${Math.round(finalValue).toLocaleString('en-IN')} achieved`, 180, 150);
        pdf.text("through", 180, 155);
        pdf.text("compounding", 180, 160);
        
        // Add abstract section
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Abstract", 20, 180);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("This document explores the remarkable impact of compounding on investments through a", 20, 190);
        pdf.text(`hypothetical scenario where an individual invests ₹${Math.round(investmentAmount).toLocaleString('en-IN')} annually for the first five years.`, 20, 195);
        pdf.text(`Following this initial investment period, the individual opts for a Systematic Withdrawal`, 20, 200);
        pdf.text(`Plan (SWP) to withdraw ₹${monthlyWithdrawal.toLocaleString('en-IN')} monthly for the next ten years. The analysis culminates`, 20, 205);
        pdf.text(`in a substantial final investment value of ₹${Math.round(finalValue).toLocaleString('en-IN')} at the end of the 15-year period.`, 20, 210);
        pdf.text("This report highlights the significance of consistent investment and the compounding", 20, 215);
        pdf.text("effect, illustrated with a pictorial representation.", 20, 220);
        
        // Add investment overview section
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Investment Overview", 20, 235);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("1. Initial Investment:", 30, 245);
        pdf.text(`• Amount: ₹${Math.round(investmentAmount).toLocaleString('en-IN')} per year`, 40, 250);
        pdf.text("• Duration: 5 years", 40, 255);
        pdf.text(`• Total Investment: ₹${Math.round(annualInvestment * 5).toLocaleString('en-IN')}`, 40, 260);
        
        pdf.text("2. Withdrawal Phase:", 30, 270);
        pdf.text("• Plan: Systematic Withdrawal Plan (SWP)", 40, 275);
        pdf.text(`• Monthly Withdrawal: ₹${monthlyWithdrawal.toLocaleString('en-IN')}`, 40, 280);
        pdf.text("• Duration: 10 years", 40, 285);
        
        // Continue with more content
        pdf.addPage();
        
        pdf.text("3. Final Investment Value:", 30, 20);
        pdf.text(`• Amount at the end of 15 years: ₹${Math.round(finalValue).toLocaleString('en-IN')}`, 40, 25);
        
        // The Compounding Effect
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("The Compounding Effect", 20, 40);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("The compounding effect refers to the process where the value of an investment grows", 20, 50);
        pdf.text("exponentially over time due to the interest earned on both the initial principal and the", 20, 55);
        pdf.text("accumulated interest from previous periods. This scenario illustrates how a modest annual", 20, 60);
        pdf.text("investment can lead to significant wealth accumulation over time.", 20, 65);
        
        // Yearly Breakdown
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Yearly Breakdown of Investment Growth", 20, 80);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("• Years 1-5:", 30, 90);
        pdf.text("• Each ₹10,000 investment grows at a compounded rate.", 40, 95);
        pdf.text("• Years 6-15:", 30, 105);
        pdf.text("• The investment continues to grow even as withdrawals are made.", 40, 110);
        
        // Conclusion
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Conclusion", 20, 130);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Investing just ₹${Math.round(investmentAmount).toLocaleString('en-IN')} annually for the first five years can lead to a remarkable financial`, 20, 140);
        pdf.text(`outcome due to the power of compounding. The ability to withdraw ₹${monthlyWithdrawal.toLocaleString('en-IN')} monthly for`, 20, 145);
        pdf.text(`the next ten years while still ending up with a significant investment value of`, 20, 150);
        pdf.text(`₹${Math.round(finalValue).toLocaleString('en-IN')} underscores the importance of starting early and remaining consistent in`, 20, 155);
        pdf.text("investment practices. This scenario serves as a compelling example of how even a", 20, 160);
        pdf.text("small percentage of one's salary can yield substantial returns over time through the", 20, 165);
        pdf.text("power of compounding.", 20, 170);
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
    
    // Format currency
    function formatCurrency(amount) {
        return '₹' + amount.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        });
    }
});