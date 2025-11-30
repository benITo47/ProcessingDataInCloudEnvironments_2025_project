const neo4jService = require('../services/neo4jService');

async function getIngredients(req, res) {
  try {
    const ingredients = await neo4jService.getIngredients();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ingredients" });
  }
}

async function searchRecipes(req, res) {
  const { myIngredients } = req.body;
  if (!myIngredients || !Array.isArray(myIngredients)) {
    return res.status(400).json({ error: "Ingredients must be an array." });
  }
  try {
    const recipes = await neo4jService.searchRecipes(myIngredients);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to search for recipes" });
  }
}

module.exports = {
  getIngredients,
  searchRecipes,
};
