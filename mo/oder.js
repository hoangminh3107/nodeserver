const mongoose = require('mongoose');

const OderSchema = new mongoose.Schema({
    cart: [
        {
            type: 'Object'
        }
    ],
    location :{
        type: String
    },
    price :{
        type: String
    },
    currentDate :{
        type: String
    },
    oderId :{
        type: String
    },
    uID: {
        type: String
    }
});

const oder = mongoose.model('Oder', OderSchema);

module.exports = oder;