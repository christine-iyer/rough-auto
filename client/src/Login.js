import React, { useState } from 'react';


export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);
  const [userType, setUserType] = useState('');
  const [mechanics, setMechanics] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      setToken(data.token);
      // Decode token to get userType (or get from response if available)
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      setUserType(payload.userType);
      if (payload.userType === 'mechanic') {
        // Fetch mechanics
        const mechRes = await fetch('/api/list/mechanics', {
          headers: { Authorization: `Bearer ${data.token}` }
        });
        const mechanicsData = await mechRes.json();
        setMechanics(mechanicsData);
        // Fetch service requests for this mechanic
        const srRes = await fetch(`/api/service-request/mechanic/${payload.id}`, {
          headers: { Authorization: `Bearer ${data.token}` }
        });
        const srData = await srRes.json();
        setServiceRequests(srData);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (token && userType === 'mechanic') {
    return (
      <div>
        <h2>Mechanic Dashboard</h2>
        <h3>Mechanics</h3>
        <ul>
          {mechanics.map(m => (
            <li key={m._id}>{m.mechanicName} ({m.email})</li>
          ))}
        </ul>
        <h3>Service Requests</h3>
        <ul>
          {serviceRequests.map(sr => (
            <li key={sr._id}>
              {sr.description} - Status: {sr.status}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
      <button type="submit">Log In</button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
}
