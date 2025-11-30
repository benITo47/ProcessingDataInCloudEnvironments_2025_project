const express = require('express');
const { 
  adminLogin,
  getAdminRecipes,
  updateRecipe,
  deleteRecipe,
  deleteIngredient,
  addRecipe
} = require('../../controllers/adminController');
const adminAuth = require('../../middleware/adminAuth');
const router = express.Router();

// Publicly accessible login route
router.post('/login', adminLogin);

// Protected admin routes
router.post('/recipes', adminAuth, addRecipe); // Add this new protected route
router.get('/recipes', adminAuth, getAdminRecipes);
router.put('/recipes', adminAuth, updateRecipe);
router.delete('/recipes/:name', adminAuth, deleteRecipe);
router.delete('/ingredients/:name', adminAuth, deleteIngredient);

module.exports = router;
