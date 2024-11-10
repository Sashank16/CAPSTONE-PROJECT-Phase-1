import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const [data, setData] = useState({});
  const [chartData, setChartData] = useState({
    heartRate: [],
    spO2: [],
    bodyTemp: [],
  });
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();
  const ws = useRef(null);

  // Optimized WebSocket message handler
  const handleWebSocketMessage = useCallback((event) => {
    const message = JSON.parse(event.data);
    if (message.heartRate && message.spO2 && message.bodyTemp) {
      setData({
        heartRate: message.heartRate,
        spO2: message.spO2,
        bodyTemp: message.bodyTemp,
      });
      setChartData((prev) => ({
        heartRate: [...prev.heartRate, message.heartRate].slice(-20),
        spO2: [...prev.spO2, message.spO2].slice(-20),
        bodyTemp: [...prev.bodyTemp, message.bodyTemp].slice(-20),
      }));

      setAlerts((prev) => {
        const newAlert = `Alert at ${new Date().toLocaleTimeString()}: Heart Rate - ${message.heartRate} bpm, SpO2 - ${message.spO2}%, Temp - ${message.bodyTemp}°C`;
        return [...prev.slice(-10), newAlert]; // Retain only last 10 alerts
      });
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:5000/dashboard-data');
        setData(result.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    ws.current = new WebSocket('ws://localhost:5000');
    ws.current.onopen = () => console.log('WebSocket connected');
    ws.current.onmessage = handleWebSocketMessage;
    ws.current.onerror = (error) => console.error('WebSocket error:', error);
    ws.current.onclose = () => console.log('WebSocket closed');

    fetchData();

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [handleWebSocketMessage]);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleDownload = () => {
    // Convert the latest data to a JSON format for the worksheet
    const worksheet = XLSX.utils.json_to_sheet([
      { 
        heartRate: data.heartRate, 
        spO2: data.spO2, 
        bodyTemp: data.bodyTemp,
        timestamp: new Date().toLocaleString(),  // Optional: Add timestamp
      },
    ]);
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sensor Data');
    XLSX.writeFile(workbook, 'sensor_data.xlsx');
  };
  

  const generateChartData = (label, data) => ({
    labels: Array.from({ length: data.length }, (_, i) => i + 1),
    datasets: [
      {
        label,
        data,
        fill: false,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,0.4)',
      },
    ],
  });

  return (
    <div style={styles.dashboardContainer}>
      <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      <div style={styles.contentContainer}>
        <div style={styles.dataContainer}>
          <h2 style={styles.header}>Baby Vitals</h2>
          <div style={styles.vitalsContainer}>
            <div style={styles.vitalItem}>
              <p style={styles.vitalLabel}>Heart Rate</p>
              <p style={styles.vitalValue}>{data.heartRate} bpm</p>
            </div>
            <div style={styles.vitalItem}>
              <p style={styles.vitalLabel}>SpO2</p>
              <p style={styles.vitalValue}>{data.spO2}%</p>
            </div>
            <div style={styles.vitalItem}>
              <p style={styles.vitalLabel}>Body Temperature</p>
              <p style={styles.vitalValue}>{data.bodyTemp} °C</p>
            </div>
          </div>
          <button onClick={handleDownload} style={styles.downloadButton}>Download Data</button>
        </div>
        <div style={styles.chartContainer}>
          <Line data={generateChartData('Heart Rate (bpm)', chartData.heartRate)} />
          <Line data={generateChartData('SpO2 (%)', chartData.spO2)} />
          <Line data={generateChartData('Body Temperature (°C)', chartData.bodyTemp)} />
        </div>
        <div style={styles.alertContainer}>
          <h3>Alerts</h3>
          <ul style={styles.alertList}>
            {alerts.map((alert, index) => (
              <li key={index} style={styles.alertItem}>{alert}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f4f4f9',
    fontFamily: 'Arial, sans-serif',
  },
  contentContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    padding: '20px',
  },
  dataContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  vitalsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '10px',
  },
  vitalItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: '#e0f7fa',
    width: '100%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  vitalLabel: {
    fontSize: '1.2rem',
    color: '#00796b',
    marginBottom: '5px',
  },
  vitalValue: {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    color: '#004d40',
  },
  chartContainer: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  alertContainer: {
    flex: 1,
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  alertList: {
    listStyle: 'none',
    paddingLeft: '0',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  alertItem: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    color: '#333',
  },
  header: {
    fontSize: '2rem',
    color: '#333',
  },
  logoutButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '10px 20px',
    backgroundColor: '#FF5733',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease',
  },
  downloadButton: {
    marginTop: '20px', // Space between vitals and download button
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease',
  },
};

export default Dashboard;
