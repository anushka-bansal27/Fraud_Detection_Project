/**
 * Credit Card Fraud Detector - Frontend JavaScript
 * Handles form submission, API communication, and result display
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

// API endpoint (relative path - works with Flask)
const API_URL = '/predict';

// Multiple sample transaction datasets (mix of legitimate and potentially fraudulent)
const SAMPLE_DATASETS = [
    // Legitimate transaction 1
    {
        Time: 0,
        V1: -1.3598071336738,
        V2: -0.0727811733098497,
        V3: 2.53634673796914,
        V4: 1.37815522427443,
        V5: -0.338320769942518,
        V6: 0.462387777762292,
        V7: 0.239598554061257,
        V8: 0.0986979012610507,
        V9: 0.363786969611213,
        V10: 0.0907941719789316,
        V11: -0.551599533260813,
        V12: -0.617800855762348,
        V13: -0.991389847235408,
        V14: -0.311169353699879,
        V15: 1.46817697209427,
        V16: -0.470400525259478,
        V17: 0.207971241929242,
        V18: 0.0257905801985591,
        V19: 0.403992960255733,
        V20: 0.251412098239705,
        V21: -0.018306777944153,
        V22: 0.277837575558899,
        V23: -0.110473910188767,
        V24: 0.0669280749146731,
        V25: 0.128539358273528,
        V26: -0.189114843888824,
        V27: 0.133558376740387,
        V28: -0.0210530534538215,
        Amount: 149.62
    },
    // Legitimate transaction 2
    {
        Time: 406,
        V1: -2.3122265423263,
        V2: 1.95199201064158,
        V3: -1.60985073229769,
        V4: 3.9979055875468,
        V5: -0.522187864667764,
        V6: -1.42654531920595,
        V7: -2.53738730624579,
        V8: 1.39165724829804,
        V9: -2.77008927719433,
        V10: -2.77227214465915,
        V11: 3.20203320709635,
        V12: -2.89990738849473,
        V13: -0.595221881724607,
        V14: -4.28925378244217,
        V15: 0.389724120274487,
        V16: -1.14074717980657,
        V17: -2.83005567450437,
        V18: -0.0168223548035319,
        V19: 0.416955705037907,
        V20: 0.126910559061474,
        V21: 0.517232370861764,
        V22: -0.0350493686052974,
        V23: -0.465211076182388,
        V24: 0.320198198514526,
        V25: 0.0445191674737224,
        V26: 0.177839798284401,
        V27: 0.261145002567677,
        V28: -0.143275874698171,
        Amount: 2.69
    },
    // Potentially fraudulent transaction
    {
        Time: 12350,
        V1: 1.19185711131486,
        V2: 0.266150712059633,
        V3: 0.166480113353362,
        V4: 0.448154078460911,
        V5: 0.0600176492822243,
        V6: -0.0823608088155687,
        V7: -0.0788029833323113,
        V8: 0.0851016549148104,
        V9: -0.255425128110186,
        V10: -0.166974414004614,
        V11: 1.61272666105479,
        V12: 1.06523531137587,
        V13: 0.48909501589608,
        V14: -0.143772296441519,
        V15: 0.635558093258208,
        V16: 0.463917041022171,
        V17: -0.114804663102346,
        V18: -0.183361270123994,
        V19: -0.145783041325259,
        V20: -0.0690831352230203,
        V21: -0.225775248033138,
        V22: -0.638671952771851,
        V23: 0.101288021253234,
        V24: -0.339846475529127,
        V25: 0.167170404418143,
        V26: 0.125894532368176,
        V27: -0.00898309914322826,
        V28: 0.0147241691924927,
        Amount: 99.99
    },
    // Another legitimate transaction
    {
        Time: 8921,
        V1: -0.732789,
        V2: -0.0550802,
        V3: 2.0350300,
        V4: 1.7380570,
        V5: -0.733885,
        V6: 0.0167229,
        V7: 0.327533,
        V8: -0.265197,
        V9: 0.244964,
        V10: -0.201773,
        V11: -0.0142962,
        V12: -0.338262,
        V13: -0.433146,
        V14: -0.287681,
        V15: -0.219247,
        V16: -0.321142,
        V17: 0.265245,
        V18: 0.800049,
        V19: -0.163298,
        V20: 0.123205,
        V21: -0.569153,
        V22: 0.546407,
        V23: 0.108821,
        V24: 0.104533,
        V25: 0.590924,
        V26: 0.327800,
        V27: 0.146969,
        V28: 0.214205,
        Amount: 5.68
    },
    // High amount transaction
    {
        Time: 15000,
        V1: -0.425965,
        V2: 0.960523,
        V3: 1.141109,
        V4: -0.168252,
        V5: 0.420986,
        V6: -0.0297278,
        V7: 0.476201,
        V8: 0.260314,
        V9: -0.568671,
        V10: -0.371407,
        V11: -0.232793,
        V12: 0.105910,
        V13: 0.253844,
        V14: 0.0810809,
        V15: 0.805177,
        V16: 0.247428,
        V17: -0.00943048,
        V18: 0.798278,
        V19: -0.137458,
        V20: 0.141267,
        V21: -0.206010,
        V22: 0.502292,
        V23: 0.219422,
        V24: 0.215153,
        V25: 0.253844,
        V26: 0.0810809,
        V27: 0.805177,
        V28: 0.247428,
        Amount: 2569.36
    }
];

/**
 * Generate random sample data with variations
 * @returns {Object} Random sample transaction data
 */
