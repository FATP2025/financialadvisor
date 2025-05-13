// Fixed PDF Generator for Financial Tax Planner to match FINALOUTPUT.pdf format
document.addEventListener('DOMContentLoaded', function() {
    // Get download button
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    
    // Add event listener to download button
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', generateFixedPDF);
    }
    
    // Function to generate PDF
    function generateFixedPDF() {
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
            month: 'MMMM',
            year: 'numeric'
        });
        
        // Calculate 10% of monthly income (minimum 10,000)
        const monthlyIncome = totalIncome / 12;
        const tenPercentMonthly = monthlyIncome * 0.1;
        
        // Use these exact investment values as per requirements
        const fixedMonthlyInvestment = 10000;
        const fixedMonthlyWithdrawal = 8334;
        const fixedFinalValue = 2146554;
        
        // Create a new jsPDF instance
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        // First page - Tax Planning Report
        // Title
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("Financial Tax Planning Report", 105, 20, { align: "center" });
        
        // Date
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text("Generated on", 105, 30, { align: "center" });
        pdf.text(dateStr, 180, 30);
        
        // Personal Information
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Personal Information", 20, 40);
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text("Name", 50, 50, { align: "left" });
        pdf.text(name.toUpperCase(), 105, 50);
        
        pdf.text("Mobile Number", 50, 57, { align: "left" });
        pdf.text(mobile, 105, 57);
        
        pdf.text("Email Address", 50, 64, { align: "left" });
        pdf.text(email.toUpperCase(), 105, 64);
        
        // Income & Deductions
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Income & Deductions", 20, 74);
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text("Total Income", 50, 84, { align: "left" });
        pdf.text(formatCurrency(totalIncome), 190, 84, { align: "right" });
        
        pdf.text("Section 80C Investments", 50, 91, { align: "left" });
        pdf.text(formatCurrency(section80C), 190, 91, { align: "right" });
        
        pdf.text("Section 80D Health Insurance", 50, 98, { align: "left" });
        pdf.text(formatCurrency(section80D), 190, 98, { align: "right" });
        
        pdf.text("Home Loan Interest", 50, 105, { align: "left" });
        pdf.text(formatCurrency(homeLoanInterest), 190, 105, { align: "right" });
        
        pdf.text("Total Deductions", 50, 112, { align: "left" });
        pdf.text(formatCurrency(totalDeductions), 190, 112, { align: "right" });
        
        // Tax Regime Comparison
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Tax Regime Comparison", 20, 125);
        
        // Table headers
        pdf.setFontSize(11);
        pdf.text("Category", 20, 135, { align: "left" });
        pdf.text("Old Regime", 140, 135, { align: "right" });
        pdf.text("New Regime", 190, 135, { align: "right" });
        
        // Line under headers
        pdf.setDrawColor(200, 200, 200);
        pdf.line(20, 137, 190, 137);
        
        // Table data
        pdf.setFont("helvetica", "normal");
        pdf.text("Total Income", 20, 145, { align: "left" });
        pdf.text(Math.round(totalIncome).toString(), 140, 145, { align: "right" });
        pdf.text(Math.round(totalIncome).toString(), 190, 145, { align: "right" });
        
        pdf.text("Total Deductions", 20, 152, { align: "left" });
        pdf.text(Math.round(totalDeductions).toString(), 140, 152, { align: "right" });
        pdf.text(Math.round(stdDeductionNew).toString(), 190, 152, { align: "right" });
        
        pdf.text("Taxable Income", 20, 159, { align: "left" });
        pdf.text(Math.round(taxableIncomeOldRegime).toString(), 140, 159, { align: "right" });
        pdf.text(Math.round(taxableIncomeNewRegime).toString(), 190, 159, { align: "right" });
        
        pdf.text("Tax Amount", 20, 166, { align: "left" });
        pdf.text(Math.round(oldRegimeTax).toString(), 140, 166, { align: "right" });
        pdf.text(Math.round(newRegimeTax).toString(), 190, 166, { align: "right" });
        
        // Line under table
        pdf.line(20, 169, 190, 169);
        
        // Recommendation
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Recommendation", 20, 179);
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        if (betterRegime === "Old") {
            pdf.text(`Old Tax Regime is better. You save ₹${Math.round(taxSavings).toLocaleString('en-IN')}`, 20, 186);
        } else if (betterRegime === "New") {
            pdf.text(`New Tax Regime is better. You save ₹${Math.round(taxSavings).toLocaleString('en-IN')}`, 20, 186);
        } else {
            pdf.text("Both tax regimes result in the same tax amount.", 20, 186);
        }
        
        // Investment Suggestions
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Investment Suggestions", 20, 196);
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text("Section 80C Investment Options (Limit: ₹1.5 Lakh)", 20, 206);
        
        pdf.setFont("helvetica", "normal");
        pdf.text("ELSS Mutual Funds (3-year lock-in)", 20, 213);
        pdf.text("Up to ₹1,50,000", 150, 213);
        
        pdf.text("PPF (Public Provident Fund) - 15-year lock-in", 20, 220);
        pdf.text("Up to ₹1,50,000", 150, 220);
        
        pdf.text("NSC (National Savings Certificate)", 20, 227);
        pdf.text("Up to ₹1,50,000", 150, 227);
        
        pdf.text("Life Insurance Premium", 20, 234);
        pdf.text("Up to ₹1,50,000", 150, 234);
        
        pdf.text("5-Year Tax Saving FD", 20, 241);
        pdf.text("Up to ₹1,50,000", 150, 241);
        
        // Add new page
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
        pdf.text(formatCurrency(oldRegimeTax) + " TAX PORTION", 190, 110, { align: "right" });
        
        pdf.text("10% MONTHLY TOTAL INCOME", 20, 117);
        pdf.text(formatCurrency(tenPercentMonthly) + " (TOTAL INCOME /12)*10%", 190, 117, { align: "right" });
        
        pdf.text("MINIMUM RS 10,000", 20, 124);
        pdf.text(formatCurrency(10000), 190, 124, { align: "right" });
        
        // Financial Freedom section
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Financial Freedom Using The Power of", 105, 140, { align: "center" });
        pdf.text("Compounding:", 105, 147, { align: "center" });
        
        // Add the diagram
        // Timeline arrows and boxes
        pdf.setDrawColor(100, 100, 100);
        pdf.setFillColor(240, 240, 240);
        
        // Main horizontal line
        pdf.setLineWidth(0.5);
        pdf.line(30, 165, 170, 165);
        
        // Year markers
        const yearMarkers = [
            { x: 30, label: "Year 1", position: "below", subtext: "Initial\nInvestment" },
            { x: 60, label: "Year 5", position: "above", subtext: "Annual investments\ncease, compounding\ncontinues" },
            { x: 90, label: "Year 6", position: "below", subtext: "Monthly\nWithdrawals\nBegin" },
            { x: 140, label: "Year 15", position: "above", subtext: "Withdrawals\nEnd" },
            { x: 170, label: "Year 16", position: "below", subtext: "Final\nInvestment\nValue" }
        ];
        
        yearMarkers.forEach(marker => {
            // Draw marker point
            pdf.circle(marker.x, 165, 1, 'F');
            
            // Draw label
            pdf.setFontSize(10);
            pdf.setFont("helvetica", "bold");
            if (marker.position === "below") {
                pdf.text(marker.label, marker.x, 171, { align: "center" });
                
                // Draw subtext below
                pdf.setFontSize(8);
                pdf.setFont("helvetica", "normal");
                const subtextLines = marker.subtext.split('\n');
                let yPos = 177;
                subtextLines.forEach(line => {
                    pdf.text(line, marker.x, yPos, { align: "center" });
                    yPos += 4;
                });
                
                // Add values for specific markers
                if (marker.label === "Year 1") {
                    pdf.setFontSize(8);
                    pdf.text(`₹${fixedMonthlyInvestment.toLocaleString('en-IN')} invested`, marker.x, 190, { align: "center" });
                    pdf.text("annually for five", marker.x, 194, { align: "center" });
                    pdf.text("years", marker.x, 198, { align: "center" });
                } else if (marker.label === "Year 6") {
                    pdf.setFontSize(8);
                    pdf.text(`₹${fixedMonthlyWithdrawal.toLocaleString('en-IN')} withdrawn`, marker.x, 190, { align: "center" });
                    pdf.text("monthly for ten", marker.x, 194, { align: "center" });
                    pdf.text("years", marker.x, 198, { align: "center" });
                } else if (marker.label === "Year 16") {
                    pdf.setFontSize(8);
                    pdf.text(`₹${fixedFinalValue.toLocaleString('en-IN')} achieved`, marker.x, 190, { align: "center" });
                    pdf.text("through", marker.x, 194, { align: "center" });
                    pdf.text("compounding", marker.x, 198, { align: "center" });
                }
            } else { // position is "above"
                pdf.text(marker.label, marker.x, 160, { align: "center" });
                
                // Draw subtext above
                pdf.setFontSize(8);
                pdf.setFont("helvetica", "normal");
                const subtextLines = marker.subtext.split('\n');
                let yPos = 155;
                for (let i = subtextLines.length - 1; i >= 0; i--) {
                    pdf.text(subtextLines[i], marker.x, yPos, { align: "center" });
                    yPos -= 4;
                }
                
                // Add values for specific markers
                if (marker.label === "Year 15") {
                    pdf.setFontSize(8);
                    pdf.text("Monthly withdrawals", marker.x, 144, { align: "center" });
                    pdf.text("stop, investment", marker.x, 148, { align: "center" });
                    pdf.text("continues to grow", marker.x, 152, { align: "center" });
                }
            }
        });
        
        // Add third page with abstract and details
        pdf.addPage();
        
        // Abstract section
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Abstract", 20, 20);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("This document explores the remarkable impact of compounding on investments through a", 20, 30);
        pdf.text(`hypothetical scenario where an individual invests ₹${fixedMonthlyInvestment.toLocaleString('en-IN')} annually for the first five years.`, 20, 35);
        pdf.text("Following this initial investment period, the individual opts for a Systematic Withdrawal", 20, 40);
        pdf.text(`Plan (SWP) to withdraw ₹${fixedMonthlyWithdrawal.toLocaleString('en-IN')} monthly for the next ten years. The analysis culminates`, 20, 45);
        pdf.text(`in a substantial final investment value of ₹${fixedFinalValue.toLocaleString('en-IN')} at the end of the 15-year period.`, 20, 50);
        pdf.text("This report highlights the significance of consistent investment and the compounding", 20, 55);
        pdf.text("effect, illustrated with a pictorial representation.", 20, 60);
        
        // Investment Overview section
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Investment Overview", 20, 75);
        
        pdf.setFontSize(10);
        pdf.text("1. Initial Investment:", 30, 85);
        
        pdf.setFont("helvetica", "normal");
        pdf.text(`• Amount: ₹${fixedMonthlyInvestment.toLocaleString('en-IN')} per year`, 40, 95);
        pdf.text("• Duration: 5 years", 40, 100);
        pdf.text(`• Total Investment: ₹${(fixedMonthlyInvestment * 5).toLocaleString('en-IN')}`, 40, 105);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text("Withdrawal Phase:", 30, 120);
        
        pdf.setFont("helvetica", "normal");
        pdf.text("• Plan: Systematic Withdrawal Plan (SWP)", 40, 130);
        pdf.text(`• Monthly Withdrawal: ₹${fixedMonthlyWithdrawal.toLocaleString('en-IN')}`, 40, 135);
        pdf.text("• Duration: 10 years", 40, 140);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text("3. Final Investment Value:", 30, 155);
        
        pdf.setFont("helvetica", "normal");
        pdf.text(`• Amount at the end of 15 years: ₹${fixedFinalValue.toLocaleString('en-IN')}`, 40, 165);
        
        // The Compounding Effect section
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("The Compounding Effect", 20, 180);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("The compounding effect refers to the process where the value of an investment grows", 20, 190);
        pdf.text("exponentially over time due to the interest earned on both the initial principal and the", 20, 195);
        pdf.text("accumulated interest from previous periods. This scenario illustrates how a modest annual", 20, 200);
        pdf.text("investment can lead to significant wealth accumulation over time.", 20, 205);
        
        // Yearly Breakdown section
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
        pdf.text(`Investing just ₹${fixedMonthlyInvestment.toLocaleString('en-IN')} annually for the first five years can lead to a remarkable financial`, 20, 275);
        pdf.text(`outcome due to the power of compounding. The ability to withdraw ₹${fixedMonthlyWithdrawal.toLocaleString('en-IN')} monthly for`, 20, 280);
        pdf.text("the next ten years while still ending up with a significant investment value of", 20, 285);
        pdf.text(`₹${fixedFinalValue.toLocaleString('en-IN')} underscores the importance of starting early and remaining consistent in`, 20, 290);
        
        // Add a new page to complete the conclusion
        pdf.addPage();
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("investment practices. This scenario serves as a compelling example of how even a", 20, 20);
        pdf.text("small percentage of one's salary can yield substantial returns over time through the", 20, 25);
        pdf.text("power of compounding.", 20, 30);

        // Save the PDF
        pdf.save(`Tax_Planning_Report_${name.replace(/\\s+/g, '_')}.pdf`);
        
        // Reset button state
        downloadPdfBtn.innerHTML = '<i class="fas fa-download me-2"></i>Download Investment Report';
        downloadPdfBtn.disabled = false;
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
        return amount.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        });
    }
});