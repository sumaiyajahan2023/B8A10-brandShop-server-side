const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const app = require('../index.js');

module.exports = (req, res) => {
  app(req, res);
};