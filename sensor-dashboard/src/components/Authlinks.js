import React from 'react';
import { Link } from 'react-router-dom';

function AuthLinks() {
  return (
    <div style={styles.authContainer}>
      <Link to="/login" style={styles.authLink}>Login</Link>
      <span style={styles.separator}> | </span>
      <Link to="/register" style={styles.authLink}>Register</Link>
    </div>
  );
}


const styles = {
  authContainer: {
    display: 'flex',
    justifyContent: 'flex-end', // Aligns to the right
    padding: '10px 20px', // Adds some padding
    position: 'absolute', // Allows it to be positioned freely
    top: '10px', // Adjusts distance from the top
    right: '20px', // Adjusts distance from the right
    width: '100%', // Takes full width
  },
  authLink: {
    color: '#007bff',
    textDecoration: 'none',
    margin: '0 5px',
    fontSize: '1rem',
  },
  separator: {
    color: '#666', // Color for the separator
  },
};

export default AuthLinks;
