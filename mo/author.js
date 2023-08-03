const mongoose = require('mongoose');
const AuthorSchema = new mongoose.Schema({
    user : {
        type : String
    },
    pass : {
        type : String
    }
})

const Author = mongoose.model("Author" , AuthorSchema);
module.exports = Author;