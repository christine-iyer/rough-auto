import React, { useState } from 'react';
import UploadWidget from './UploadWidget';

export default function MechanicSignup({ onSignup }) {
  const [form, setForm] = useState({
    mechanicName: '',
    email: '',
    password: '',
    services: [],
    notes: '',
    files: [] // <-- store uploaded URLs here
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleServiceChange = e => {
    const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setForm({ ...form, services: options });
  };

  // Cloudinary upload handler
  const handleUpload = (error, result) => {
    if (!error && result.event === 'success') {
      const url = result.info.secure_url;
      setForm(f => ({
        ...f,
        files: [...f.files, url]
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    const payload = {
      mechanicName: form.mechanicName,
      email: form.email,
      password: form.password,
      services: form.services,
      notes: form.notes,
      files: form.files // <-- send files array to backend
    };
    try {
      const res = await fetch('/api/auth/signup/mechanic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Signup failed');
      setSuccess(true);
      onSignup();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Mechanic Signup</h2>
      <div>
        <label>Mechanic signup requires admin approval. If you have approval, please provide the necessary details. If you do not have approval, please contact an admin.</label>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Name:</label><br />
          <input type="text" name="mechanicName" value={form.mechanicName} onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Email:</label><br />
          <input type="email" name="email" value={form.email} onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password:</label><br />
          <input type="password" name="password" value={form.password} onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Services Provided:</label><br />
          <select multiple name="services" value={form.services} onChange={handleServiceChange} style={{ width: '100%', height: 100 }}>
            <option value="Oil Change">Oil Change</option>
            <option value="Tune Up">Tune Up</option>
            <option value="Flat Fix">Flat Fix</option>
            <option value="Tow">Tow</option>
            <option value="Gas">Gas</option>
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Upload Documents/Photos:</label><br />
          <UploadWidget onUpload={handleUpload}>
            {({ open }) => (
              <button type="button" onClick={open}>
                Upload Photo
              </button>
            )}
          </UploadWidget>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {form.files.map((url, idx) => (
              <img key={idx} src={url} alt="Uploaded" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }} />
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Miscellaneous Notes:</label><br />
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} style={{ width: '100%' }} placeholder="Add any important notes here..." />
        </div>
        <button type="submit" style={{ width: '100%', padding: '8px 0', background: '#2196F3', color: 'white', border: 'none', borderRadius: 4 }}>Sign Up</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: 10 }}>Signup successful! Redirecting to login...</div>}
    </div>
  );
}