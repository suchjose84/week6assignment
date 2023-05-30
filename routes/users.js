const routes = require('express').Router();
const usersController = require('../controllers/usersController.js');

// GET all users
routes.get('/users', usersController.getAllUsers);

// GET a user
routes.get('/users/:username', usersController.getUser);

// POST create user
routes.post('/users', usersController.addUser);

// PUT update user
routes.put('/users/:username', usersController.editUser);

// DELETE a user
routes.delete('/users/:username', usersController.deleteUser);


module.exports = routes;