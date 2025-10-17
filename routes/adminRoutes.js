const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const { getAllUsers, getUserById, updateUserRole, deleteUser } = require('../controllers/adminController');

// Protect all routes → Only admins can use them
router.use(authenticate, authorizeRoles('admin'));

// CRUD operations
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;
