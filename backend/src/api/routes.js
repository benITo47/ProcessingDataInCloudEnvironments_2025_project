const express = require('express');
const publicRoutes = require('./publicRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

// Public routes (no prefix)
router.use('/', publicRoutes);

// Admin routes are prefixed with /admin
router.use('/admin', adminRoutes);

module.exports = router;
