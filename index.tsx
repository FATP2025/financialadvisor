import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FinancialPlanningTool = () => {
  // User information state
  const [userInfo, setUserInfo] = useState({
    name: '',
    mobile: '',
    email: '',
    income: 0
  });

  // Tax calculation state
  const [taxDetails, setTaxDetails] = useState({
    financialYear: '2024',
    income: 0,
    section80C: 0,
    section80D: 0,
    homeLoanInterest: 0
  });

  // Investment calculation state
  const [sipDetails, setSipDetails] = useState({
    monthlyInvestment: 10000, // Default 10,000 per month
    duration: 10,
    expectedReturn: 12
  });

  const [swpDetails, setSwpDetails] = useState({
    initialInvestment: 1000000,
    monthlyWithdrawal: 10000,
    duration: 10,
    expectedReturn: 8
  });

  // Results state
  const [taxResults, setTaxResults] = useState(null);
  const [sipResults, setSipResults] = useState(null);
  const [swpResults, setSwpResults] = useState(null);
  const [showReport, setShowReport] = useState(false);

  // Calculate minimum monthly SIP amount based on income or minimum threshold
  const calculateMinimumSIP = (income) => {
    const monthlyIncome = income / 12;
    const tenPercent = monthlyIncome * 0.1;
    return Math.max(10000, tenPercent); // minimum 10,000 or 10% of monthly income
  };

  // Initialize SIP amount on income change
  useEffect(() => {
    if (taxDetails.income > 0) {
      const minSIP = calculateMinimumSIP(taxDetails.income);
      setSipDetails(prev => ({...prev, monthlyInvestment: Math.round(minSIP)}));
    }
  }, [taxDetails.income]);

  // Handle user info changes
  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  // Handle tax detail changes
  const handleTaxDetailChange = (e) => {
    const { name, value } = e.target;
    setTaxDetails({ ...taxDetails, [name]: parseFloat(value) || 0 });
  };

  // Handle SIP detail changes
  const handleSipDetailChange = (e) => {
    const { name, value } = e.target;
    setSipDetails({ ...sipDetails, [name]: parseFloat(value) || 0 });
  };

  // Handle SWP detail changes
  const handleSwpDetailChange = (e) => {
    const { name, value } = e.target;
    setSwpDetails({ ...swpDetails, [name]: parseFloat(value) || 0 });
  };

  // Calculate old regime tax
  const calculateOldRegimeTax = (income, deductions) => {
    const netIncome = Math.max(income - deductions, 0);
    let tax = 0;
    
    if (netIncome <= 250000) {
      tax = 0;
    } else if (netIncome <= 500000) {
      tax = (netIncome - 250000) * 0.05;
    } else if (netIncome <= 1000000) {
      tax = 12500 + (netIncome - 500000) * 0.2;
    } else {
      tax = 112500 + (netIncome - 1000000) * 0.3;
    }
    
    return Math.round(tax);
  };

  // Calculate new regime tax
  const calculateNewRegimeTax = (income) => {
    let tax = 0;
    const slabs = [0, 300000, 600000, 900000, 1200000, 1500000];
    const rates = [0, 0.05, 0.1, 0.15, 0.2, 0.3];

    for (let i = slabs.length - 1; i >= 0; i--) {
      if (income > slabs[i]) {
        tax += (income - slabs[i]) * rates[i];
        income = slabs[i];
      }
    }
    
    return Math.round(tax);
  };

  // Calculate SIP returns
  const calculateSIP = (monthlyInvestment, years, expectedReturn) => {
    const months = years * 12;
    const monthlyRate = expectedReturn / (12 * 100);
    
    const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const investedAmount = monthlyInvestment * months;
    const estimatedReturns = futureValue - investedAmount;
    
    // Generate yearly data for chart
    const yearLabels = Array.from({length: years + 1}, (_, i) => i);
    const investedData = yearLabels.map(year => year * monthlyInvestment * 12);
    const wealthData = [];
    
    for (let year = 0; year <= years; year++) {
      const months = year * 12;
      if (months === 0) {
        wealthData.push(0);
      } else {
        const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
        wealthData.push(Math.round(futureValue));
      }
    }
    
    const chartData = yearLabels.map((year, i) => ({
      year,
      invested: investedData[i],
      wealth: wealthData[i]
    }));
    
    return {
      investedAmount: Math.round(investedAmount),
      estimatedReturns: Math.round(estimatedReturns),
      futureValue: Math.round(futureValue),
      chartData
    };
  };

  // Calculate SWP returns
  const calculateSWP = (principal, monthlyWithdrawal, years, expectedReturn) => {
    const months = years * 12;
    const monthlyRate = expectedReturn / (12 * 100);
    const totalWithdrawals = monthlyWithdrawal * months;
    
    let balance = principal;
    const balanceData = [principal];
    
    for (let i = 1; i <= months; i++) {
      balance = (balance - monthlyWithdrawal) * (1 + monthlyRate);
      if (i % 12 === 0) {
        balanceData.push(Math.max(0, Math.round(balance)));
      }
    }
    
    const chartData = balanceData.map((balance, i) => ({
      year: i,
      balance
    }));
    
    return {
      initialInvestment: principal,
      totalWithdrawals,
      finalBalance: Math.max(0, Math.round(balance)),
      chartData
    };
  };

  // Calculate all and generate report
  const generateReport = () => {
    // Calculate tax
    const totalDeduction = taxDetails.section80C + taxDetails.section80D + taxDetails.homeLoanInterest;
    const standardDeduction = 50000; // Standard deduction
    const profTax = 25000; // Professional Tax assumption
    
    const totalDeductions = totalDeduction + standardDeduction + profTax;
    
    const oldTax = calculateOldRegimeTax(taxDetails.income, totalDeduction);
    const newTax = calculateNewRegimeTax(taxDetails.income);
    
    const betterRegime = oldTax < newTax ? 'Old Regime' : 'New Regime';
    const taxSaving = Math.abs(oldTax - newTax);
    
    setTaxResults({
      oldRegime: {
        totalIncome: taxDetails.income,
        totalDeductions,
        taxableIncome: Math.max(0, taxDetails.income - totalDeductions),
        taxAmount: oldTax
      },
      newRegime: {
        totalIncome: taxDetails.income,
        totalDeductions: standardDeduction + profTax,
        taxableIncome: Math.max(0, taxDetails.income - (standardDeduction + profTax)),
        taxAmount: newTax
      },
      betterRegime,
      taxSaving
    });
    
    // Calculate SIP
    setSipResults(calculateSIP(
      sipDetails.monthlyInvestment,
      sipDetails.duration,
      sipDetails.expectedReturn
    ));
    
    // Calculate SWP
    setSwpResults(calculateSWP(
      swpDetails.initialInvestment,
      swpDetails.monthlyWithdrawal,
      swpDetails.duration,
      swpDetails.expectedReturn
    ));
    
    setShowReport(true);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  // Create a new report
  const createNewReport = () => {
    setShowReport(false);
  };

  // Market performance data (static for demonstration)
  const sensexData = [
    { year: '2005', value: 6000 },
    { year: '2006', value: 10280 },
    { year: '2007', value: 13786 },
    { year: '2008', value: 9647 },
    { year: '2009', value: 17464 },
    { year: '2010', value: 20509 },
    { year: '2011', value: 15454 },
    { year: '2012', value: 19426 },
    { year: '2013', value: 21170 },
    { year: '2014', value: 27499 },
    { year: '2015', value: 26117 },
    { year: '2016', value: 26626 },
    { year: '2017', value: 34056 },
    { year: '2018', value: 36068 },
    { year: '2019', value: 41253 },
    { year: '2020', value: 47751 },
    { year: '2021', value: 59306 },
    { year: '2022', value: 57197 },
    { year: '2023', value: 62567 },
    { year: '2024', value: 72240 },
    { year: '2025', value: 75688 }
  ];

  const niftyData = [
    { year: '2005', value: 1800 },
    { year: '2006', value: 3072 },
    { year: '2007', value: 4147 },
    { year: '2008', value: 2959 },
    { year: '2009', value: 5201 },
    { year: '2010', value: 6134 },
    { year: '2011', value: 4624 },
    { year: '2012', value: 5905 },
    { year: '2013', value: 6304 },
    { year: '2014', value: 8282 },
    { year: '2015', value: 7946 },
    { year: '2016', value: 8185 },
    { year: '2017', value: 10530 },
    { year: '2018', value: 10862 },
    { year: '2019', value: 12168 },
    { year: '2020', value: 13981 },
    { year: '2021', value: 17354 },
    { year: '2022', value: 17052 },
    { year: '2023', value: 18700 },
    { year: '2024', value: 21835 },
    { year: '2025', value: 22930 }
  ];

  return (
    <div className="container mx-auto p-4">
      {!showReport ? (
        <div>
          <h1 className="text-2xl font-bold mb-6 text-center">Financial Planning Tool</h1>
          
          {/* User Information */}
          <div className="bg-gray-100 p-4 mb-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={userInfo.name} 
                  onChange={handleUserInfoChange} 
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Mobile Number</label>
                <input 
                  type="text" 
                  name="mobile" 
                  value={userInfo.mobile} 
                  onChange={handleUserInfoChange} 
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={userInfo.email} 
                  onChange={handleUserInfoChange} 
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Total Income (₹)</label>
                <input 
                  type="number" 
                  name="income" 
                  value={taxDetails.income} 
                  onChange={handleTaxDetailChange} 
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
          
          {/* Tax Section */}
          <div className="bg-gray-100 p-4 mb-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Tax Planning (FY 2024-25)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Section 80C Investments (₹)</label>
                <input 
                  type="number" 
                  name="section80C" 
                  value={taxDetails.section80C} 
                  onChange={handleTaxDetailChange} 
                  className="w-full p-2 border rounded"
                  max="150000"
                />
                <small className="text-gray-500">Max: ₹1,50,000</small>
              </div>
              <div>
                <label className="block mb-1">Section 80D Health Insurance (₹)</label>
                <input 
                  type="number" 
                  name="section80D" 
                  value={taxDetails.section80D} 
                  onChange={handleTaxDetailChange} 
                  className="w-full p-2 border rounded"
                  max="75000"
                />
                <small className="text-gray-500">Max: ₹75,000</small>
              </div>
              <div>
                <label className="block mb-1">Home Loan Interest (₹)</label>
                <input 
                  type="number" 
                  name="homeLoanInterest" 
                  value={taxDetails.homeLoanInterest} 
                  onChange={handleTaxDetailChange} 
                  className="w-full p-2 border rounded"
                  max="200000"
                />
                <small className="text-gray-500">Max: ₹2,00,000</small>
              </div>
            </div>
          </div>
          
          {/* SIP Calculator */}
          <div className="bg-gray-100 p-4 mb-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">SIP Calculator</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1">Monthly Investment (₹)</label>
                <div className="flex items-center">
                  <input 
                    type="number" 
                    name="monthlyInvestment" 
                    value={sipDetails.monthlyInvestment} 
                    onChange={handleSipDetailChange} 
                    className="w-full p-2 border rounded"
                    min="10000"
                  />
                  <span className="ml-2 text-sm text-gray-500">
                    (Min: ₹10,000 or 10% of monthly income)
                  </span>
                </div>
              </div>
              <div>
                <label className="block mb-1">Investment Period (Years)</label>
                <input 
                  type="number" 
                  name="duration" 
                  value={sipDetails.duration} 
                  onChange={handleSipDetailChange} 
                  className="w-full p-2 border rounded"
                  min="1" 
                  max="40"
                />
              </div>
              <div>
                <label className="block mb-1">Expected Annual Return (%)</label>
                <input 
                  type="number" 
                  name="expectedReturn" 
                  value={sipDetails.expectedReturn} 
                  onChange={handleSipDetailChange} 
                  className="w-full p-2 border rounded"
                  min="1" 
                  max="30"
                />
              </div>
            </div>
          </div>
          
          {/* SWP Calculator */}
          <div className="bg-gray-100 p-4 mb-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">SWP Calculator</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Initial Investment (₹)</label>
                <input 
                  type="number" 
                  name="initialInvestment" 
                  value={swpDetails.initialInvestment} 
                  onChange={handleSwpDetailChange} 
                  className="w-full p-2 border rounded"
                  min="10000"
                />
              </div>
              <div>
                <label className="block mb-1">Monthly Withdrawal (₹)</label>
                <input 
                  type="number" 
                  name="monthlyWithdrawal" 
                  value={swpDetails.monthlyWithdrawal} 
                  onChange={handleSwpDetailChange} 
                  className="w-full p-2 border rounded"
                  min="500"
                />
              </div>
              <div>
                <label className="block mb-1">Withdrawal Period (Years)</label>
                <input 
                  type="number" 
                  name="duration" 
                  value={swpDetails.duration} 
                  onChange={handleSwpDetailChange} 
                  className="w-full p-2 border rounded"
                  min="1" 
                  max="30"
                />
              </div>
              <div>
                <label className="block mb-1">Expected Annual Return (%)</label>
                <input 
                  type="number" 
                  name="expectedReturn" 
                  value={swpDetails.expectedReturn} 
                  onChange={handleSwpDetailChange} 
                  className="w-full p-2 border rounded"
                  min="1" 
                  max="20"
                />
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <button 
              onClick={generateReport} 
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Generate Financial Report
            </button>
          </div>
        </div>
      ) : (
        // PDF-Style Report View
        <div className="bg-white p-4 rounded shadow-lg">
          {/* Report Header */}
          <div className="border-b pb-4 mb-4">
            <h1 className="text-2xl font-bold text-center">Financial Tax Planning Report</h1>
            <p className="text-right text-gray-600">Generated on 12 May 2025</p>
          </div>
          
          {/* Personal Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
            <div className="grid grid-cols-1 gap-1">
              <div className="flex">
                <span className="font-medium w-32">Name</span>
                <span>{userInfo.name || 'RAJ'}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">Mobile Number</span>
                <span>{userInfo.mobile || '9566408670'}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">Email Address</span>
                <span>{userInfo.email || 'SMOHANRAJCA@GMAIL.COM'}</span>
              </div>
            </div>
          </div>
          
          {/* Income & Deductions */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Income & Deductions</h2>
            <div className="grid grid-cols-1 gap-1">
              <div className="flex">
                <span className="font-medium w-64">Total Income</span>
                <span>{formatCurrency(taxDetails.income || 987889)}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-64">Section 80C Investments</span>
                <span>{formatCurrency(taxDetails.section80C || 100000)}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-64">Section 80D Health Insurance</span>
                <span>{formatCurrency(taxDetails.section80D || 22000)}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-64">Home Loan Interest</span>
                <span>{formatCurrency(taxDetails.homeLoanInterest || 0)}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-64">Total Deductions</span>
                <span>{formatCurrency((taxDetails.section80C + taxDetails.section80D + taxDetails.homeLoanInterest) || 122000)}</span>
              </div>
            </div>
          </div>
          
          {/* Investment LIMIT Section */}
          <div className="mb-6 bg-yellow-50 p-4 rounded border border-yellow-200">
            <h2 className="text-xl font-semibold mb-2">INVESTMENT LIMIT</h2>
            <div className="grid grid-cols-1 gap-1">
              <div className="flex">
                <span className="font-medium w-64">TAX AMOUNT OR 10% OF MONTHLY SALARY</span>
                <span>SUBJECTED TO MINIMUM OF 10000 NOT MORE THAN RS 10000</span>
              </div>
              <div className="flex">
                <span className="font-medium w-64">TAX AMOUNT</span>
                <span>{formatCurrency(taxResults ? taxResults.oldRegime.taxAmount : 78705)} TAX PORTION</span>
              </div>
              <div className="flex">
                <span className="font-medium w-64">10% MONTHLY TOTAL INCOME</span>
                <span>{formatCurrency(Math.round((taxDetails.income || 987889) / 12 * 0.1))} (TOTAL INCOME /12)*10%</span>
              </div>
              <div className="flex">
                <span className="font-medium w-64">MINIMUM RS 10,000</span>
                <span>{formatCurrency(10000)}</span>
              </div>
            </div>
          </div>
          
          {/* Tax Regime Comparison */}
          {taxResults && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Tax Regime Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Category</th>
                      <th className="border p-2 text-right">Old Regime</th>
                      <th className="border p-2 text-right">New Regime</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">Total Income</td>
                      <td className="border p-2 text-right">{taxResults.oldRegime.totalIncome}</td>
                      <td className="border p-2 text-right">{taxResults.newRegime.totalIncome}</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Total Deductions</td>
                      <td className="border p-2 text-right">{taxResults.oldRegime.totalDeductions}</td>
                      <td className="border p-2 text-right">{taxResults.newRegime.totalDeductions}</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Taxable Income</td>
                      <td className="border p-2 text-right">{taxResults.oldRegime.taxableIncome}</td>
                      <td className="border p-2 text-right">{taxResults.newRegime.taxableIncome}</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Tax Amount</td>
                      <td className="border p-2 text-right">{taxResults.oldRegime.taxAmount}</td>
                      <td className="border p-2 text-right">{taxResults.newRegime.taxAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-3 bg-gray-100 rounded">
                <h3 className="font-semibold">Recommendation</h3>
                <p>{taxResults.betterRegime} is better. You save {formatCurrency(taxResults.taxSaving)}</p>
              </div>
            </div>
          )}
          
          {/* Investment Suggestions */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Investment Suggestions</h2>
            <h3 className="font-medium mt-2">Section 80C Investment Options (Limit: ₹1.5 Lakh)</h3>
            <ul className="list-disc ml-6">
              <li className="flex justify-between">
                <span>ELSS Mutual Funds (3-year lock-in)</span>
                <span>Up to ₹1,50,000</span>
              </li>
              <li className="flex justify-between">
                <span>PPF (Public Provident Fund) - 15-year lock-in</span>
                <span>Up to ₹1,50,000</span>
              </li>
              <li className="flex justify-between">
                <span>NSC (National Savings Certificate)</span>
                <span>Up to ₹1,50,000</span>
              </li>
              <li className="flex justify-between">
                <span>Life Insurance Premium</span>
                <span>Up to ₹1,50,000</span>
              </li>
              <li className="flex justify-between">
                <span>5-Year Tax Saving FD</span>
                <span>Up to ₹1,50,000</span>
              </li>
            </ul>
            
            <h3 className="font-medium mt-4">Section 80D - Health Insurance Premium</h3>
            <ul className="list-disc ml-6">
              <li className="flex justify-between">
                <span>Self & Family (below 60 years)</span>
                <span>Up to ₹25,000</span>
              </li>
              <li className="flex justify-between">
                <span>Parents (below 60)</span>
                <span>₹25,000</span>
              </li>
              <li className="flex justify-between">
                <span>Parents (Senior Citizen)</span>
                <span>₹50,000</span>
              </li>
              <li className="flex justify-between">
                <span>Preventive Health Check-up</span>
                <span>Within overall limit of ₹5,000</span>
              </li>
            </ul>
          </div>
          
          {/* SIP & SWP Results */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SIP Results */}
            {sipResults && (
              <div className="bg-blue-50 p-4 rounded">
                <h2 className="text-xl font-semibold mb-4">Your SIP Investment Results</h2>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Invested Amount:</span>
                    <span className="font-semibold">{formatCurrency(sipResults.investedAmount)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Estimated Returns:</span>
                    <span className="font-semibold">{formatCurrency(sipResults.estimatedReturns)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Future Value:</span>
                    <span className="font-semibold">{formatCurrency(sipResults.futureValue)}</span>
                  </div>
                </div>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sipResults.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                      <YAxis tickFormatter={(value) => `₹${(value / 1000)}k`} />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']} />
                      <Legend />
                      <Line type="monotone" dataKey="invested" name="Invested Amount" stroke="#8884d8" />
                      <Line type="monotone" dataKey="wealth" name="Expected Wealth" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            
            {/* SWP Results */}
            {swpResults && (
              <div className="bg-green-50 p-4 rounded">
                <h2 className="text-xl font-semibold mb-4">Your SWP Results</h2>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Initial Investment:</span>
                    <span className="font-semibold">{formatCurrency(swpResults.initialInvestment)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Total Withdrawals:</span>
                    <span className="font-semibold">{formatCurrency(swpResults.totalWithdrawals)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Remaining Corpus:</span>
                    <span className="font-semibold">{formatCurrency(swpResults.finalBalance)}</span>
                  </div>
                </div>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={swpResults.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                      <YAxis tickFormatter={(value) => `₹${(value / 1000)}k`} />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']} />
                      <Legend />
                      <Line type="monotone" dataKey="balance" name="Remaining Balance" stroke="#ff7300" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
          
          {/* Market Performance */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Market Performance (20 Year Trend)</h2>
            
            <div className="grid grid-cols-1 gap-8">
              {/* NIFTY Performance */}
              <div>
                <h3 className="font-medium mb-2">NSE NIFTY 50 Performance (2005-2025)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={niftyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value.toLocaleString('en-IN')}`, 'NIFTY 50']} />
                      <Line type="monotone" dataKey="value" name="NIFTY 50" stroke="#4299e1" dot={{ r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="bg-gray-100 p-2 text-center rounded">
                    <h4 className="text-sm">5 Year CAGR</h4>
                    <p className="text-green-600 font-bold">10.8%</p>
                  </div>
                  <div className="bg-gray-100 p-2 text-center rounded">
                    <h4 className="text-sm">10 Year CAGR</h4>
                    <p className="text-green-600 font-bold">12.3%</p>
                  </div>
                  <div className="bg-gray-100 p-2 text-center rounded">
                    <h4 className="text-sm">15 Year CAGR</h4>
                    <p className="text-green-600 font-bold">13.1%</p>
                  </div>
                  <div className="bg-gray-100 p-2 text-center rounded">
                    <h4 className="text-sm">20 Year CAGR</h4>
                    <p className="text-green-600 font-bold">14.8%</p>
                  </div>
                </div>
              </div>
              
              {/* SENSEX Performance */}
              <div>
                <h3 className="font-medium mb-2">BSE SENSEX Performance (2005-2025)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sensexData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value.toLocaleString('en-IN')}`, 'SENSEX']} />
                      <Line type="monotone" dataKey="value" name="SENSEX" stroke="#e53e3e" dot={{ r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="bg-gray-100 p-2 text-center rounded">
                    <h4 className="text-sm">5 Year CAGR</h4>
                    <p className="text-green-600 font-bold">11.2%</p>
                  </div>
                  <div className="bg-gray-100 p-2 text-center rounded">
                    <h4 className="text-sm">10 Year CAGR</h4>
                    <p className="text-green-600 font-bold">12.7%</p>
                  </div>
                  <div className="bg-gray-100 p-2 text-center rounded">
                    <h4 className="text-sm">15 Year CAGR</h4>
                    <p className="text-green-600 font-bold">13.5%</p>
                  </div>
                  <div className="bg-gray-100 p-2 text-center rounded">
                    <h4 className="text-sm">20 Year CAGR</h4>
                    <p className="text-green-600 font-bold">15.2%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Power of Compounding */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Financial Freedom Using The Power of Compounding</h2>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-lg font-medium mb-2">Abstract</h3>
              <p className="mb-4">
                This document explores the remarkable impact of compounding on investments through a 
                hypothetical scenario where an individual invests ₹10,000 monthly for the first five years. 
                Following this initial investment period, the individual opts for a Systematic Withdrawal 
                Plan (SWP) to withdraw ₹8,334 monthly for the next ten years. The analysis culminates 
                in a substantial final investment value of ₹21,46,554 at the end of the 15-year period.
              </p>
              
              <h3 className="text-lg font-medium mb-2">Investment Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h4 className="font-medium">Initial Investment:</h4>
                  <ul className="list-disc ml-6">
                    <li>Amount: ₹10,000 per month</li>
                    <li>Duration: 5 years</li>
                    <li>Total Investment: ₹6,00,000</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Withdrawal Phase:</h4>
                  <ul className="list-disc ml-6">
                    <li>Plan: Systematic Withdrawal Plan (SWP)</li>
                    <li>Monthly Withdrawal: ₹8,334</li>
                    <li>Duration: 10 years</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Final Investment Value:</h4>
                  <ul className="list-disc ml-6">
                    <li>Amount at the end of 15 years: ₹21,46,554</li>
                  </ul>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-2">Conclusion</h3>
              <p>
                Investing just ₹10,000 monthly for the first five years can lead to a remarkable financial 
                outcome due to the power of compounding. The ability to withdraw ₹8,334 monthly for 
                the next ten years while still ending up with a significant investment value of 
                ₹21,46,554 underscores the importance of starting early and remaining consistent in 
                investment practices. This scenario serves as a compelling example of how even a 
                small percentage of one's salary can yield substantial returns over time through the 
                power of compounding.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button 
              onClick={createNewReport} 
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Create New Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialPlanningTool;