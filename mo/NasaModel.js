const mongoose = require('mongoose');

const NasaSchema = new mongoose.Schema({
  copyright: {
    type: String
  },
  date: {
    type: String
  },
  explanation: {
    type: String
  },
  hdurl: {
    type: String
  },
  media_type: {
    type: String
  },
  service_version: {
    type: String
  },
  title: {
    type: String
  },
  url: {
    type: String
  }
});

const NasaModel = mongoose.model('NasaModel', NasaSchema);

module.exports = NasaModel;