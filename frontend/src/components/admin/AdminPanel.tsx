import React, { useState, FormEvent } from 'react';
import { AdminRecipe } from '../../types';
import { addRecipe, updateRecipe, deleteRecipe, deleteIngredient } from '../../api';
import EditRecipeForm from './EditRecipeForm';

interface AdminPanelProps {
  password: string;
  adminRecipes: AdminRecipe[];
  allIngredients: string[];
  onDataChange: () => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ password, adminRecipes, allIngredients, onDataChange, error, setError }) => {
  const [loading, setLoading] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<AdminRecipe | null>(null);
  
  // State for the new "Add Recipe" form
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newRecipeIngredients, setNewRecipeIngredients] = useState('');

  const handleAddRecipe = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const ingredientsArray = newRecipeIngredients.split(',').map((item) => item.trim()).filter(Boolean);
      // We use the authenticated addRecipe function now
      await addRecipe(password, newRecipeName, ingredientsArray);
      
      alert('Recipe added successfully!');
      setNewRecipeName('');
      setNewRecipeIngredients('');
      onDataChange(); // This will trigger a refetch
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRecipe = async (updatedRecipe: AdminRecipe) => {
    setError(null);
    try {
      await updateRecipe(password, updatedRecipe.name, updatedRecipe.name, updatedRecipe.ingredients);
      setEditingRecipe(null);
      onDataChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update recipe');
    }
  };

  const handleDeleteRecipe = async (recipeName: string) => {
    if (window.confirm(`Are you sure you want to delete the recipe "${recipeName}"?`)) {
      setLoading(true);
      setError(null);
      try {
        await deleteRecipe(password, recipeName);
        onDataChange();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete recipe.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteIngredient = async (ingredientName: string) => {
    if (window.confirm(`Are you sure you want to delete the ingredient "${ingredientName}"? This cannot be undone.`)) {
      setLoading(true);
      setError(null);
      try {
        await deleteIngredient(password, ingredientName);
        onDataChange();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete ingredient.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (editingRecipe) {
    return <EditRecipeForm recipe={editingRecipe} onUpdate={handleUpdateRecipe} onCancel={() => setEditingRecipe(null)} />;
  }

  return (
    <section className="admin-panel">
      <h2>Admin Panel</h2>
      {error && <p className="error-message">{error}</p>}

      {/* Add Recipe Form */}
      <div className="admin-section add-recipe-form">
          <h3>Add New Recipe</h3>
          <form onSubmit={handleAddRecipe} className="add-form">
            <div className="form-group">
              <label htmlFor="recipeName">Recipe Name:</label>
              <input
                id="recipeName"
                type="text"
                placeholder="e.g., Tuna Pasta"
                value={newRecipeName}
                onChange={(e) => setNewRecipeName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="ingredients">Ingredients (comma-separated):</label>
              <textarea
                id="ingredients"
                placeholder="e.g., Tuna, Pasta, Mayonnaise"
                value={newRecipeIngredients}
                onChange={(e) => setNewRecipeIngredients(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save New Recipe'}
            </button>
          </form>
      </div>
      
      <div className="admin-container">
        <div className="admin-section">
          <h3>Manage Recipes ({adminRecipes.length})</h3>
          <ul className="admin-list">
            {adminRecipes.map(recipe => (
              <li key={recipe.name}>
                <span>{recipe.name} <small>({recipe.ingredients.length} ingredients)</small></span>
                <div className="admin-actions">
                  <button onClick={() => setEditingRecipe(recipe)}>Edit</button>
                  <button onClick={() => handleDeleteRecipe(recipe.name)} className="danger">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="admin-section">
          <h3>Manage Ingredients ({allIngredients.length})</h3>
          <ul className="admin-list">
            {allIngredients.map(ing => (
              <li key={ing}>
                <span>{ing}</span>
                <div className="admin-actions">
                  <button onClick={() => handleDeleteIngredient(ing)} className="danger" disabled={loading}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;