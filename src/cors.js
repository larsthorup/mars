var corsMiddleware = require('restify-cors-middleware');

// Note: this is only to allow us to use sinon.stub(cors, 'middleware')
function middleware (options) {
  return corsMiddleware(options);
}

module.exports = {
  middleware: middleware
};
