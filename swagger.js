const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Eggs and More',
    description: 'Trading API'
  },
  host: 'cse341-mw5a.onrender.com',
  schemes: ['https']
};
const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// Run server after it gets generated
swaggerAutogen(outputFile, endpointsFiles, doc).then(async () => {
  await import('./server.js');
});