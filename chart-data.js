// Market Chart Data for Financial Tax Planner
document.addEventListener('DOMContentLoaded', function() {
    // Create market performance chart
    createMarketPerformanceChart();
    
    // Create returns charts
    createReturnsCharts();
    
    // Create investment projection chart
    createInvestmentProjectionChart();
    
    // Function to create market performance chart
    function createMarketPerformanceChart() {
        const marketChartCanvas = document.getElementById('marketChart');
        
        if (!marketChartCanvas) return;
        
        // Sample data for last 10 years (120 months)
        const months = [];
        const sensexData = [];
        const niftyData = [];
        
        // Generate dates for last 10 years
        const currentDate = new Date();
        for (let i = 119; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setMonth(currentDate.getMonth() - i);
            months.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
        }
        
        // Starting values (approximate values from 10 years ago)
        let sensexBase = 21000; // Approximate SENSEX value from 2015
        let niftyBase = 6300;   // Approximate NIFTY value from 2015
        
        // Generate realistic looking data with trends and correlations
        for (let i = 0; i < 120; i++) {
            // Create common market movement factor (correlation between indices)
            const marketFactor = (Math.random() - 0.5) * 0.06;
            
            // Add some randomness specific to each index
            const sensexChange = marketFactor + (Math.random() - 0.5) * 0.02;
            const niftyChange = marketFactor + (Math.random() - 0.5) * 0.02;
            
            // Apply changes
            sensexBase = sensexBase * (1 + sensexChange);
            niftyBase = niftyBase * (1 + niftyChange);
            
            // Add some major market events over the 10-year period
            if (i === 30) { // 2016 demonetization effect
                sensexBase = sensexBase * 0.92;
                niftyBase = niftyBase * 0.92;
            } else if (i === 31 && i <= 40) {
                sensexBase = sensexBase * (1 + 0.01); // Recovery
                niftyBase = niftyBase * (1 + 0.01);
            } else if (i === 60) { // 2020 COVID crash
                sensexBase = sensexBase * 0.75; // Major dip
                niftyBase = niftyBase * 0.75;
            } else if (i >= 61 && i <= 75) {
                sensexBase = sensexBase * (1 + 0.04); // Strong recovery
                niftyBase = niftyBase * (1 + 0.04);
            } else if (i === 100) { // 2022 bear market
                sensexBase = sensexBase * 0.90;
                niftyBase = niftyBase * 0.90;
            } else if (i >= 101 && i <= 110) {
                sensexBase = sensexBase * (1 + 0.02); // Moderate recovery
                niftyBase = niftyBase * (1 + 0.02);
            }
            
            // Push data
            sensexData.push(Math.round(sensexBase));
            niftyData.push(Math.round(niftyBase));
        }
        
        // Create the chart
        new Chart(marketChartCanvas, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'SENSEX',
                        data: sensexData,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        tension: 0.4
                    },
                    {
                        label: 'NIFTY 50',
                        data: niftyData,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            maxTicksLimit: 12,
                            autoSkip: true
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Index Value'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.raw.toLocaleString('en-IN');
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }
    
    // Function to create returns charts
    function createReturnsCharts() {
        const niftyReturnsCanvas = document.getElementById('niftyReturnsChart');
        const sensexReturnsCanvas = document.getElementById('sensexReturnsChart');
        
        if (!niftyReturnsCanvas || !sensexReturnsCanvas) return;
        
        // Sample returns data
        const periods = ['1 Month', '3 Months', '6 Months', '1 Year', '3 Years', '5 Years'];
        const niftyReturns = [2.1, 5.4, 7.8, 14.6, 42.3, 89.2];
        const sensexReturns = [1.8, 4.9, 7.2, 13.5, 40.2, 85.7];
        
        // Create annualized returns
        const niftyAnnualized = [
            niftyReturns[0] * 12, // 1 month
            niftyReturns[1] * 4, // 3 months
            niftyReturns[2] * 2, // 6 months
            niftyReturns[3], // 1 year
            Math.pow(1 + niftyReturns[4]/100, 1/3) * 100 - 100, // 3 years (annualized)
            Math.pow(1 + niftyReturns[5]/100, 1/5) * 100 - 100  // 5 years (annualized)
        ];
        
        const sensexAnnualized = [
            sensexReturns[0] * 12, // 1 month
            sensexReturns[1] * 4, // 3 months
            sensexReturns[2] * 2, // 6 months
            sensexReturns[3], // 1 year
            Math.pow(1 + sensexReturns[4]/100, 1/3) * 100 - 100, // 3 years (annualized)
            Math.pow(1 + sensexReturns[5]/100, 1/5) * 100 - 100  // 5 years (annualized)
        ];
        
        // Create NIFTY returns chart
        new Chart(niftyReturnsCanvas, {
            type: 'bar',
            data: {
                labels: periods,
                datasets: [
                    {
                        label: 'Absolute Returns (%)',
                        data: niftyReturns,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Annualized Returns (%)',
                        data: niftyAnnualized,
                        backgroundColor: 'rgba(54, 162, 235, 0.8)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        // For 1 year and above, absolute and annualized are the same
                        hidden: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Returns (%)'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.raw.toFixed(2) + '%';
                            }
                        }
                    }
                }
            }
        });
        
        // Create SENSEX returns chart
        new Chart(sensexReturnsCanvas, {
            type: 'bar',
            data: {
                labels: periods,
                datasets: [
                    {
                        label: 'Absolute Returns (%)',
                        data: sensexReturns,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Annualized Returns (%)',
                        data: sensexAnnualized,
                        backgroundColor: 'rgba(255, 99, 132, 0.8)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        // For 1 year and above, absolute and annualized are the same
                        hidden: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Returns (%)'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.raw.toFixed(2) + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Function to create investment projection chart for 10% monthly income over 5 years
    function createInvestmentProjectionChart() {
        const projectionChartCanvas = document.getElementById('investmentProjectionChart');
        
        if (!projectionChartCanvas) return;
        
        // Define investment options
        const investmentOptions = [
            {
                name: 'Equity Mutual Funds',
                color: 'rgba(66, 133, 244, 0.7)',
                borderColor: 'rgba(66, 133, 244, 1)',
                returns: 0.15 // 15% annual return
            },
            {
                name: 'Hybrid Funds',
                color: 'rgba(52, 168, 83, 0.7)',
                borderColor: 'rgba(52, 168, 83, 1)',
                returns: 0.12 // 12% annual return
            },
            {
                name: 'Gold ETF',
                color: 'rgba(251, 188, 5, 0.7)',
                borderColor: 'rgba(251, 188, 5, 1)',
                returns: 0.08 // 8% annual return
            },
            {
                name: 'Term Insurance + ELSS',
                color: 'rgba(234, 67, 53, 0.7)',
                borderColor: 'rgba(234, 67, 53, 1)',
                returns: 0.11 // 11% annual return (blended)
            }
        ];
        
        // Setup chart data
        const labels = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
        const datasets = [];
        
        // Calculate growth for each investment option
        // Assume monthly investment of 10% of income (say 10,000 per month)
        const monthlyInvestment = 10000;
        
        investmentOptions.forEach(option => {
            const data = [];
            let totalInvestment = 0;
            let totalValue = 0;
            
            // Calculate year by year growth
            for (let year = 1; year <= 5; year++) {
                // Investment for this year
                const yearlyInvestment = monthlyInvestment * 12;
                totalInvestment += yearlyInvestment;
                
                // Calculate returns on existing money
                totalValue = totalValue * (1 + option.returns);
                
                // Add this year's investment
                totalValue += yearlyInvestment;
                
                // Push total value at end of year
                data.push(Math.round(totalValue));
            }
            
            datasets.push({
                label: option.name,
                data: data,
                backgroundColor: option.color,
                borderColor: option.borderColor,
                borderWidth: 2,
                tension: 0.3
            });
        });
        
        // Create the chart
        new Chart(projectionChartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Investment Timeline'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Value (₹)'
                        },
                        ticks: {
                            callback: function(value) {
                                if (value >= 1000000) {
                                    return (value / 1000000).toFixed(1) + 'M';
                                } else if (value >= 1000) {
                                    return (value / 1000).toFixed(0) + 'K';
                                }
                                return value;
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.raw;
                                const formattedValue = '₹' + value.toLocaleString('en-IN');
                                const invested = monthlyInvestment * 12 * (context.dataIndex + 1);
                                const formattedInvested = '₹' + invested.toLocaleString('en-IN');
                                const returns = value - invested;
                                const formattedReturns = '₹' + returns.toLocaleString('en-IN');
                                
                                return [
                                    label,
                                    'Total Value: ' + formattedValue,
                                    'Invested: ' + formattedInvested,
                                    'Returns: ' + formattedReturns
                                ];
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: '5-Year Investment Projection (₹10,000 Monthly)',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }
});
