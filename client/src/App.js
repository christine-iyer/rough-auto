
import React, { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import ServiceRequests from './ServiceRequests';

function App() {
  const [page, setPage] = useState('signup');
  const [token, setToken] = useState('');
  const [mechanicId, setMechanicId] = useState('');

  const handleSignup = () => setPage('login');
  const handleLogin = (token, mechanicId) => {
    setToken(token);
    setMechanicId(mechanicId);
    setPage('requests');
  };
  const handleLogout = () => {
    setToken('');
    setMechanicId('');
    setPage('login');
  };

  return (
    <div className="App">
      <nav>
        {page === 'signup' && <button onClick={() => setPage('login')}>Go to Login</button>}
        {page === 'login' && <button onClick={() => setPage('signup')}>Go to Signup</button>}
        {page === 'requests' && <button onClick={handleLogout}>Logout</button>}
      </nav>
      {page === 'signup' && <Signup onSignup={handleSignup} />}
      {page === 'login' && <Login onLogin={handleLogin} />}
      {page === 'requests' && <ServiceRequests mechanicId={mechanicId} token={token} />}
    </div>
  );
}

export default App;
