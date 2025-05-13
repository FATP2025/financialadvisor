// PDF Generator for Financial Tax Planner
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
        const name = document.getElementById('fullName').value;
        const mobile = document.getElementById('mobileNumber').value;
        const email = document.getElementById('emailAddress').value;
        
        // Tax calculation data
        const totalIncome = parseFloat(document.getElementById('totalIncome').value) || 0;
        const section80C = parseFloat(document.getElementById('section80C').value) || 0;
        const section80D = parseFloat(document.getElementById('section80D').value) || 0;
        const homeLoanInterest = parseFloat(document.getElementById('homeLoanInterest').value) || 0;
        
        // Get tax comparison results
        const oldRegimeTax = document.getElementById('oldRegimeTaxAmount').textContent;
        const newRegimeTax = document.getElementById('newRegimeTaxAmount').textContent;
        const recommendation = document.getElementById('taxRecommendation').innerHTML;
        
        // Get today's date for the report
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        // Create PDF content
        const pdfContent = document.getElementById('pdf-content');
        pdfContent.innerHTML = `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #0d6efd; margin-bottom: 5px;">Financial Tax Planning Report</h1>
                    <p style="color: #6c757d;">Generated on ${dateStr}</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #212529; border-bottom: 2px solid #dee2e6; padding-bottom: 10px;">Personal Information</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; width: 30%;"><strong>Name:</strong></td>
                            <td style="padding: 8px;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px;"><strong>Mobile Number:</strong></td>
                            <td style="padding: 8px;">${mobile}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px;"><strong>Email Address:</strong></td>
                            <td style="padding: 8px;">${email}</td>
                        </tr>
                    </table>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #212529; border-bottom: 2px solid #dee2e6; padding-bottom: 10px;">Income & Deductions</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; width: 60%;"><strong>Total Income:</strong></td>
                            <td style="padding: 8px;">₹${totalIncome.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px;"><strong>Section 80C Investments:</strong></td>
                            <td style="padding: 8px;">₹${section80C.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px;"><strong>Section 80D Health Insurance:</strong></td>
                            <td style="padding: 8px;">₹${section80D.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px;"><strong>Home Loan Interest:</strong></td>
                            <td style="padding: 8px;">₹${homeLoanInterest.toLocaleString('en-IN')}</td>
                        </tr>
                    </table>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #212529; border-bottom: 2px solid #dee2e6; padding-bottom: 10px;">Tax Regime Comparison</h2>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <tr style="background-color: #f8f9fa;">
                            <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Category</th>
                            <th style="padding: 12px; text-align: right; border: 1px solid #dee2e6;">Old Regime</th>
                            <th style="padding: 12px; text-align: right; border: 1px solid #dee2e6;">New Regime</th>
                        </tr>
                        <tr>
                            <td style="padding: 12px; border: 1px solid #dee2e6;"><strong>Total Income</strong></td>
                            <td style="padding: 12px; text-align: right; border: 1px solid #dee2e6;">${document.getElementById('oldRegimeTotalIncome').textContent}</td>
                            <td style="padding: 12px; text-align: right; border: 1px solid #dee2e6;">${document.getElementById('newRegimeTotalIncome').textContent}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; border: 1px solid #dee2e6;"><strong>Total Deductions</strong></td>
                            <td style="padding: 12px; text-align: right; border: 1px solid #dee2e6;">${document.getElementById('oldRegimeTotalDeductions').textContent}</td>
                            <td style="padding: 12px; text-align: right; border: 1px solid #dee2e6;">${document.getElementById('newRegimeTotalDeductions').textContent}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; border: 1px solid #dee2e6;"><strong>Taxable Income</strong></td>
                            <td style="padding: 12px; text-align: right; border: 1px solid #dee2e6;">${document.getElementById('oldRegimeTaxableIncome').textContent}</td>
                            <td style="padding: 12px; text-align: right; border: 1px solid #dee2e6;">${document.getElementById('newRegimeTaxableIncome').textContent}</td>
                        </tr>
                        <tr style="background-color: #f8f9fa;">
                            <td style="padding: 12px; border: 1px solid #dee2e6;"><strong>Tax Amount</strong></td>
                            <td style="padding: 12px; text-align: right; border: 1px solid #dee2e6;"><strong>${oldRegimeTax}</strong></td>
                            <td style="padding: 12px; text-align: right; border: 1px solid #dee2e6;"><strong>${newRegimeTax}</strong></td>
                        </tr>
                    </table>
                    
                    <div style="padding: 15px; background-color: #d1e7dd; border-radius: 5px; color: #0a3622;">
                        <h3 style="margin-top: 0; font-size: 18px;">Recommendation</h3>
                        <p>${recommendation}</p>
                    </div>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #212529; border-bottom: 2px solid #dee2e6; padding-bottom: 10px;">Investment Suggestions</h2>
                    <div>${document.getElementById('advice-content').innerHTML}</div>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #212529; border-bottom: 2px solid #dee2e6; padding-bottom: 10px;">Recommended Financial Products</h2>
                    
                    <!-- Tax Saving Options -->
                    <h3 style="font-size: 18px; margin-top: 20px;">Section 80C Investment Options (Limit: ₹1.5 Lakh)</h3>
                    <ul>
                        <li><strong>ELSS Mutual Funds (3-year lock-in)</strong>: Mirae Asset Tax Saver Fund, Axis Long Term Equity Fund</li>
                        <li><strong>PPF (Public Provident Fund)</strong> - 15-year lock-in, current interest rate: 7.1% p.a.</li>
                        <li><strong>NSC (National Savings Certificate)</strong> - 5-year lock-in, current interest rate: 6.8% p.a.</li>
                        <li><strong>Life Insurance Premium</strong> - Term plans recommended for pure protection</li>
                        <li><strong>5-Year Tax Saving FD</strong> - Current rates: 6.0% -.7.0% p.a.</li>
                    </ul>
                    
                    <!-- Health Insurance -->
                    <h3 style="font-size: 18px; margin-top: 20px;">Health Insurance Recommendations</h3>
                    <p>Based on your profile, we recommend a comprehensive health insurance policy with:</p>
                    <ul>
                        <li>Coverage: At least ₹5 Lakhs for self and family</li>
                        <li>Features to look for: No room rent capping, Pre-existing disease coverage after waiting period</li>
                        <li>Top rated policies: Star Comprehensive, HDFC ERGO Health Suraksha, Bajaj Allianz Health Guard</li>
                    </ul>
                    
                    <!-- SIP Investment -->
                    <h3 style="font-size: 18px; margin-top: 20px;">SIP Investment Strategy</h3>
                    <p>For long-term wealth creation, consider starting a SIP with the following allocation:</p>
                    <ul>
                        <li><strong>Equity Funds (70%)</strong>: For growth - Index funds, Bluechip funds, Midcap funds</li>
                        <li><strong>Debt Funds (20%)</strong>: For stability - Short duration funds, Banking & PSU funds</li>
                        <li><strong>Gold/International Funds (10%)</strong>: For diversification</li>
                    </ul>
                    <p>Start with at least ₹5,000 monthly SIP for 15+ years to build significant wealth.</p>
                </div>
                
                <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px; text-align: center;">
                    <p>This report is prepared based on the information provided and for educational purposes only. Please consult with a tax professional before making investment decisions.</p>
                    <p>For assistance, contact: Tax Planner Team | +91-98765-43210 | support@taxplanner.in</p>
                </div>
            </div>
        `;
        
        // Initialize html2canvas and jsPDF
        const { jsPDF } = window.jspdf;
        
        // Generate PDF
        setTimeout(function() {
            html2canvas(pdfContent, {
                scale: 1,
                useCORS: true,
                logging: false
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                const imgX = (pdfWidth - imgWidth * ratio) / 2;
                const imgY = 0;
                
                pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
                pdf.save(`Tax_Planning_Report_${name.replace(/\s+/g, '_')}.pdf`);
                
                // Reset button state
                downloadPdfBtn.innerHTML = '<i class="fas fa-download me-2"></i>Download PDF Report';
                downloadPdfBtn.disabled = false;
            });
        }, 500);
    }
});
