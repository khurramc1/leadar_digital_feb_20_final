// ============================================
// MARKETING BUDGET CALCULATOR
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('budgetCalculatorForm');
    const resultsSection = document.getElementById('resultsSection');
    
    if (!form) return; // Only run on calculator page
    
    // Industry-specific data
    const industryData = {
        'property-management': {
            name: 'Property Management',
            avgCostPerLead: 120,
            conversionRate: 0.20,
            recommendedSplit: {
                seo: 35,
                paidAds: 25,
                content: 25,
                linkedin: 10,
                other: 5
            }
        },
        'recruitment': {
            name: 'Recruitment & HR',
            avgCostPerLead: 180,
            conversionRate: 0.25,
            recommendedSplit: {
                seo: 30,
                paidAds: 30,
                content: 20,
                linkedin: 15,
                other: 5
            }
        },
        'healthcare': {
            name: 'Healthcare',
            avgCostPerLead: 150,
            conversionRate: 0.22,
            recommendedSplit: {
                seo: 40,
                paidAds: 25,
                content: 25,
                linkedin: 5,
                other: 5
            }
        },
        'professional-services': {
            name: 'Professional Services',
            avgCostPerLead: 200,
            conversionRate: 0.18,
            recommendedSplit: {
                seo: 35,
                paidAds: 25,
                content: 25,
                linkedin: 10,
                other: 5
            }
        },
        'other-b2b': {
            name: 'Other B2B',
            avgCostPerLead: 160,
            conversionRate: 0.20,
            recommendedSplit: {
                seo: 35,
                paidAds: 30,
                content: 20,
                linkedin: 10,
                other: 5
            }
        }
    };
    
    // Goal-based adjustments
    const goalAdjustments = {
        'brand-awareness': {
            seo: 1.3,
            paidAds: 0.7,
            content: 1.3,
            linkedin: 1.0,
            other: 1.0
        },
        'balanced': {
            seo: 1.0,
            paidAds: 1.0,
            content: 1.0,
            linkedin: 1.0,
            other: 1.0
        },
        'lead-generation': {
            seo: 0.8,
            paidAds: 1.4,
            content: 0.8,
            linkedin: 1.2,
            other: 0.8
        }
    };
    
    // Channel descriptions
    const channelInfo = {
        seo: {
            name: 'SEO & Organic Content',
            description: 'Blog posts, website optimization, keyword targeting'
        },
        paidAds: {
            name: 'Paid Advertising',
            description: 'Google Ads, LinkedIn Ads, targeted campaigns'
        },
        content: {
            name: 'Content Creation',
            description: 'Guides, whitepapers, lead magnets, case studies'
        },
        linkedin: {
            name: 'LinkedIn Outreach',
            description: 'Profile optimization, networking, targeted messaging'
        },
        other: {
            name: 'Tools & Analytics',
            description: 'Marketing software, tracking, testing tools'
        }
    };
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateBudget();
    });
    
    function calculateBudget() {
        // Get form values
        const industry = document.getElementById('industry').value;
        const monthlyBudget = parseFloat(document.getElementById('monthlyBudget').value);
        const customerValue = parseFloat(document.getElementById('customerValue').value);
        const marketingGoal = document.getElementById('marketingGoal').value;
        
        // Get industry data
        const industryInfo = industryData[industry];
        const goalModifiers = goalAdjustments[marketingGoal];
        
        // Calculate budget allocation
        const baseSplit = industryInfo.recommendedSplit;
        let allocation = {};
        let total = 0;
        
        // Apply goal modifiers
        for (let channel in baseSplit) {
            allocation[channel] = baseSplit[channel] * goalModifiers[channel];
            total += allocation[channel];
        }
        
        // Normalize to 100%
        for (let channel in allocation) {
            allocation[channel] = (allocation[channel] / total) * 100;
        }
        
        // Calculate dollar amounts
        let budgetAmounts = {};
        for (let channel in allocation) {
            budgetAmounts[channel] = (monthlyBudget * allocation[channel] / 100);
        }
        
        // Calculate expected results
        const expectedLeads = Math.round(monthlyBudget / industryInfo.avgCostPerLead);
        const costPerLead = Math.round(monthlyBudget / expectedLeads);
        const expectedClients = Math.round(expectedLeads * industryInfo.conversionRate);
        const expectedRevenue = expectedClients * customerValue;
        const roi = Math.round(((expectedRevenue - monthlyBudget) / monthlyBudget) * 100);
        
        // Display results
        displayResults(budgetAmounts, allocation, expectedLeads, costPerLead, expectedClients, roi, industry, monthlyBudget, customerValue);
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    function displayResults(budgetAmounts, allocation, expectedLeads, costPerLead, expectedClients, roi, industry, monthlyBudget, customerValue) {
        // Show results section
        resultsSection.style.display = 'block';
        
        // Display budget breakdown
        const breakdownDiv = document.getElementById('budgetBreakdown');
        breakdownDiv.innerHTML = '';
        
        for (let channel in budgetAmounts) {
            const channelData = channelInfo[channel];
            const amount = budgetAmounts[channel];
            const percentage = allocation[channel];
            
            const channelElement = document.createElement('div');
            channelElement.style.cssText = 'background-color: var(--background-light); padding: var(--spacing-lg); border-radius: var(--radius-md);';
            
            channelElement.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm);">
                    <strong>${channelData.name}</strong>
                    <span style="font-size: 20px; font-weight: bold; color: var(--primary-color);">$${Math.round(amount)}</span>
                </div>
                <div style="margin-bottom: var(--spacing-md); color: var(--text-gray); font-size: 14px;">
                    ${channelData.description}
                </div>
                <div style="background-color: white; border-radius: 999px; height: 8px; overflow: hidden;">
                    <div style="background-color: var(--primary-color); height: 100%; width: ${percentage}%;"></div>
                </div>
                <div style="margin-top: var(--spacing-xs); font-size: 14px; color: var(--text-gray);">
                    ${Math.round(percentage)}% of total budget
                </div>
            `;
            
            breakdownDiv.appendChild(channelElement);
        }
        
        // Display expected results
        document.getElementById('expectedLeads').textContent = expectedLeads;
        document.getElementById('costPerLead').textContent = '$' + costPerLead;
        document.getElementById('expectedClients').textContent = expectedClients;
        document.getElementById('expectedROI').textContent = roi + '%';
        
        // Display recommendations
        const recommendationsDiv = document.getElementById('recommendations');
        recommendationsDiv.innerHTML = '';
        
        const recommendations = generateRecommendations(monthlyBudget, customerValue, roi, expectedClients, industry);
        
        recommendations.forEach((rec, index) => {
            const recElement = document.createElement('div');
            recElement.style.cssText = `
                background-color: ${rec.type === 'success' ? '#D1FAE5' : rec.type === 'warning' ? '#FEF3C7' : '#DBEAFE'};
                padding: var(--spacing-lg);
                border-radius: var(--radius-md);
                border-left: 4px solid ${rec.type === 'success' ? '#10B981' : rec.type === 'warning' ? '#F59E0B' : 'var(--primary-color)'};
            `;
            
            recElement.innerHTML = `
                <div style="display: flex; align-items: start; gap: var(--spacing-md);">
                    <div style="font-size: 24px;">${rec.icon}</div>
                    <div>
                        <strong style="display: block; margin-bottom: var(--spacing-xs);">${rec.title}</strong>
                        <p style="margin: 0; font-size: 14px; color: var(--text-gray);">${rec.message}</p>
                    </div>
                </div>
            `;
            
            recommendationsDiv.appendChild(recElement);
        });
    }
    
    function generateRecommendations(budget, customerValue, roi, expectedClients, industry) {
        const recommendations = [];
        
        // ROI-based recommendations
        if (roi < 200) {
            recommendations.push({
                type: 'warning',
                icon: '⚠️',
                title: 'Low Expected ROI',
                message: 'Your projected ROI is below 200%. Consider increasing your budget or focusing on higher-value services to improve returns. Alternatively, optimize your sales conversion rate.'
            });
        } else if (roi > 500) {
            recommendations.push({
                type: 'success',
                icon: '🚀',
                title: 'Excellent ROI Potential',
                message: `Your projected ${roi}% ROI is outstanding. Consider increasing your marketing budget to scale these results even further.`
            });
        } else {
            recommendations.push({
                type: 'success',
                icon: '✅',
                title: 'Healthy ROI',
                message: `Your projected ${roi}% ROI is solid for B2B services. This allocation should generate sustainable growth.`
            });
        }
        
        // Budget size recommendations
        if (budget < 1500) {
            recommendations.push({
                type: 'info',
                icon: 'ℹ️',
                title: 'Limited Budget',
                message: 'With a smaller budget, focus heavily on SEO and organic content. These channels build long-term assets. Consider starting with one paid channel rather than splitting too thin.'
            });
        } else if (budget > 5000) {
            recommendations.push({
                type: 'info',
                icon: '💡',
                title: 'Opportunity to Scale',
                message: 'Your budget allows for comprehensive multi-channel marketing. Test multiple channels simultaneously and double down on winners within 3 months.'
            });
        }
        
        // Expected clients recommendation
        if (expectedClients < 2) {
            recommendations.push({
                type: 'warning',
                icon: '📊',
                title: 'Low Client Volume',
                message: 'Expected client volume is low. Ensure your sales process is optimized to convert maximum leads, or consider increasing budget to generate more opportunities.'
            });
        } else if (expectedClients >= 5) {
            recommendations.push({
                type: 'success',
                icon: '🎯',
                title: 'Strong Lead Pipeline',
                message: `You can expect ${expectedClients} new clients per month. Ensure your sales team has capacity to handle this volume and maintain high conversion rates.`
            });
        }
        
        // Industry-specific recommendations
        const industryRecs = {
            'property-management': {
                icon: '🏢',
                title: 'Property Management Strategy',
                message: 'Focus on MCST-focused content and local SEO. Target property managers actively looking to switch providers. Timeline: expect 4-6 months for strong SEO results.'
            },
            'recruitment': {
                icon: '👥',
                title: 'Recruitment Strategy',
                message: 'Position on EOR/PEO services, not just candidate placement. Target employers on LinkedIn. Build authority content around employment law and compliance.'
            },
            'healthcare': {
                icon: '⚕️',
                title: 'Healthcare Strategy',
                message: 'Emphasize educational content and doctor credentials. Target both patients (SEO) and corporate clients (LinkedIn). Ensure all content is compliance-friendly.'
            },
            'professional-services': {
                icon: '💼',
                title: 'Professional Services Strategy',
                message: 'Long sales cycles require consistent nurturing. Focus on thought leadership content and LinkedIn networking. Budget for 6-9 month timeframe to ROI.'
            },
            'other-b2b': {
                icon: '🔧',
                title: 'B2B Services Strategy',
                message: 'Target decision-makers with high-intent keywords. Create problem-solving content. Use LinkedIn for direct outreach to ideal customer profiles.'
            }
        };
        
        if (industryRecs[industry]) {
            recommendations.push({
                type: 'info',
                ...industryRecs[industry]
            });
        }
        
        // Timeline expectation
        recommendations.push({
            type: 'info',
            icon: '⏱️',
            title: 'Realistic Timeline',
            message: 'Expect 3-6 months for full results. Month 1-2: foundation and testing. Month 3-4: traction and optimization. Month 5-6: momentum and scaling. SEO results compound over time.'
        });
        
        return recommendations;
    }
    
});
