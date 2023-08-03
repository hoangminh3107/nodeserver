const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  urls: [String]
});

const UrlBase64 = mongoose.model('UrlBase64', urlSchema);

module.exports = UrlBase64;