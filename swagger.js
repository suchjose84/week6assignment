const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Eggs and More',
    description: 'Trading API'
  },
  host: 'week6personal.onrender.com',
  schemes: ['https']
};
const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// Run server after it gets generated
swaggerAutogen(outputFile, endpointsFiles, doc).then(async () => {
  await import('./server.js');
});