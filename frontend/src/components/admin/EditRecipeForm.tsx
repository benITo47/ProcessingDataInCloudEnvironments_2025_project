import React, { useState, FormEvent } from 'react';
import { AdminRecipe } from '../../types';

interface EditRecipeFormProps {
  recipe: AdminRecipe;
  onUpdate: (updatedRecipe: AdminRecipe) => Promise<void>;
  onCancel: () => void;
}

const EditRecipeForm: React.FC<EditRecipeFormProps> = ({ recipe, onUpdate, onCancel }) => {
  const [ingredients, setIngredients] = useState(recipe.ingredients.join(', '));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onUpdate({
      ...recipe,
      ingredients: ingredients.split(',').map((s: string) => s.trim()).filter(Boolean),
    });
    setLoading(false);
  };

  return (
    <div className="admin-panel">
      <h2>Edit Recipe: {recipe.name}</h2>
      <form onSubmit={handleSubmit} className="add-form">
        <div className="form-group">
          <label>Recipe Name (read-only):</label>
          <input type="text" value={recipe.name} readOnly />
        </div>
        <div className="form-group">
          <label>Ingredients (comma-separated):</label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            rows={4}
          />
        </div>
        <div className="form-group form-actions">
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="search-btn secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipeForm;