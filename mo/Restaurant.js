const mongoose = require('mongoose');
const RecommendSchema = new mongoose.Schema({
    description: {
        type: String
    },
    image: {
        type: String
    },
    nameProduct: {
        type: String
    },
    price: {
        type: String
    },
    postid: {
        type: String
    }
});

const RestaurantSchema = new mongoose.Schema({
    imgRes: {
        type: String
    },
    nameRes: {
        type: String
    },
    idRes: {
        type: String
    },
    recommend: [{
        type: 'Object',
        ref : 'recommend'
    }]
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
const recommend = mongoose.model('recommend', RecommendSchema);


module.exports = Restaurant;