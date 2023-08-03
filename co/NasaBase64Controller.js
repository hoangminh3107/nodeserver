const express = require('express');
const NasaModel = require('../mo/NasaModel');
const UrlBase64 = require('../mo/UrlBase64');

const app = express();


//them moi data tu api nasa
app.post('/addnasadata', async (req, res) => {
    try {
        const newData = req.body; 
        const result = await NasaModel.insertMany(newData);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving data to database');
    }
});


// get all data 
app.get('/nasa', (req, res) => {
    NasaModel.find({}).then(data => {
        res.send(data)
        
    })
})

// edit
app.post('/editnasa', async (req, res) => {
    try {
        const result = await NasaModel.findByIdAndUpdate(req.body.id, req.body, { new: true }).then(
            post => {
                res.json("cap nhat thanh cong");
            }
        );

    } catch (err) {
        console.error(err);
        res.status(500).send("loi cap nhat user");
    }
})
//delete
app.get('/delete/:id', async (req, res) => {
    const nasa = await NasaModel.findByIdAndDelete(req.params.id)
    res.json(nasa);

})


// chi get image
app.get('/nasaimg', (req, res) => {
    NasaModel.find({}).select('url').then(data => {
        res.send(data);
      });
})



// xoa image
app.get('/xoaimgnasa/:id', async (req, res) => {
    try {
        const result = await NasaModel.findOneAndDelete(req.params.id);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("loi xoa user");
    }
});

//update image theo id

app.post('/capnhatimgnasa', async (req, res) => {
    try {
        const result = await NasaModel.findByIdAndUpdate(req.body.id, req.body, { new: true }).then(
            post => {
                res.send("cap nhat thanh cong");
            }
        );

    } catch (err) {
        console.error(err);
        res.status(500).send("loi cap nhat user");
    }
});


// xoa tat ca data
app.post('/deleteAllData', async (req, res) => {
    try {
        const result = await NasaModel.deleteMany({});
        const result2 = await UrlBase64.deleteMany({});
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting data from database');
    }
});


// add image da convert sang base64
app.post('/adddurlbase64', async (req, res) => {
    try {
      const urlbase64 = await UrlBase64.create({
        urls: req.body
      }); 
      res.json({
        "message":"Insert Successfully"
      });  
    } catch (err) {
        res.json({
            "message":"Insert fail"
          });    
    }
  });


  // get image base64
  app.get('/nasabase64', (req, res) => {
    UrlBase64.find({}).then(data => {
        res.send(data)
        
    })
})



module.exports = app;
