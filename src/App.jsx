import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AdminGate from './components/AdminGate';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdmin(window.location.hash === '#admin');
    };
    handleHashChange(); // check on mount
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      {isAdmin ? <AdminGate /> : <Layout />}
    </>
  );
}

export default App;
