import React, { useEffect, useState } from 'react';

function MechanicList() {
    const [mechanics, setMechanics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rawResponse, setRawResponse] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('/api/list/mechanics', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(async (res) => {
                const text = await res.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    data = text;
                }
                setRawResponse(data);
                if (!res.ok) throw new Error('Failed to fetch mechanics: ' + JSON.stringify(data));
                setMechanics(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading mechanics...</div>;
    if (error) return (
        <div>
            <div>Error: {error}</div>
            <div>Raw response: <pre>{JSON.stringify(rawResponse, null, 2)}</pre></div>
        </div>
    );

    return (
        <div>
            <h2>Mechanic List</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {mechanics.length === 0 ? (
                    <p>No mechanics found.</p>
                ) : (
                    mechanics.map((mechanic) => (
                        <div
                            key={mechanic._id || mechanic.id}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: '16px',
                                width: '250px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                                background: '#fff',
                            }}
                        >
                            <h3 style={{ margin: '0 0 8px 0' }}>{mechanic.mechanicName}</h3>
                            <p style={{ margin: '0 0 8px 0', color: '#555' }}>{mechanic.email}</p>
                            <strong>Services:</strong>
                            <ul>
                                {mechanic.services && mechanic.services.length > 0 ? (
                                    mechanic.services.map((service, idx) => (
                                        <li key={idx}>{service}</li>
                                    ))
                                ) : (
                                    <li>No services listed</li>
                                )}
                            </ul>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default MechanicList;