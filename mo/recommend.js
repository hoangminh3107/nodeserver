const mongoose = require('mongoose');
const RecommendSchema = new mongoose.Schema({
    description : {
        type : String
    },
    image :[ {
        type : String
    }]
    ,
    nameProduct : {
        type : String
    }
    ,
    price : {
        type : String
    }
    ,
    postid : {
        type : String
    }
})

const Recommend = mongoose.model("Recommend" , RecommendSchema);
module.exports = Recommend;