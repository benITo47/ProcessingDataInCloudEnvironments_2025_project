const express = require('express');
const { getIngredients, searchRecipes } = require('../../controllers/publicController');
const router = express.Router();

router.get('/ingredients', getIngredients);
router.post('/search', searchRecipes);

module.exports = router;
