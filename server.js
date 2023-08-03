const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressHandler = require('express-handlebars');
const useContr = require('./co/useControl');
const nasaController = require('./co/NasaBase64Controller');
const app = express();


app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());

app.use(express.json())

const url = "mongodb+srv://minhminh:abcxyz123@cluster0.rwqwdyk.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(url , {useUnifiedTopology : true , useNewUrlParser : true})
    
app.use('/', useContr)



// server nasa asm nếu thầy có vào đến đây thì thầy đừng quan tâm mấy file khác nha , tại đấy là mấy bài cũ của e:))))
// còn nasaController là các api e làm theo đề bài thầy vào đó chấm nha

app.use('/n', nasaController)





app.listen(3000 , ()=>{
    console.log("server start");
})
