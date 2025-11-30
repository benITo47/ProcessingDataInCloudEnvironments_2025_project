import React, { useState } from 'react';
import { searchRecipes } from '../api';
import { Recipe } from '../types';

interface SearchTabProps {
  allIngredients: string[];
}

const SearchTab: React.FC<SearchTabProps> = ({ allIngredients }) => {
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toggleIngredient = (ingredient: string) => {
    const newSelection = new Set(selectedIngredients);
    if (newSelection.has(ingredient)) {
      newSelection.delete(ingredient);
    } else {
      newSelection.add(ingredient);
    }
    setSelectedIngredients(newSelection);
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setRecipes(null);
    try {
      const foundRecipes = await searchRecipes(Array.from(selectedIngredients));
      setRecipes(foundRecipes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="selection-section">
        <h2>Select Ingredients You Have:</h2>
        <div className="ingredients-grid">
          {allIngredients.map((ing) => (
            <div
              key={ing}
              className={`ingredient-card ${selectedIngredients.has(ing) ? 'selected' : ''}`}
              onClick={() => toggleIngredient(ing)}
            >
              {ing}
            </div>
          ))}
        </div>
        <button
          className="search-btn"
          onClick={handleSearch}
          disabled={loading || selectedIngredients.size === 0}
        >
          {loading ? 'Finding...' : 'Find Recipes 🔎'}
        </button>
      </section>

      {error && <div className="error-message">{error}</div>}

      {recipes && (
        <section className="results-section">
          <h2>Recommended Recipes</h2>
          {recipes.length === 0 ? (
            <div className="no-results">
              <p>No matching recipes found.</p>
              <small>Try selecting more ingredients or adding a new recipe.</small>
            </div>
          ) : (
            <div className="recipes-list">
              {recipes.map((recipe) => (
                <div key={recipe.name} className="recipe-card">
                  <div className="card-header">
                    <h3>{recipe.name}</h3>
                    <span
                      className={`badge ${
                        recipe.missingCount === 0 ? 'badge-green' : 'badge-yellow'
                      }`}
                    >
                      {recipe.missingCount === 0
                        ? 'Ready to Cook!'
                        : `Missing ${recipe.missingCount}`}
                    </span>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Requires:</strong> {recipe.ingredients.join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default SearchTab;