import React, { useState } from 'react';
import Login from './components/Login';
import MechanicList  from './components/MechanicList';
import CustomerSignup from './components/CustomerSignup';
import MechanicSignup from './components/MechanicSignup';
import AdminSignup from './components/AdminSignup';

function App() {
  const [page, setPage] = useState('home');
  const [token, setToken] = useState('');
  const [mechanicId, setMechanicId] = useState('');

  const handleSignup = () => setPage('login');
  const handleLogin = (token, mechanicId) => {
    setToken(token);
    setMechanicId(mechanicId || '');
    setPage('requests');
  };
  const handleLogout = () => {
    setToken('');
    setMechanicId('');
    setPage('home');
  };

  return (
    <div className="App">
      <nav>
        {page !== 'home' && <button onClick={() => setPage('home')}>Home</button>}
        {page === 'requests' && <button onClick={handleLogout}>Logout</button>}
      </nav>
      {page === 'home' && (
        <div style={{ margin: '40px auto', maxWidth: 400, textAlign: 'center' }}>
          <h2>Welcome! Who are you?</h2>
          <button style={{ margin: '10px' }} onClick={() => setPage('customer-signup')}>Customer Create Account</button>
          <button style={{ margin: '10px' }} onClick={() => setPage('mechanic-signup')}>Mechanic Create Account</button>
          <button style={{ margin: '10px' }} onClick={() => setPage('admin-signup')}>Admin Create Account</button>
          <button style={{ margin: '10px' }} onClick={() => setPage('login')}>Login</button>
          <button style={{ margin: '10px' }} onClick={() => setPage('list/mechanics')}>View Mechanics</button>
        </div>
      )}
      {page === 'customer-signup' && <CustomerSignup onSignup={handleSignup} />}
      {page === 'mechanic-signup' && <MechanicSignup onSignup={handleSignup} />}
      {page === 'admin-signup' && <AdminSignup onSignup={handleSignup} />}
      {page === 'login' && <Login onLogin={handleLogin} />}
      {page === 'list/mechanics' && <MechanicList />}
    </div>
  );
}

export default App;
