import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Admin from './components/Admin';

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
      {isAdmin ? <Admin /> : <Layout />}
    </>
  );
}

export default App;
