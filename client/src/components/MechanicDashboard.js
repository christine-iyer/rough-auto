import React, { useEffect, useState } from 'react';

function MechanicDashboard({ mechanicId }) {
    const [mechanic, setMechanic] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editForm, setEditForm] = useState({ mechanicName: '', email: '', services: [] });
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        // Fetch mechanic info
        fetch(`/api/mechanics/${mechanicId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setMechanic(data);
                setEditForm({
                    mechanicName: data.mechanicName,
                    email: data.email,
                    services: data.services || []
                });
                setLoading(false);
            });
        // Fetch pending requests
        fetch(`/api/service-request/mechanic/${mechanicId}?status=pending`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setPendingRequests(data));
    }, [mechanicId]);

    const handleEditChange = e => {
        const { name, value } = e.target;
        setEditForm(f => ({ ...f, [name]: value }));
    };

    const handleServicesChange = idx => e => {
        const newServices = [...editForm.services];
        newServices[idx] = e.target.value;
        setEditForm(f => ({ ...f, services: newServices }));
    };

    const handleEditSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/mechanic/${mechanicId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editForm)
        });
        if (res.ok) {
            setMessage('Info updated!');
            setEditMode(false);
            const updated = await res.json();
            setMechanic(updated);
        } else {
            setMessage('Failed to update info.');
        }
    };

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
            <h2>Mechanic Dashboard</h2>
            {/* Message Board */}
            <section style={{ marginBottom: 32 }}>
                <h3>Pending Requests</h3>
                {pendingRequests.length === 0 ? (
                    <p>No pending requests.</p>
                ) : (
                    <ul>
                        {pendingRequests.map(req => (
                            <li key={req._id}>
                                <strong>{req.customerName}</strong>: {req.description}
                                {/* Add buttons to respond/accept/decline as needed */}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
            {/* Edit Info Section */}
            <section>
                <h3>Edit Your Information</h3>
                {editMode ? (
                    <form onSubmit={handleEditSubmit}>
                        <div>
                            <label>Name:</label>
                            <input
                                type="text"
                                name="mechanicName"
                                value={editForm.mechanicName}
                                onChange={handleEditChange}
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={editForm.email}
                                onChange={handleEditChange}
                            />
                        </div>
                        <div>
                            <label>Services:</label>
                            {editForm.services.map((service, idx) => (
                                <input
                                    key={idx}
                                    type="text"
                                    value={service}
                                    onChange={handleServicesChange(idx)}
                                    style={{ marginRight: 8 }}
                                />
                            ))}
                        </div>
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
                    </form>
                ) : (
                    <div>
                        <p><strong>Name:</strong> {mechanic.mechanicName}</p>
                        <p><strong>Email:</strong> {mechanic.email}</p>
                        <p><strong>Services:</strong> {mechanic.services && mechanic.services.join(', ')}</p>
                        <button onClick={() => setEditMode(true)}>Edit Info</button>
                    </div>
                )}
                {message && <div style={{ marginTop: 8, color: 'green' }}>{message}</div>}
            </section>
        </div>
    );
}

export default MechanicDashboard;