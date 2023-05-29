const routes = require('express').Router();
const contact = require('./users');

routes.use('/', require('./swagger'));
routes.use('/', contact);
routes.use('/', (docData = (req, res) => {
    let docData = {
      documentationURL: 'https://cse341-mw5a.onrender.com/api-docs',
    };
    res.send(docData);
  })
);

module.exports = routes;