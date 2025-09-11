import React, { useEffect, useState } from 'react';

export default function ServiceRequests({ mechanicId, token }) {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch(`/api/mechanic/${mechanicId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch requests');
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchRequests();
  }, [mechanicId, token]);

  return (
    <div>
      <h2>My Service Requests</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      <ul>
        {requests.map(r => (
          <li key={r._id}>{r.description || 'No description'} - Status: {r.status}</li>
        ))}
      </ul>
    </div>
  );
}
