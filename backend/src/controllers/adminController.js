const neo4jService = require('../services/neo4jService');

function adminLogin(req, res) {
  const { password } = req.body;
  if (password && password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true, message: "Admin login successful" });
  } else {
    res.status(401).json({ success: false, error: "Invalid password" });
  }
}

async function getAdminRecipes(req, res) {
  try {
    const recipes = await neo4jService.getAdminRecipes();
    res.json(recipes);
  } catch (error) {
     res.status(500).json({ error: "Failed to fetch recipes for admin" });
  }
}

async function updateRecipe(req, res) {
  const { oldName, newName, ingredients } = req.body;
  if (!oldName || !newName || !ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: "Missing required fields: oldName, newName, ingredients" });
  }
  try {
    await neo4jService.updateRecipe(oldName, newName, ingredients);
    res.json({ message: `Recipe '${oldName}' updated to '${newName}'` });
  } catch (error) {
    res.status(500).json({ error: `Failed to update recipe: ${error.message}` });
  }
}

async function deleteRecipe(req, res) {
  const { name } = req.params;
  try {
    await neo4jService.deleteRecipe(name);
    res.json({ message: `Recipe '${name}' deleted successfully.` });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete recipe" });
  }
}

async function deleteIngredient(req, res) {
  const { name } = req.params;
  try {
    await neo4jService.deleteIngredient(name);
    res.json({ message: `Ingredient '${name}' deleted successfully.` });
  } catch (error) {
    // Catch specific error from service
    if (error.message.includes('Cannot delete ingredient')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to delete ingredient" });
  }
}

async function addRecipe(req, res) {
  const { name, ingredients } = req.body;
  if (!name || !ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: "Recipe name and ingredients array are required." });
  }
  try {
    await neo4jService.addRecipe(name, ingredients);
    res.status(200).json({ message: "Recipe added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save recipe" });
  }
}

module.exports = {
  adminLogin,
  getAdminRecipes,
  updateRecipe,
  deleteRecipe,
  deleteIngredient,
  addRecipe,
};
