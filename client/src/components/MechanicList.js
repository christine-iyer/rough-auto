
import React, { useEffect, useState } from 'react';

function MechanicList() {
		const [mechanics, setMechanics] = useState([]);
		const [loading, setLoading] = useState(true);
		const [error, setError] = useState(null);
		const [rawResponse, setRawResponse] = useState(null);

		useEffect(() => {
			const token = localStorage.getItem('token');
				fetch('http://localhost:5001/api/list/mechanics', {
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
				<div>Raw response: <pre>{JSON.stringify(rawResponse, null, 2)}</pre></div>
				{mechanics.length === 0 ? (
					<p>No mechanics found.</p>
				) : (
					<ul>
						{mechanics.map((mechanic) => (
							<li key={mechanic._id || mechanic.id}>
								{mechanic.mechanicName} ({mechanic.email})
							</li>
						))}
					</ul>
				)}
			</div>
		);
}

export default MechanicList;
