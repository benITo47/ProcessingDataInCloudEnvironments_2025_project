import React from 'react';
import { ActiveTab } from '../types';

interface NavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const Nav: React.FC<NavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="tabs">
      <button
        className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
        onClick={() => setActiveTab('search')}
      >
        Find Recipes
      </button>
      <button
        className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
        onClick={() => setActiveTab('admin')}
      >
        Admin
      </button>
    </nav>
  );
};

export default Nav;