import React, { useState, useEffect } from 'react';
import { adminLogin, fetchAdminRecipes } from '../../api';
import { AdminRecipe } from '../../types';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';

interface AdminTabProps {
  allIngredients: string[];
  onDataChange: () => void;
}

const AdminTab: React.FC<AdminTabProps> = ({ allIngredients, onDataChange }) => {
  const [password, setPassword] = useState<string | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminRecipes, setAdminRecipes] = useState<AdminRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (pass: string) => {
    setError(null);
    try {
      await adminLogin(pass);
      setPassword(pass);
      setIsAdminLoggedIn(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid password');
      setIsAdminLoggedIn(false);
    }
  };

  const fetchAndSetAdminData = async () => {
    if (!password) return;
    setLoading(true);
    setError(null);
    try {
      const recipes = await fetchAdminRecipes(password);
      setAdminRecipes(recipes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchAndSetAdminData();
    }
  }, [isAdminLoggedIn]);
  
  const handleDataChange = () => {
    fetchAndSetAdminData(); // Refetch admin recipes
    onDataChange(); // Refetch all ingredients from App
  }

  if (loading && !adminRecipes.length) return <p>Loading Admin Data...</p>;

  if (!isAdminLoggedIn || !password) {
    return <AdminLogin onLogin={handleLogin} error={error} />;
  }

  return (
    <AdminPanel
      password={password}
      adminRecipes={adminRecipes}
      allIngredients={allIngredients}
      onDataChange={handleDataChange}
      error={error}
      setError={setError}
    />
  );
};

export default AdminTab;