function generateRandomSample() {
    // Pick a random base dataset
    const baseData = SAMPLE_DATASETS[Math.floor(Math.random() * SAMPLE_DATASETS.length)];
    
    // Create a copy and add some random variations
    const randomData = { ...baseData };
    
    // Add small random variations to V1-V28 (within ±10% of original value)
    for (let i = 1; i <= 28; i++) {
        const key = `V${i}`;
        if (randomData[key] !== undefined) {
            const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
            randomData[key] = parseFloat((randomData[key] * (1 + variation)).toFixed(6));
        }
    }
    
    // Vary the amount slightly (±20%)
    const amountVariation = (Math.random() - 0.5) * 0.4;
    randomData.Amount = parseFloat((randomData.Amount * (1 + amountVariation)).toFixed(2));
    
    // Vary the time (add random offset up to ±1000)
    randomData.Time = Math.max(0, Math.floor(randomData.Time + (Math.random() - 0.5) * 2000));
    
    return randomData;
}

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const form = document.getElementById('fraud-form');
const predictBtn = form.querySelector('button[type="submit"]');
const sampleBtn = document.getElementById('sample-btn');
const resultCard = document.getElementById('result-card');
const loadingDiv = document.getElementById('loading');
const predictionBox = document.getElementById('prediction-box');
const predictionLabel = document.getElementById('prediction-label');
const probabilityValue = document.getElementById('probability-value');
const messageBox = document.getElementById('message-box');
const resultAmount = document.getElementById('result-amount');

// ============================================================================
// EVENT LISTENERS
// ============================================================================

// Form submission
form.addEventListener('submit', handleFormSubmit);

// Sample data button
sampleBtn.addEventListener('click', loadSampleData);

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
async function handleFormSubmit(event) {
    // Prevent default form submission (page reload)
    event.preventDefault();
    
    // Collect form data
    const formData = collectFormData();
    
    // Validate form data
    if (!validateFormData(formData)) {
        showError('Please fill in all fields with valid numbers');
        return;
    }
    
    // Show loading indicator
    showLoading();
    
    try {
        // Send POST request to backend API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        // Check if request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Parse JSON response
        const result = await response.json();
        
        // Hide loading indicator
        hideLoading();
        
        // Display result
        displayResult(result);
        
    } catch (error) {
        // Hide loading indicator
        hideLoading();
        
        // Show error message with more details
        console.error('Error:', error);
        let errorMsg = 'Failed to connect to the server. ';
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMsg += 'Please ensure the Flask backend is running.';
        } else {
            errorMsg += error.message;
        }
        showError(errorMsg);
    }
}

/**
 * Collect form data into a JavaScript object
 * @returns {Object} Form data as key-value pairs
 */
function collectFormData() {
    const data = {};
    
    // Get all input elements
    const inputs = form.querySelectorAll('input[type="number"]');
    
    // Collect values
    inputs.forEach(input => {
        const name = input.name;
        const value = parseFloat(input.value);
        data[name] = value;
    });
    
    return data;
}

/**
 * Validate form data
 * @param {Object} data - Form data to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateFormData(data) {
    // Check if all values are numbers
    for (const key in data) {
        if (isNaN(data[key])) {
            return false;
        }
    }
    
    // Check if we have all required fields (30 features + time + amount = 31 total)
    // Actually Time and Amount + V1-V28 = 30 fields total
    const requiredFields = ['Time', 'Amount'];
    for (let i = 1; i <= 28; i++) {
        requiredFields.push(`V${i}`);
    }
    
    for (const field of requiredFields) {
        if (!(field in data)) {
            return false;
        }
    }
    
    return true;
}

/**
 * Display prediction result
 * @param {Object} result - API response data
 */
