// Tax Calculator for Financial Tax Planner
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const calculateTaxBtn = document.getElementById('calculateTaxBtn');
    const taxComparisonResult = document.getElementById('taxComparisonResult');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const downloadExcelBtn = document.getElementById('downloadExcelBtn');
    const personalizedAdvice = document.getElementById('personalized-advice');
    
    // Add event listener to calculate button
    if (calculateTaxBtn) {
        calculateTaxBtn.addEventListener('click', calculateTaxRegimes);
    }
    
    // Tax calculation function
    function calculateTaxRegimes() {
        // Get form values
        const totalIncome = parseFloat(document.getElementById('totalIncome').value) || 0;
        const section80C = Math.min(parseFloat(document.getElementById('section80C').value) || 0, 150000);
        const section80D = Math.min(parseFloat(document.getElementById('section80D').value) || 0, 75000);
        const homeLoanInterest = Math.min(parseFloat(document.getElementById('homeLoanInterest').value) || 0, 200000);
        
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
        
        // Update results
        document.getElementById('oldRegimeTotalIncome').textContent = formatCurrency(totalIncome);
        document.getElementById('oldRegimeTotalDeductions').textContent = formatCurrency(totalDeductions);
        document.getElementById('oldRegimeTaxableIncome').textContent = formatCurrency(taxableIncomeOldRegime);
        document.getElementById('oldRegimeTaxAmount').textContent = formatCurrency(oldRegimeTax);
        
        document.getElementById('newRegimeTotalIncome').textContent = formatCurrency(totalIncome);
        document.getElementById('newRegimeTotalDeductions').textContent = formatCurrency(stdDeductionNew);
        document.getElementById('newRegimeTaxableIncome').textContent = formatCurrency(taxableIncomeNewRegime);
        document.getElementById('newRegimeTaxAmount').textContent = formatCurrency(newRegimeTax);
        
        // Show recommendation
        const recommendation = document.getElementById('taxRecommendation');
        if (oldRegimeTax < newRegimeTax) {
            recommendation.innerHTML = `<strong>Old Tax Regime</strong> is better for you. You'll save <strong>${formatCurrency(newRegimeTax - oldRegimeTax)}</strong> in taxes with this option.`;
            
            // Show personalized advice for old regime
            generateOldRegimeAdvice(section80C, section80D, homeLoanInterest);
        } else if (newRegimeTax < oldRegimeTax) {
            recommendation.innerHTML = `<strong>New Tax Regime</strong> is better for you. You'll save <strong>${formatCurrency(oldRegimeTax - newRegimeTax)}</strong> in taxes with this option.`;
            
            // Show personalized advice for new regime
            generateNewRegimeAdvice();
        } else {
            recommendation.innerHTML = `Both tax regimes result in the same tax amount of <strong>${formatCurrency(oldRegimeTax)}</strong>. You can choose either option.`;
            
            // Show general advice
            generateGeneralAdvice();
        }
        
        // Show result section and enable export buttons
        taxComparisonResult.style.display = 'block';
        downloadPdfBtn.disabled = false;
        downloadExcelBtn.disabled = false;
        
        // Enable compact PDF button if it exists
        const downloadCompactPdfBtn = document.getElementById('downloadCompactPdfBtn');
        if (downloadCompactPdfBtn) {
            downloadCompactPdfBtn.disabled = false;
        }
        
        personalizedAdvice.classList.remove('d-none');
        
        // Scroll to results
        taxComparisonResult.scrollIntoView({behavior: 'smooth'});
    }
    
    // Calculate tax for old regime (FY 2025-26)
    function calculateOldRegimeTax(taxableIncome) {
        let tax = 0;
        
        // Standard deduction of 50,000 is applied before this function is called
        // as part of totalDeductions in the calculateTaxRegimes function
        
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
        
        // Standard deduction is already applied in the calling function
        
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
    
    // Generate personalized advice for old regime
    function generateOldRegimeAdvice(section80C, section80D, homeLoanInterest) {
        let adviceHTML = '<ul>';
        
        // Section 80C advice
        if (section80C < 150000) {
            adviceHTML += `<li>You can invest up to <strong>${formatCurrency(150000 - section80C)}</strong> more in Section 80C instruments like ELSS, PPF, or Tax-saving FDs.</li>`;
        } else {
            adviceHTML += `<li>Great! You've maximized your Section 80C deduction limit of <strong>${formatCurrency(150000)}</strong>.</li>`;
        }
        
        // Section 80D advice
        if (section80D < 25000) {
            adviceHTML += `<li>Consider investing in health insurance premiums to utilize Section 80D benefits. You can claim up to <strong>${formatCurrency(25000 - section80D)}</strong> more.</li>`;
        } else if (section80D >= 25000 && section80D < 75000) {
            adviceHTML += `<li>You've utilized the basic health insurance deduction. If you have senior citizen parents, you can claim an additional amount up to <strong>${formatCurrency(75000 - section80D)}</strong>.</li>`;
        } else {
            adviceHTML += `<li>You've maximized your Section 80D health insurance premium benefits.</li>`;
        }
        
        // Home Loan interest advice
        if (homeLoanInterest < 200000 && homeLoanInterest > 0) {
            adviceHTML += `<li>You have utilized <strong>${formatCurrency(homeLoanInterest)}</strong> of the maximum <strong>${formatCurrency(200000)}</strong> home loan interest deduction.</li>`;
        } else if (homeLoanInterest >= 200000) {
            adviceHTML += `<li>You've maximized your home loan interest deduction under Section 24B.</li>`;
        }
        
        adviceHTML += '</ul>';
        
        // Additional advice for ELSS
        adviceHTML += '<p class="mt-3">Consider these specific tax-saving investment options:</p>';
        adviceHTML += '<ul>';
        adviceHTML += '<li><strong>ELSS Mutual Funds:</strong> Shortest lock-in period (3 years) with potential for high returns</li>';
        adviceHTML += '<li><strong>PPF:</strong> Safe government-backed investment with tax-free interest</li>';
        adviceHTML += '<li><strong>NPS:</strong> Additional ₹50,000 deduction under Section 80CCD(1B) beyond 80C limit</li>';
        adviceHTML += '</ul>';
        
        document.getElementById('advice-content').innerHTML = adviceHTML;
    }
    
    // Generate personalized advice for new regime
    function generateNewRegimeAdvice() {
        let adviceHTML = '<p>Under the New Tax Regime, you cannot claim tax deductions but benefit from lower tax rates. Here are some investment strategies to consider:</p>';
        adviceHTML += '<ul>';
        adviceHTML += '<li>Focus on investments that offer better returns rather than tax benefits. Consider equity mutual funds for long-term growth.</li>';
        adviceHTML += '<li>Even though you can\'t claim tax benefits, still maintain adequate health insurance coverage for financial protection.</li>';
        adviceHTML += '<li>Consider investments like:</li>';
        adviceHTML += '<ul>';
        adviceHTML += '<li><strong>Index Funds:</strong> Low-cost funds that track market indices</li>';
        adviceHTML += '<li><strong>Liquid Funds:</strong> For parking short-term money with better returns than savings accounts</li>';
        adviceHTML += '<li><strong>Corporate FDs:</strong> For fixed income with potentially higher returns than bank FDs</li>';
        adviceHTML += '</ul>';
        adviceHTML += '</ul>';
        
        document.getElementById('advice-content').innerHTML = adviceHTML;
    }
    
    // Generate general advice
    function generateGeneralAdvice() {
        let adviceHTML = '<p>Both tax regimes offer the same tax impact for you. Here are some general investment suggestions:</p>';
        adviceHTML += '<ul>';
        adviceHTML += '<li>Create a balanced portfolio with a mix of tax-saving and high-return investments.</li>';
        adviceHTML += '<li>Ensure adequate health and life insurance coverage for financial security.</li>';
        adviceHTML += '<li>Consider starting or increasing SIP investments in mutual funds for long-term wealth creation.</li>';
        adviceHTML += '<li>If you haven\'t already, start an emergency fund that covers 6 months of expenses.</li>';
        adviceHTML += '</ul>';
        
        document.getElementById('advice-content').innerHTML = adviceHTML;
    }
    
    // Format currency
    function formatCurrency(amount) {
        return '₹' + amount.toLocaleString('en-IN', {
            maximumFractionDigits: 0
        });
    }
});
