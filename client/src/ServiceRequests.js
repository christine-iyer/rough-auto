
import React, { useEffect, useState } from 'react';

export default function ServiceRequests({ mechanicId, token }) {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [editStatus, setEditStatus] = useState({});
  const statusOptions = ['pending', 'accepted', 'rejected', 'question'];

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch(`/api/service-request/mechanic/${mechanicId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        setError(err.message);
      }
    }
    if (mechanicId && token) fetchRequests();
  }, [mechanicId, token]);

  const handleStatusChange = (id, value) => {
    setEditStatus(prev => ({ ...prev, [id]: value }));
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`/api/service-request/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: editStatus[id] })
      });
      if (!res.ok) throw new Error('Failed to update status');
      // Refresh requests after update
      const updated = await res.json();
      setRequests(reqs => reqs.map(r => r._id === id ? { ...r, status: updated.status } : r));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Service Requests</h2>
      <div style={{background:'#eee',padding:'8px',marginBottom:'8px'}}>
        <strong>Debug Info:</strong><br/>
        mechanicId: {mechanicId ? mechanicId : 'undefined'}<br/>
        token: {token ? token.substring(0, 20) + '...' : 'undefined'}<br/>
        requests: <pre style={{maxHeight:'100px',overflow:'auto'}}>{JSON.stringify(requests, null, 2)}</pre>
      </div>
      {error && <div style={{color:'red'}}>{error}</div>}
      <ul>
        {requests.map(r => (
          <li key={r.serviceRequestId}>
            {r.description || 'No description'} - Status: {r.status}
            <select
              value={editStatus[r.serviceRequestId] || r.status}
              onChange={e => handleStatusChange(r.serviceRequestId, e.target.value)}
              style={{ marginLeft: '10px' }}
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <button onClick={() => handleUpdate(r.serviceRequestId)} style={{ marginLeft: '10px' }}>
              Update
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
