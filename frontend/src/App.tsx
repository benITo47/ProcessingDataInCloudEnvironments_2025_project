import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { fetchIngredients } from './api';

import Nav from './components/Nav';
import SearchTab from './components/SearchTab';
import AdminTab from './components/admin/AdminTab';

import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('search');
  const [allIngredients, setAllIngredients] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadIngredients = async () => {
    setError(null);
    try {
      const ingredients = await fetchIngredients();
      setAllIngredients(ingredients.sort());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ingredients.');
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'search':
        return <SearchTab allIngredients={allIngredients} />;
      case 'admin':
        return <AdminTab allIngredients={allIngredients} onDataChange={loadIngredients} />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🍳 Fridge Helper</h1>
        <Nav activeTab={activeTab} setActiveTab={setActiveTab} />
      </header>
      <main>
        {error && <p className="error-message">{error}</p>}
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default App;
