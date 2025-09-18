import React from 'react';

export default function AdminSignup({ onSignup }) {
  return (
    <div>
      <h2>Admin Signup</h2>
      {/* Add your admin signup form here */}
      <button onClick={onSignup}>Simulate Signup</button>
    </div>
  );
}
