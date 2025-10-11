import React, { useState, useEffect } from 'react';

function MechanicDashboard({ mechanicId }) {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ mechanicName: '', email: '', services: [], notes: '', files: [] });
  const [profileMsg, setProfileMsg] = useState('');
  const [questionInput, setQuestionInput] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setError('');
    fetch(`/api/service-request/mechanic/${mechanicId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch requests');
        return res.json();
      })
      .then(data => {
        setPendingRequests(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError('Error loading requests: ' + err.message);
        setLoading(false);
      });
    // Fetch mechanic profile from correct route
    fetch(`/api/edit-mechanic/${mechanicId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) {
          setProfile(null);
          setError('Error loading profile');
          return;
        }
        try {
          const data = await res.json();
          setProfile(data);
          setForm({
            mechanicName: data.mechanicName || '',
            email: data.email || '',
            services: Array.isArray(data.services) ? data.services : [],
            notes: data.notes || '',
            files: Array.isArray(data.files) ? data.files : []
          });
        } catch {
          setProfile(null);
          setError('Error parsing profile data');
        }
      })
      .catch(err => {
        setProfile(null);
        setError('Error loading profile: ' + err.message);
      });
  }, [mechanicId]);

  if (loading) return <div>Loading dashboard...</div>;

  const handleProfileChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleServicesChange = e => {
    const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setForm(f => ({ ...f, services: options }));
  };

  const handleProfileSubmit = async e => {
    e.preventDefault();
    setProfileMsg('');
    setError('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/edit-mechanic/${mechanicId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const updated = await res.json();
      setProfile(updated);
      setEditMode(false);
      setProfileMsg('Profile updated successfully!');
    } catch (err) {
      setProfileMsg('');
      setError('Error updating profile: ' + err.message);
    }
  };

  // Debug: log pendingRequests and mechanicId
  console.log('pendingRequests:', pendingRequests);
  console.log('mechanicId:', mechanicId);

  // Remove the filter, use pendingRequests directly

  // PATCH request to update status or add question
  const handleRequestAction = async (reqId, action, questionText) => {
    const token = localStorage.getItem('token');
    let body = {};
    if (action === 'accept' || action === 'reject' || action === 'question') {
      body.status = action === 'question' ? 'question' : action;
      if (action === 'question' && questionText) body.question = questionText;
    }
    setError('');
    try {
      const res = await fetch(`/api/service-request/${reqId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to update request');
      }
      const updated = await res.json();
      setPendingRequests(prev =>
        prev.map(r => r._id === updated._id ? updated : r)
      );
    } catch (err) {
      setError('Error updating request: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>Mechanic Dashboard</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {/* Debug output */}
      <div style={{ fontSize: '0.8em', color: '#888', marginBottom: 12 }}>
        <strong>Debug:</strong>
        <pre>{JSON.stringify({ mechanicId, pendingRequests }, null, 2)}</pre>
      </div>
      <section style={{ marginBottom: 32 }}>
        <h3>Profile</h3>
        {profile && !editMode ? (
          <div style={{ marginBottom: 12 }}>
            <div><strong>Name:</strong> {profile.mechanicName}</div>
            <div><strong>Email:</strong> {profile.email}</div>
            <div><strong>Services:</strong> {profile.services && profile.services.join(', ')}</div>
            <div><strong>Notes:</strong> {profile.notes}</div>
            <button onClick={() => {
              // Always set form state from latest profile data
              setForm({
                mechanicName: profile.mechanicName || '',
                email: profile.email || '',
                services: Array.isArray(profile.services) ? profile.services : [],
                notes: profile.notes || '',
                files: Array.isArray(profile.files) ? profile.files : []
              });
              setEditMode(true);
            }}>Edit Profile</button>
            {profileMsg && <div style={{ color: 'green', marginTop: 8 }}>{profileMsg}</div>}
          </div>
        ) : (
          <form onSubmit={handleProfileSubmit} style={{ marginBottom: 12 }}>
            <div>
              <label>Name: <input name="mechanicName" value={form.mechanicName} onChange={handleProfileChange} required /></label>
            </div>
            <div>
              <label>Email: <input name="email" value={form.email} onChange={handleProfileChange} required /></label>
            </div>
            <div>
              <label>Services:
                <select name="services" multiple value={form.services} onChange={handleServicesChange}>
                  <option value="Oil Change">Oil Change</option>
                  <option value="Brake Repair">Brake Repair</option>
                  <option value="Engine Diagnostics">Engine Diagnostics</option>
                  <option value="Transmission">Transmission</option>
                  <option value="Tire Service">Tire Service</option>
                  <option value="Other">Other</option>
                </select>
                <div style={{ fontSize: '0.9em', color: '#888', marginTop: 4 }}>
                  Current: {form.services.length ? form.services.join(', ') : 'None'}
                </div>
              </label>
            </div>
            <div>
              <label>Notes: <textarea name="notes" value={form.notes} onChange={handleProfileChange} /></label>
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditMode(false)} style={{ marginLeft: 8 }}>Cancel</button>
            {profileMsg && <div style={{ color: 'red', marginTop: 8 }}>{profileMsg}</div>}
          </form>
        )}
      </section>
      <section style={{ marginBottom: 32 }}>
        <h3>Pending Requests</h3>
        {pendingRequests.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          <ul>
            {pendingRequests.map(req => (
              <li key={req._id}>
                <strong>{req.customer?.customerName || 'Customer'}</strong>: {req.description}
                <div style={{ marginTop: 8 }}>
                  <button onClick={() => handleRequestAction(req._id, 'accept')}>Accept</button>
                  <button onClick={() => handleRequestAction(req._id, 'reject')} style={{ marginLeft: 8 }}>Reject</button>
                  <input
                    type="text"
                    placeholder="Ask a question"
                    value={questionInput[req._id] || ''}
                    onChange={e => setQuestionInput(q => ({ ...q, [req._id]: e.target.value }))}
                    style={{ marginLeft: 8, width: '40%' }}
                  />
                  <button
                    onClick={() => handleRequestAction(req._id, 'question', questionInput[req._id])}
                    style={{ marginLeft: 4 }}
                  >
                    Ask
                  </button>
                </div>
                {req.status === 'question' && req.question && (
                  <div style={{ color: '#888', marginTop: 4 }}>
                    <strong>Question:</strong> {req.question}
                  </div>
                )}
                <div style={{ fontSize: '0.9em', color: '#888', marginTop: 4 }}>
                  Status: {req.status}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
export default MechanicDashboard;