function displayResult(result) {
    // Check if all required elements exist
    if (!predictionBox || !predictionLabel || !probabilityValue || !messageBox || !resultCard) {
        console.error('Missing required DOM elements');
        showError('Error displaying result. Please refresh the page.');
        return;
    }
    
    // Determine if fraud or legitimate
    const isFraud = result.prediction === 'Fraud';
    
    // Update prediction box styling
    predictionBox.className = 'prediction-box ' + (isFraud ? 'fraud' : 'legitimate');
    
    // Update prediction label
    predictionLabel.textContent = isFraud ? '🚨 FRAUD DETECTED' : '✅ LEGITIMATE TRANSACTION';
    
    // Update probability
    const probabilityPercent = (result.probability * 100).toFixed(2);
    probabilityValue.textContent = probabilityPercent + '%';
    
    // Update message
    const message = isFraud 
        ? `This transaction has a ${probabilityPercent}% probability of being fraudulent. Please review carefully.`
        : `This transaction appears legitimate with a ${probabilityPercent}% fraud probability.`;
    messageBox.textContent = message;
    
    // Update transaction amount (get from form)
    const amountInput = form.querySelector('input[name="Amount"]');
    if (amountInput && amountInput.value) {
        resultAmount.textContent = parseFloat(amountInput.value).toFixed(2);
    }
    
    // Show result card with animation
    resultCard.style.display = 'block';
    
    // Scroll to result
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Load sample transaction data into form
 * Generates unique data each time it's called
 */
function loadSampleData() {
    // Generate random sample data
    const sampleData = generateRandomSample();
    
    // Fill each form field with sample data
    for (const key in sampleData) {
        const input = form.querySelector(`input[name="${key}"]`);
        if (input) {
            input.value = sampleData[key];
        }
    }
    
    // Show success message
    showSuccess('New sample data loaded! Click "Analyze Transaction" to test.');
}

/**
 * Show loading indicator
 */
function showLoading() {
    if (loadingDiv) loadingDiv.style.display = 'block';
    if (resultCard) resultCard.style.display = 'none';
    if (predictBtn) {
        predictBtn.disabled = true;
        predictBtn.textContent = '⏳ Analyzing...';
    }
}

/**
 * Hide loading indicator
 */
function hideLoading() {
    if (loadingDiv) loadingDiv.style.display = 'none';
    if (predictBtn) {
        predictBtn.disabled = false;
        predictBtn.textContent = '🔍 Analyze Transaction';
    }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = '❌ ' + message;
    
    // Insert before form
    form.parentNode.insertBefore(errorDiv, form);
    
    // Remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
    
    // Scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Show success message
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
    // Create success element
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = '✅ ' + message;
    
    // Insert before form
    form.parentNode.insertBefore(successDiv, form);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format currency value
 * @param {number} value - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(value) {
    return '$' + value.toFixed(2);
}

/**
 * Check if API is reachable
 * @returns {Promise<boolean>} True if API is reachable
 */
async function checkAPIHealth() {
    try {
        const response = await fetch('/');
        return response.ok;
    } catch (error) {
        return false;
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the application
 */
function init() {
    console.log('Credit Card Fraud Detector initialized');
    console.log('API URL:', API_URL);
    
    // Check if API is reachable on page load (optional)
    checkAPIHealth().then(isHealthy => {
        if (!isHealthy) {
            console.warn('Warning: Backend API may not be running');
            console.warn('Please start Flask server: python backend/app.py');
        } else {
            console.log('✅ Backend API is reachable');
        }
    });
}

// Run initialization when page loads
document.addEventListener('DOMContentLoaded', init);

// ============================================================================
// ADDITIONAL FEATURES (Optional enhancements)
// ============================================================================

/**
 * Export form data as JSON (for testing)
 */
function exportFormData() {
    const data = collectFormData();
    const dataStr = JSON.stringify(data, null, 2);
    console.log('Form Data:', dataStr);
    return data;
}

/**
 * Clear result display
 */
function clearResult() {
    resultCard.style.display = 'none';
}

// Expose useful functions to console for debugging
window.fraudDetector = {
    exportFormData,
    clearResult,
    loadSampleData,
    checkAPIHealth
};

console.log('💡 Tip: Access utility functions via window.fraudDetector in console');