const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    tensp : {
        type : String
    },
    gia : {
        type : String
    }, 
    loaisp : {
        type : String
    },
    soluong : {
        type : String
    },
    hinhanh : {
        type : String
    }
})

const User = mongoose.model("Data" , UserSchema);
module.exports = User;