// ============================================
// ROI CALCULATOR LOGIC
// ============================================

// Calculator state
let currentStep = 1;
const totalSteps = 4;
let calculatorData = {};

// ============================================
// STEP NAVIGATION
// ============================================

function nextStep() {
    // Validate current step
    if (!validateStep(currentStep)) {
        return;
    }
    
    // Save current step data
    saveStepData(currentStep);
    
    // Move to next step
    if (currentStep < totalSteps) {
        currentStep++;
        updateStepDisplay();
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
}

function updateStepDisplay() {
    // Update progress bar
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        const stepNumber = index + 1;
        if (stepNumber < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
    
    // Update calculator steps
    const calculatorSteps = document.querySelectorAll('.calculator-step');
    calculatorSteps.forEach((step, index) => {
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// ============================================
// VALIDATION
// ============================================

function validateStep(step) {
    switch(step) {
        case 1:
            const industry = document.querySelector('input[name="industry"]:checked');
            const closeRate = document.querySelector('input[name="closeRate"]:checked');
            
            if (!industry) {
                alert('Please select your industry');
                return false;
            }
            if (!closeRate) {
                alert('Please select your close rate');
                return false;
            }
            return true;
            
        case 2:
            const leadSource = document.querySelector('input[name="leadSource"]:checked');
            
            if (!leadSource) {
                alert('Please select your primary lead source');
                return false;
            }
            return true;
            
        case 3:
            const goal = document.querySelector('input[name="goal"]:checked');
            
            if (!goal) {
                alert('Please select your primary goal');
                return false;
            }
            return true;
            
        case 4:
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const company = document.getElementById('contactCompany').value;
            
            if (!name || !email || !company) {
                alert('Please fill in all required fields (Name, Email, Company)');
                return false;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return false;
            }
            
            return true;
            
        default:
            return true;
    }
}

// ============================================
// DATA COLLECTION
// ============================================

function saveStepData(step) {
    switch(step) {
        case 1:
            calculatorData.industry = document.querySelector('input[name="industry"]:checked').value;
            calculatorData.clientValue = parseInt(document.getElementById('clientValue').value);
            calculatorData.closeRate = parseFloat(document.querySelector('input[name="closeRate"]:checked').value);
            break;
            
        case 2:
            calculatorData.currentBudget = parseInt(document.getElementById('currentBudget').value);
            calculatorData.currentLeads = parseInt(document.getElementById('currentLeads').value);
            calculatorData.leadSource = document.querySelector('input[name="leadSource"]:checked').value;
            break;
            
        case 3:
            calculatorData.proposedBudget = parseInt(document.getElementById('proposedBudget').value);
            calculatorData.goal = document.querySelector('input[name="goal"]:checked').value;
            break;
            
        case 4:
            calculatorData.name = document.getElementById('contactName').value;
            calculatorData.email = document.getElementById('contactEmail').value;
            calculatorData.company = document.getElementById('contactCompany').value;
            calculatorData.phone = document.getElementById('contactPhone').value;
            calculatorData.emailOptIn = document.getElementById('emailOptIn').checked;
            break;
    }
}

// ============================================
// ROI CALCULATION
// ============================================

function calculateROI() {
    // Validate final step
    if (!validateStep(4)) {
        return;
    }
    
    // Save final step data
    saveStepData(4);
    
    // Determine tier based on budget
    let tier = 'foundation';
    if (calculatorData.proposedBudget >= 5500) {
        tier = 'domination';
    } else if (calculatorData.proposedBudget >= 3500) {
        tier = 'growth';
    }
    
    // Lead ranges by tier
    const leadRanges = {
        'foundation': { min: 8, max: 15, month6: 12 },
        'growth': { min: 15, max: 30, month6: 22 },
        'domination': { min: 30, max: 50, month6: 40 }
    };
    
    // Industry multipliers (some industries convert better)
    const industryMultipliers = {
        'property-management': 0.9,
        'recruitment': 1.0,
        'professional-services': 0.95,
        'it-services': 1.05,
        'corporate-training': 1.0,
        'logistics': 0.95,
        'other-b2b': 1.0
    };
    
    const industryMultiplier = industryMultipliers[calculatorData.industry] || 1.0;
    
    // Calculate monthly projections
    const monthlyProjections = [];
    let totalLeads = 0;
    let totalRevenue = 0;
    
    for (let month = 1; month <= 12; month++) {
        // Lead ramp-up multiplier
        let rampMultiplier;
        if (month <= 2) rampMultiplier = 0.3;
        else if (month <= 4) rampMultiplier = 0.6;
        else if (month <= 6) rampMultiplier = 0.85;
        else rampMultiplier = 1.0;
        
        // Calculate leads for this month
        const baseLeads = leadRanges[tier].month6;
        const monthLeads = Math.round(baseLeads * rampMultiplier * industryMultiplier);
        
        // Calculate revenue
        const clients = monthLeads * (calculatorData.closeRate / 100);
        const revenue = clients * calculatorData.clientValue;
        
        monthlyProjections.push({
            month: month,
            leads: monthLeads,
            clients: clients,
            revenue: revenue,
            investment: calculatorData.proposedBudget
        });
        
        totalLeads += monthLeads;
        totalRevenue += revenue;
    }
    
    const totalInvestment = calculatorData.proposedBudget * 12;
    const roi = totalRevenue / totalInvestment;
    const netRevenue = totalRevenue - totalInvestment;
    
    // Find break-even month
    let cumulativeRevenue = 0;
    let cumulativeInvestment = 0;
    let breakEvenMonth = 0;
    
    for (let i = 0; i < monthlyProjections.length; i++) {
        cumulativeRevenue += monthlyProjections[i].revenue;
        cumulativeInvestment += monthlyProjections[i].investment;
        
        if (cumulativeRevenue >= cumulativeInvestment && breakEvenMonth === 0) {
            breakEvenMonth = i + 1;
        }
    }
    
    // Store results
    calculatorData.results = {
        tier: tier,
        totalInvestment: totalInvestment,
        totalLeads: totalLeads,
        totalRevenue: totalRevenue,
        roi: roi,
        netRevenue: netRevenue,
        breakEvenMonth: breakEvenMonth,
        monthlyProjections: monthlyProjections
    };
    
    // Log data (for development)
    console.log('Calculator Data:', calculatorData);
    
    // Display results
    displayResults();
}

// ============================================
// RESULTS DISPLAY
// ============================================

function displayResults() {
    const results = calculatorData.results;
    
    // Hide calculator, show results
    document.querySelector('.calculator-card').style.display = 'none';
    document.getElementById('resultsSection').classList.add('active');
    
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update subtitle
    const industryNames = {
        'property-management': 'Property Management',
        'recruitment': 'Recruitment',
        'professional-services': 'Professional Services',
        'it-services': 'IT Services',
        'corporate-training': 'Corporate Training',
        'logistics': 'Logistics',
        'other-b2b': 'B2B Services'
    };
    
    document.getElementById('resultsSubtitle').textContent = 
        `Based on ${industryNames[calculatorData.industry]}, $${formatNumber(calculatorData.clientValue)} average client value, and $${formatNumber(calculatorData.proposedBudget)}/month investment`;
    
    // Update summary
    document.getElementById('totalInvestment').textContent = `$${formatNumber(results.totalInvestment)}`;
    document.getElementById('totalLeads').textContent = formatNumber(results.totalLeads);
    document.getElementById('totalRevenue').textContent = `$${formatNumber(results.totalRevenue)}`;
    document.getElementById('totalROI').textContent = `${results.roi.toFixed(1)}x`;
    
    // Display monthly projections
    displayMonthlyProjections(results.monthlyProjections);
    
    // Display methodology
    displayMethodology();
    
    // Display comparison table
    displayComparisonTable();
}

function displayMonthlyProjections(projections) {
    const container = document.getElementById('monthlyProjections');
    const maxLeads = Math.max(...projections.map(p => p.leads));
    
    let html = '';
    
    // Group by quarters
    const quarters = [
        { label: 'Q1 (Months 1-3)', months: [0, 1, 2] },
        { label: 'Q2 (Months 4-6)', months: [3, 4, 5] },
        { label: 'Q3 (Months 7-9)', months: [6, 7, 8] },
        { label: 'Q4 (Months 10-12)', months: [9, 10, 11] }
    ];
    
    quarters.forEach(quarter => {
        const avgLeads = Math.round(
            quarter.months.reduce((sum, i) => sum + projections[i].leads, 0) / 3
        );
        const barWidth = (avgLeads / maxLeads) * 100;
        
        html += `
            <div class="month-projection">
                <div class="month-label">${quarter.label}</div>
                <div class="month-bar" style="width: ${barWidth}%;">
                    <span class="month-value">${avgLeads} leads/month avg</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function displayMethodology() {
    const results = calculatorData.results;
    const tierNames = {
        'foundation': 'Foundation',
        'growth': 'Growth',
        'domination': 'Domination'
    };
    
    const industryNames = {
        'property-management': 'Property Management',
        'recruitment': 'Recruitment',
        'professional-services': 'Professional Services',
        'it-services': 'IT Services',
        'corporate-training': 'Corporate Training',
        'logistics': 'Logistics',
        'other-b2b': 'B2B Services'
    };
    
    const html = `
        <p><strong>Lead Volume Projections:</strong></p>
        <p>Based on typical ${industryNames[calculatorData.industry]} campaigns with $${formatNumber(calculatorData.proposedBudget)} monthly investment (${tierNames[results.tier]} tier):</p>
        <ul style="margin-bottom: var(--spacing-md);">
            <li>Google Ads generates 5-12 leads/month at average cost per lead</li>
            <li>SEO/Content generates 3-10 leads/month by Month 6+</li>
            <li>LinkedIn generates 2-8 leads/month (if budget allows)</li>
            <li>Total: ${Math.round(results.totalLeads / 12)} average qualified leads per month</li>
        </ul>
        
        <p><strong>Close Rate:</strong> You indicated ${calculatorData.closeRate}% close rate. ${calculatorData.closeRate === 20 ? 'Industry average for ' + industryNames[calculatorData.industry] + ' is 20-30%.' : ''}</p>
        
        <p><strong>Client Value:</strong> Based on your $${formatNumber(calculatorData.clientValue)} average client value.</p>
        
        <p><strong>Timeline:</strong></p>
        <ul style="margin-bottom: var(--spacing-md);">
            <li>Months 1-2: Foundation building, lower lead volume (30% of target)</li>
            <li>Months 3-4: Traction phase, increasing leads (60% of target)</li>
            <li>Months 5-6: Momentum building (85% of target)</li>
            <li>Months 7-12: Established pipeline, consistent flow (100% of target)</li>
        </ul>
        
        <p><strong>Break-even:</strong> Month ${results.breakEvenMonth}</p>
        
        <p><strong>Conservative Assumptions:</strong> This projection uses conservative estimates. Many clients exceed these projections by 20-40% as campaigns mature.</p>
    `;
    
    document.getElementById('methodology').innerHTML = html;
}

function displayComparisonTable() {
    const currentCPL = calculatorData.currentBudget > 0 && calculatorData.currentLeads > 0 
        ? calculatorData.currentBudget / calculatorData.currentLeads 
        : 0;
    
    const month12 = calculatorData.results.monthlyProjections[11];
    const projectedCPL = calculatorData.proposedBudget / month12.leads;
    
    const currentRevenue = calculatorData.currentLeads * (calculatorData.closeRate / 100) * calculatorData.clientValue;
    
    const improvement = {
        leads: calculatorData.currentLeads > 0 
            ? ((month12.leads - calculatorData.currentLeads) / calculatorData.currentLeads * 100).toFixed(0) 
            : 'N/A',
        cpl: currentCPL > 0 
            ? ((currentCPL - projectedCPL) / currentCPL * 100).toFixed(0) 
            : 'N/A',
        revenue: currentRevenue > 0 
            ? ((month12.revenue - currentRevenue) / currentRevenue * 100).toFixed(0) 
            : 'N/A'
    };
    
    const html = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="border-bottom: 2px solid var(--border-color);">
                    <th style="padding: var(--spacing-md); text-align: left;">Metric</th>
                    <th style="padding: var(--spacing-md); text-align: center;">Current</th>
                    <th style="padding: var(--spacing-md); text-align: center;">Projected (Month 12)</th>
                    <th style="padding: var(--spacing-md); text-align: center;">Improvement</th>
                </tr>
            </thead>
            <tbody>
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: var(--spacing-md); font-weight: var(--font-weight-semibold);">Monthly Leads</td>
                    <td style="padding: var(--spacing-md); text-align: center;">${calculatorData.currentLeads}</td>
                    <td style="padding: var(--spacing-md); text-align: center; font-weight: var(--font-weight-semibold); color: var(--secondary-color);">${month12.leads}</td>
                    <td style="padding: var(--spacing-md); text-align: center; color: var(--secondary-color);">${improvement.leads !== 'N/A' ? '+' + improvement.leads + '%' : 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: var(--spacing-md); font-weight: var(--font-weight-semibold);">Marketing Cost</td>
                    <td style="padding: var(--spacing-md); text-align: center;">$${formatNumber(calculatorData.currentBudget)}</td>
                    <td style="padding: var(--spacing-md); text-align: center; font-weight: var(--font-weight-semibold);">$${formatNumber(calculatorData.proposedBudget)}</td>
                    <td style="padding: var(--spacing-md); text-align: center;">${calculatorData.currentBudget > 0 ? (((calculatorData.proposedBudget - calculatorData.currentBudget) / calculatorData.currentBudget * 100).toFixed(0) > 0 ? '+' : '') + ((calculatorData.proposedBudget - calculatorData.currentBudget) / calculatorData.currentBudget * 100).toFixed(0) + '%' : 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: var(--spacing-md); font-weight: var(--font-weight-semibold);">Cost per Lead</td>
                    <td style="padding: var(--spacing-md); text-align: center;">$${currentCPL > 0 ? formatNumber(currentCPL) : 'N/A'}</td>
                    <td style="padding: var(--spacing-md); text-align: center; font-weight: var(--font-weight-semibold); color: var(--secondary-color);">$${formatNumber(projectedCPL)}</td>
                    <td style="padding: var(--spacing-md); text-align: center; color: var(--secondary-color);">${improvement.cpl !== 'N/A' ? '-' + improvement.cpl + '%' : 'N/A'}</td>
                </tr>
                <tr>
                    <td style="padding: var(--spacing-md); font-weight: var(--font-weight-semibold);">Monthly Revenue</td>
                    <td style="padding: var(--spacing-md); text-align: center;">$${formatNumber(currentRevenue)}</td>
                    <td style="padding: var(--spacing-md); text-align: center; font-weight: var(--font-weight-semibold); color: var(--secondary-color);">$${formatNumber(month12.revenue)}</td>
                    <td style="padding: var(--spacing-md); text-align: center; color: var(--secondary-color);">${improvement.revenue !== 'N/A' ? '+' + improvement.revenue + '%' : 'N/A'}</td>
                </tr>
            </tbody>
        </table>
    `;
    
    document.getElementById('comparisonTable').innerHTML = html;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatNumber(num) {
    return num.toLocaleString('en-US');
}

function downloadReport() {
    alert('PDF report download functionality will be implemented on the backend. For now, you can take a screenshot of these results or schedule a call to receive your detailed report.');
    
    // In production, this would trigger a PDF generation and download
    // Example:
    // window.location.href = `/api/generate-report?id=${calculatorData.email}`;
}

// ============================================
// SLIDER UPDATES
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Client Value Slider
    const clientValueSlider = document.getElementById('clientValue');
    const clientValueDisplay = document.getElementById('clientValueDisplay');
    
    if (clientValueSlider && clientValueDisplay) {
        clientValueSlider.addEventListener('input', function() {
            clientValueDisplay.textContent = `$${formatNumber(parseInt(this.value))}`;
        });
    }
    
    // Current Budget Slider
    const currentBudgetSlider = document.getElementById('currentBudget');
    const currentBudgetDisplay = document.getElementById('currentBudgetDisplay');
    
    if (currentBudgetSlider && currentBudgetDisplay) {
        currentBudgetSlider.addEventListener('input', function() {
            currentBudgetDisplay.textContent = `$${formatNumber(parseInt(this.value))}`;
        });
    }
    
    // Current Leads Slider
    const currentLeadsSlider = document.getElementById('currentLeads');
    const currentLeadsDisplay = document.getElementById('currentLeadsDisplay');
    
    if (currentLeadsSlider && currentLeadsDisplay) {
        currentLeadsSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            currentLeadsDisplay.textContent = `${value} ${value === 1 ? 'lead' : 'leads'}`;
        });
    }
    
    // Proposed Budget Slider
    const proposedBudgetSlider = document.getElementById('proposedBudget');
    const proposedBudgetDisplay = document.getElementById('proposedBudgetDisplay');
    
    if (proposedBudgetSlider && proposedBudgetDisplay) {
        proposedBudgetSlider.addEventListener('input', function() {
            proposedBudgetDisplay.textContent = `$${formatNumber(parseInt(this.value))}`;
        });
    }
    
    // Radio option styling
    const radioOptions = document.querySelectorAll('.radio-option');
    radioOptions.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        if (radio) {
            radio.addEventListener('change', function() {
                // Remove selected class from all options in this group
                const groupName = this.name;
                document.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
                    r.closest('.radio-option').classList.remove('selected');
                });
                
                // Add selected class to this option
                if (this.checked) {
                    option.classList.add('selected');
                }
            });
        }
    });
});
