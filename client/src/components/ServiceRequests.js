import React, { useEffect, useState } from 'react';

export default function ServiceRequests({ mechanicId, token }) {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [editStatus, setEditStatus] = useState({});
  const statusOptions = ['pending', 'accepted', 'rejected', 'question'];
  const [showForm, setShowForm] = useState(false);
  const [mechanics, setMechanics] = useState([]);
  const [formData, setFormData] = useState({ description: '', mechanicId: '' });

  useEffect(() => {
    const fetchRequests = async () => {
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
    };
    if (mechanicId && token) fetchRequests();
  }, [mechanicId, token]);

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const res = await fetch('/api/list/mechanics');
        if (!res.ok) throw new Error('Failed to fetch mechanics');
        const data = await res.json();
        setMechanics(data);
      } catch (err) {
        setMechanics([]);
      }
    };
    fetchMechanics();
  }, []);

  const handleFormChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    const customerId = localStorage.getItem('customerId');
    try {
      const res = await fetch('/api/serviceRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          description: formData.description,
          mechanicId: formData.mechanicId
        })
      });
      if (!res.ok) throw new Error('Failed to create request');
      const newRequest = await res.json();
      setRequests([...requests, newRequest]);
      setShowForm(false);
      setFormData({ description: '', mechanicId: '' });
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

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
      <button onClick={() => setShowForm(true)} style={{marginBottom:'12px'}}>New Service Request</button>
      {showForm && (
        <form onSubmit={handleFormSubmit} style={{ margin: '20px 0', background: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              required
              style={{ marginLeft: '10px', width: '60%' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Mechanic:</label>
            <select
              name="mechanicId"
              value={formData.mechanicId}
              onChange={handleFormChange}
              required
              style={{ marginLeft: '10px' }}
            >
              <option value="">Select Mechanic</option>
              {mechanics.map(m => (
                <option key={m._id || m.id} value={m._id || m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <button type="submit">Submit Request</button>
          <button type="button" onClick={() => setShowForm(false)} style={{ marginLeft: '10px' }}>Cancel</button>
        </form>
      )}
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
            <button onClick={() => handleUpdate(r.serviceRequestId)} style={{ marginLeft: '10px', background:'#4CAF50',color:'white',border:'none',padding:'6px 12px',borderRadius:'4px',cursor:'pointer' }}>
              Update
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}