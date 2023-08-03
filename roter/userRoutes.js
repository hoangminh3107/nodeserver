const express = require('express');
const userModel = require('../mo/user')

const app = express();

app.post('/users', async (req, res) => {
    const u = new userModel(req.body);
    try {
        await u.save();
        res.send(u);
    } catch (err) {
        res.status(500).send(err);
    }
})

app.get('/users/list', async (req, res) => {
    const list = await userModel.find({})
    try {
        
        res.send(list);
    } catch (err) {
        res.status(500).send(err);
    }
})

app.patch('/users/:id', async (req, res) => {
    try {
        const user = await userModel.findByIdAndUpdate(req.params.id, req.body);
        await userModel.save();
        res.send(user);
    } catch (err) {
        res.status(500).send(err);
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id, req.body);
        if(!user) res.status(400).send("no item found");
        res.status(200).send(user);
       
    } catch (err) {
        res.status(500).send(err);
    }
})
module.exports = app;