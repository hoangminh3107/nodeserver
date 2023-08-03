const mongoose = require('mongoose');
const Likechema = new mongoose.Schema({
    userId: {
        type: String
       
      },
      postId: {
        type: String
      },
      recommend : {
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
      }
})

const Like = mongoose.model("Like" , Likechema);
module.exports = Like;