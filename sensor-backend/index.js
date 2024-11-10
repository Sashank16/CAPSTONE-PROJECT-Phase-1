const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const axios = require('axios');
const WebSocket = require('ws');
const app = express();
const PORT = 5000;

// CORS Configuration
app.use(cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST'], credentials: true }));

// Middleware
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Inooga@23',  // Update with your actual password
  database: 'sensor_app',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL Database');
});

// Create an HTTP server to attach the WebSocket server
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.send(JSON.stringify({ message: 'Welcome to the real-time dashboard!' }));

  ws.on('error', (error) => {
    console.error('WebSocket Error:', error);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Home Route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Webhook Endpoint
app.post('/webhook', (req, res) => {
  console.log('Webhook received:', req.body);
  res.status(200).json({ success: true, message: 'Webhook received successfully' });
});

// Sensor Data Collection Endpoint (Modified to include user_id)
app.post('/sensor-data', (req, res) => {
  const { heartRate, spO2, bodyTemp } = req.body;  // Expect data but not user_id in request body

  
  
  if (!heartRate || !spO2 || !bodyTemp) {
    return res.status(400).json({ success: false, message: 'Incomplete sensor data or missing user_id' });
  }

  const query = 'INSERT INTO sensor_data (heart_rate, spO2, body_temp, timestamp) VALUES (?, ?, ?, NOW())';

  db.query(query, [heartRate, spO2, bodyTemp], (err, result) => {
    if (err) {
      console.error('Error storing sensor data:', err);
      return res.status(500).json({ success: false, message: 'Failed to store sensor data' });
    }

    broadcastSensorData(heartRate, spO2, bodyTemp);
    res.status(201).json({ success: true, message: 'Sensor data saved successfully' });
  });
});


// Broadcast Function
function broadcastSensorData(heartRate, spO2, bodyTemp) {
  const message = JSON.stringify({ heartRate, spO2, bodyTemp, timestamp: new Date() });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Dashboard Data Endpoint (Modified to retrieve data for a specific user_id)
app.get('/dashboard-data', (req, res) => {
  const query = 'SELECT heart_rate AS heartRate, spO2, body_temp AS bodyTemp FROM sensor_data ORDER BY timestamp DESC LIMIT 1';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching dashboard data:', err);
      return res.status(500).json({ success: false, message: 'Error loading dashboard data' });
    }

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(200).json({ heartRate: null, spO2: null, bodyTemp: null });
    }
  });
});

// Registration Endpoint
app.post('/register', async (req, res) => {
  const { username, email, password, confirmPassword, firstName, lastName } = req.body;

  if (!username || !email || !password || !confirmPassword || !firstName || !lastName) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (username, email, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [username, email, hashedPassword, firstName, lastName], (err, result) => {
    if (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({ success: false, message: 'Registration failed.' });
    }
    res.status(201).json({ success: true, message: 'User registered successfully.',user_id: result.insertId  });
  });
});

// Login Endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Please provide both username and password.' });
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ success: false, message: 'Login failed.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    // Store user_id in session upon successful login
    res.status(200).json({ success: true, message: 'Login successful.'});
  });
});





// Start the Server with WebSocket
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
