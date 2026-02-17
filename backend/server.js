/**
 * Proposal Website Backend
 * ========================
 * Simple Express.js server to record YES responses
 * 
 * Endpoints:
 * - POST /yes : Records a YES response with timestamp
 * - GET /responses : Returns all recorded responses (for admin)
 * - GET /health : Health check
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Data storage file path
const DATA_FILE = path.join(__dirname, 'responses.json');

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON bodies

// Serve static frontend files in production
// Uncomment the following line if you want to serve frontend from the same server
// app.use(express.static(path.join(__dirname, '../frontend')));

/**
 * Load existing responses from file
 * Returns array of response objects
 */
function loadResponses() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading responses:', error);
    }
    return [];
}

/**
 * Save responses to file
 * @param {Array} responses - Array of response objects
 */
function saveResponses(responses) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(responses, null, 2));
    } catch (error) {
        console.error('Error saving responses:', error);
    }
}

// In-memory storage (also persists to file)
let yesResponses = loadResponses();

/**
 * POST /yes
 * Records a YES response
 * Request body: { message?: string }
 * Response: { success: boolean, data: object }
 */
app.post('/yes', (req, res) => {
    const timestamp = new Date().toISOString();
    const responseData = {
        id: Date.now().toString(),
        timestamp: timestamp,
        message: req.body.message || "Your Billota is ready to marry you 💍",
        userAgent: req.headers['user-agent'] || 'unknown',
        ip: req.ip || req.connection.remoteAddress
    };

    // Add to in-memory array
    yesResponses.push(responseData);
    
    // Persist to file
    saveResponses(yesResponses);

    console.log(`💍 YES recorded at ${timestamp}`);
    console.log(`   Message: ${responseData.message}`);

    res.json({
        success: true,
        data: responseData,
        totalResponses: yesResponses.length
    });
});

/**
 * GET /responses
 * Returns all recorded responses
 * (You might want to add authentication in production)
 */
app.get('/responses', (req, res) => {
    res.json({
        count: yesResponses.length,
        responses: yesResponses
    });
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        totalResponses: yesResponses.length
    });
});

/**
 * GET /
 * Root endpoint
 */
app.get('/', (req, res) => {
    res.json({
        message: '💕 Proposal Backend API',
        endpoints: {
            'POST /yes': 'Record a YES response',
            'GET /responses': 'Get all responses',
            'GET /health': 'Health check'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log('═══════════════════════════════════════');
    console.log('  💕 Proposal Backend Server 💕');
    console.log('═══════════════════════════════════════');
    console.log(`  Server running on port ${PORT}`);
    console.log(`  Health check: http://localhost:${PORT}/health`);
    console.log(`  API docs: http://localhost:${PORT}/`);
    console.log('═══════════════════════════════════════');
    console.log(`  Loaded ${yesResponses.length} previous response(s)`);
    console.log('═══════════════════════════════════════');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, saving data...');
    saveResponses(yesResponses);
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT received, saving data...');
    saveResponses(yesResponses);
    process.exit(0);
});
