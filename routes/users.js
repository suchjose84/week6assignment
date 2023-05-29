const routes = require('express').Router();
const usersController = require('../controllers/usersController.js');

// GET /contacts
routes.get('/users', usersController.getAllUsers);

// GET /contacts/:id
routes.get('/users/:username', usersController.getUser);

// POST /contacts
routes.post('/users', usersController.addUser);

// PUT /contacts
routes.put('/users/:username', usersController.editUser);

// DELETE /contacts
routes.delete('/users/:username', usersController.deleteUser);

// // DELETE /contacts
// routes.delete('/users', usersController.deleteAllUsers);


module.exports = routes;