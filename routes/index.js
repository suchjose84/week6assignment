const routes = require('express').Router();
const contact = require('./users');

routes.use('/', require('./swagger'));
routes.use('/', contact);
routes.use('/', (docData = (req, res) => {
    let docData = {
      documentationURL: 'https://week6personal.onrender.com/',
    };
    res.send(docData);
  })
);

module.exports = routes;