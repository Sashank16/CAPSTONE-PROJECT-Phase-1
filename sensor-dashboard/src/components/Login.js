import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLinks from './Authlinks';
import LoginPic from '../Login_Pic.jpg';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
      if(response.data.success){
      alert(response.data.message);
      navigate('/dashboard');}
      else{
        setError('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert(`Login failed: ${error.response.data.message || error.message}`);
    }
  };

  return (
    <div className="login-container">
      <AuthLinks /> {/* Include the AuthLinks component */}
      <style>
        {`
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100vw;
            margin: 0;
            background-image: url(${LoginPic});
            background-size: 100% 100%; /* Adjusted syntax */
            background-position: center;
            background-repeat: no-repeat;
          }
          .login-container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            width: 300px;
            margin-left:810px;
            margin-top:180px;
            
          }
          h2 {
            text-align: center;
            margin-bottom: 20px;
          }
          .error-message {
            color: red;
            text-align: center;
            margin-bottom: 15px;
          }
          .login-form {
            display: flex;
            flex-direction: column;
          }
          .input-field {
            margin-bottom: 10px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
          }
          .input-field:focus {
            border-color: #007BFF;
            outline: none;
          }
          .login-button {
            padding: 10px;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          }
          .login-button:hover {
            background-color: #0056b3;
          }
          .navigation {
            margin-top: 15px;
            text-align: center;
          }
          .nav-link {
            margin: 0 10px;
            text-decoration: none;
            color: #007BFF;
            font-weight: bold;
          }
          .nav-link:hover {
            text-decoration: underline;
          }
        `}
      </style>
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      <div className="navigation">
        <p>
          Don't have an account? <a href="/register" className="nav-link">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
