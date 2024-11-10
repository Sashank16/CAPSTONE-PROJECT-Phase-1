import axios from 'axios';
import React, { useState } from 'react';
import AuthLinks from './Authlinks';
import RegisterPic from '../Login_Pic.jpg';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false); // Track hover state

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/register', {
        username,
        password,
        email,
        firstName,
        lastName,
        confirmPassword,
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data.message || 'Registration failed');
    }
  };

  return (
    <div style={{ ...styles.container, backgroundImage: `url(${RegisterPic})` }}>
      <AuthLinks /> {/* Include the AuthLinks component */}
      <div style={styles.form}>
        <h2 style={styles.header}>Register</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleRegister}>
          <div style={styles.grid}>
            <div style={styles.gridItem}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.gridItem}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.gridItem}>
              <label style={styles.label}>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.gridItem}>
              <label style={styles.label}>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.gridItem}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.gridItem}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>
          </div>
          <button
            type="submit"
            style={{
              ...styles.button,
              backgroundColor: isHovered ? '#0056b3' : '#007bff', // Change color on hover
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f4f4f9',
    fontFamily: 'Arial, sans-serif',
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  header: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '1rem',
    textAlign: 'center', // Center the heading within the form container
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0.99rem',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginLeft: '900px',
    marginTop: '170px',
    width:'450px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    color: '#666',
  },
  input: {
    padding: '0.8rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '0.8rem',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '20px',
  },
};

export default Register;
