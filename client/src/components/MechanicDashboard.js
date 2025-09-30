import React, { useState, useEffect } from 'react';

function MechanicDashboard({ mechanicId }) {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ mechanicName: '', email: '', services: [], notes: '', files: [] });
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`/api/service-request/mechanic/${mechanicId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setPendingRequests(Array.isArray(data) ? data : []);
        setLoading(false);
      });
    // Fetch mechanic profile
    fetch(`/api/list/mechanics/${mechanicId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setForm({
          mechanicName: data.mechanicName || '',
          email: data.email || '',
          services: data.services || [],
          notes: data.notes || '',
          files: data.files || []
        });
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
      setProfileMsg('Error: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>Mechanic Dashboard</h2>
      <section style={{ marginBottom: 32 }}>
        <h3>Profile</h3>
        {profile && !editMode ? (
          <div style={{ marginBottom: 12 }}>
            <div><strong>Name:</strong> {profile.mechanicName}</div>
            <div><strong>Email:</strong> {profile.email}</div>
            <div><strong>Services:</strong> {profile.services && profile.services.join(', ')}</div>
            <div><strong>Notes:</strong> {profile.notes}</div>
            <button onClick={() => {
              setForm({
                mechanicName: profile.mechanicName || '',
                email: profile.email || '',
                services: profile.services || [],
                notes: profile.notes || '',
                files: profile.files || []
              });
              setEditMode(true);
            }}>Edit Profile</button>
            {profileMsg && <div style={{ color: 'green', marginTop: 8 }}>{profileMsg}</div>}
          </div>
        ) : (
          <form onSubmit={handleProfileSubmit} style={{ marginBottom: 12 }}>
            <div>
              <label>Name: <input name="mechanicName" value={form.mechanicName} onChange={handleProfileChange} required placeholder={profile?.mechanicName || ''} /></label>
            </div>
            <div>
              <label>Email: <input name="email" value={form.email} onChange={handleProfileChange} required placeholder={profile?.email || ''} /></label>
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
                  Current: {profile?.services?.length ? profile.services.join(', ') : 'None'}
                </div>
              </label>
            </div>
            <div>
              <label>Notes: <textarea name="notes" value={form.notes} onChange={handleProfileChange} placeholder={profile?.notes || ''} /></label>
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditMode(false)} style={{ marginLeft: 8 }}>Cancel</button>
            {profileMsg && <div style={{ color: 'red', marginTop: 8 }}>{profileMsg}</div>}
          </form>
        )}
      </section>
      <section style={{ marginBottom: 32 }}>
        <h3>Pending Requests</h3>
        {Array.isArray(pendingRequests) && pendingRequests.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          Array.isArray(pendingRequests) && (
            <ul>
              {pendingRequests.map(req => (
                <li key={req._id}>
                  <strong>{req.customer?.customerName || 'Customer'}</strong>: {req.description}
                  {/* Add buttons to respond/accept/decline as needed */}
                </li>
              ))}
            </ul>
          )
        )}
      </section>
    </div>
  );
}
export default MechanicDashboard;