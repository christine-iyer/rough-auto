import React, { useEffect, useState } from 'react';

export default function ServiceRequests({ mechanicId, token }) {
     const [requests, setRequests] = useState([]);
     const [error, setError] = useState('');
     const [editStatus, setEditStatus] = useState({});
     const statusOptions = ['pending', 'accepted', 'rejected', 'question'];
     const [showForm, setShowForm] = useState(false);
     const [services, setServices] = useState([]);
     const [selectedService, setSelectedService] = useState('');
     const [mechanics, setMechanics] = useState([]);
     const [formData, setFormData] = useState({
          description: '',
          mechanicId: '',
          service: '',
          vehicleMake: '',
          vehicleModel: '',
          vehicleYear: ''
     });

     useEffect(() => {
          const fetchRequests = async () => {
               try {
                    const res = await fetch(`/api/service-request/mechanic/${mechanicId}`, {
                         headers: token ? { Authorization: `Bearer ${token}` } : {}
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

     // Fetch available services
     useEffect(() => {
          const fetchServices = async () => {
               try {
                    const res = await fetch('/api/services', {
                         headers: token ? { Authorization: `Bearer ${token}` } : {}
                    });
                    if (!res.ok) throw new Error('Failed to fetch services');
                    const data = await res.json();
                    setServices(data);
               } catch (err) {
                    setServices([]);
               }
          };
          fetchServices();
     }, [token]);

     // Fetch mechanics for selected service
     useEffect(() => {
          const fetchMechanics = async () => {
               if (!selectedService) {
                    setMechanics([]);
                    return;
               }
               try {
                    const res = await fetch(
                         `/api/list/mechanics?service=${encodeURIComponent(selectedService)}`,
                         {
                              headers: token ? { Authorization: `Bearer ${token}` } : {}
                         }
                    );
                    if (!res.ok) throw new Error('Failed to fetch mechanics');
                    const data = await res.json();
                    setMechanics(data);
               } catch (err) {
                    setMechanics([]);
               }
          };
          fetchMechanics();
     }, [selectedService, token]);

     const handleFormChange = e => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
          if (e.target.name === 'service') {
               setSelectedService(e.target.value);
               setFormData(prev => ({ ...prev, mechanicId: '' })); // reset mechanic selection
          }
     };

     const handleFormSubmit = async e => {
          e.preventDefault();
          const customerId = localStorage.getItem('customerId');
          try {
               const res = await fetch('/api/service-request', {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                         Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                         customerId,
                         description: formData.description,
                         mechanicId: formData.mechanicId,
                         service: formData.service,
                         vehicle: {
                              vehicleMake: formData.vehicleMake,
                              vehicleModel: formData.vehicleModel,
                              vehicleYear: formData.vehicleYear
                         }
                    })
               });
               if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(`Failed to create request: ${res.status} ${errText}`);
               }
               const newRequest = await res.json();
               setRequests([...requests, newRequest]);
               setShowForm(false);
               setFormData({
                    description: '',
                    mechanicId: '',
                    service: '',
                    vehicleMake: '',
                    vehicleModel: '',
                    vehicleYear: ''
               });
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

     // Filter mechanics to only those who offer the selected service
     const filteredMechanics = mechanics.filter(m =>
          Array.isArray(m.services) &&
          m.services.length > 0 &&
          selectedService &&
          m.services.includes(selectedService)
     );

     return (
          <div>
               <h2>Service Requests</h2>
               <button onClick={() => setShowForm(true)} style={{ marginBottom: '12px' }}>New Service Request</button>
               {showForm && (
                    <form onSubmit={handleFormSubmit} style={{ margin: '20px 0', background: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
                         <div style={{ marginBottom: '10px' }}>
                              <label>Service:</label>
                              <select
                                   name="service"
                                   value={formData.service}
                                   onChange={handleFormChange}
                                   required
                                   style={{ marginLeft: '10px' }}
                              >
                                   <option value="">Select Service</option>
                                   {services.length === 0 && (
                                        <option disabled>No services available</option>
                                   )}
                                   {services.map((s, idx) => (
                                        <option
                                             key={typeof s === 'string' ? s : (s._id || s.id || `${s.name}-${idx}`)}
                                             value={typeof s === 'string' ? s : (s.name || s.service || '')}
                                        >
                                             {typeof s === 'string' ? s : (s.name || s.service || 'Unnamed Service')}
                                        </option>
                                   ))}
                              </select>
                         </div>
                         {/* Show filtered mechanics list after service selection */}
                         {selectedService && filteredMechanics.length > 0 && (
                              <div style={{ marginBottom: '10px', background: '#f1f1f1', padding: '8px', borderRadius: '6px' }}>
                                   <strong>Mechanics who perform "{selectedService}":</strong>
                                   <ul style={{ margin: '8px 0 0 0', paddingLeft: '18px' }}>
                                        {filteredMechanics.map((m, idx) => (
                                             <li key={m._id || m.id || `${m.name}-${idx}`}>
                                                  {m.name || m.email || 'Unnamed Mechanic'}
                                             </li>
                                        ))}
                                   </ul>
                              </div>
                         )}
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
                              <label>Vehicle Make:</label>
                              <input
                                   type="text"
                                   name="vehicleMake"
                                   value={formData.vehicleMake}
                                   onChange={handleFormChange}
                                   required
                                   style={{ marginLeft: '10px', width: '40%' }}
                              />
                         </div>
                         <div style={{ marginBottom: '10px' }}>
                              <label>Vehicle Model:</label>
                              <input
                                   type="text"
                                   name="vehicleModel"
                                   value={formData.vehicleModel}
                                   onChange={handleFormChange}
                                   required
                                   style={{ marginLeft: '10px', width: '40%' }}
                              />
                         </div>
                         <div style={{ marginBottom: '10px' }}>
                              <label>Vehicle Year:</label>
                              <input
                                   type="text"
                                   name="vehicleYear"
                                   value={formData.vehicleYear}
                                   onChange={handleFormChange}
                                   required
                                   style={{ marginLeft: '10px', width: '40%' }}
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
                                   disabled={!selectedService}
                              >
                                   <option value="">Select Mechanic</option>
                                   {filteredMechanics.length === 0 && (
                                        <option disabled>No mechanics available for this service</option>
                                   )}
                                   {filteredMechanics.map((m, idx) => (
                                        <option
                                             key={m._id || m.id || `${m.name}-${idx}`}
                                             value={m._id || m.id || ''}
                                        >
                                             {m.name || m.email || 'Unnamed Mechanic'}
                                        </option>
                                   ))}
                              </select>
                         </div>
                         <button type="submit">Submit Request</button>
                         <button type="button" onClick={() => setShowForm(false)} style={{ marginLeft: '10px' }}>Cancel</button>
                    </form>
               )}
               {error && <div style={{ color: 'red' }}>{error}</div>}
               <ul>
                    {requests.map(r => (
                         <li key={r._id || r.serviceRequestId || r.id}>
                              {r.description || 'No description'} - Status: {r.status}
                              <select
                                   value={editStatus[r._id || r.serviceRequestId || r.id] || r.status}
                                   onChange={e => handleStatusChange(r._id || r.serviceRequestId || r.id, e.target.value)}
                                   style={{ marginLeft: '10px' }}
                              >
                                   {statusOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                   ))}
                              </select>
                              <button onClick={() => handleUpdate(r._id || r.serviceRequestId || r.id)} style={{ marginLeft: '10px', background: '#4CAF50', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                                   Update
                              </button>
                         </li>
                    ))}
               </ul>
          </div>
     );
}