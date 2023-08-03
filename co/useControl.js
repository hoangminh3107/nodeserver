const express = require('express');
const userModel = require('../mo/user')
var url = require('url')
const crypto = require('crypto');
const app = express();
const authorModel = require('../mo/author');
const recommendModel = require('../mo/recommend');
const restaurantModel = require('../mo/Restaurant');
const Cart = require('../mo/Cart');
const Like = require('../mo/likeitem');
const OderModel = require('../mo/oder');
const NasaModel = require('../mo/NasaModel');
const UrlBase64 = require('../mo/UrlBase64');

//LOGIN
app.get('/login', async (req, res) => {
    res.render('layout/login.hbs')
})
app.post('/login', async (req, res) => {
    await authorModel.find({ user: req.body.username } && { pass: req.body.password }).then(data => {
        if (data.length > 0) {
            res.redirect('/add')
            console.log(data);
        } else {
            //  res.redirect('/login');
            res.status(400).send("sai mk hoac tk");
        }
    })
})
// REGISTER
app.get('/register', (req, res) => {
    res.render('layout/register.hbs')
})
app.post('/register', (req, res) => {
    const author = new authorModel(req.body);
    try {
        author.save();
        res.redirect('/register')
    } catch (err) {
        res.status(500).send(err);
    }
})
// ADD
app.get('/add', (req, res) => {
    res.render('layout/main.hbs')
})
app.post('/add', async (req, res) => {
    console.log(req.body);
    // if(req.body.id == ""){

    // }else{
    //     update(req , res)
    // }  
    add(req, res)
})

app.get('/addrecommend', (req, res) => {
    res.render('layout/main.hbs')
})
app.get('/listrecommend', (req, res) => {
    recommendModel.find({}).then(recommend => {
        res.send(recommend)
        //gui json len web 
        // res.send(users)
    })
})
app.post('/addrecommend', async (req, res) => {
    const recommend = new recommendModel(req.body);
    try {
        recommend.save();
        res.redirect('/addrecommend')
        console.log("ok");
    } catch (err) {
        res.status(500).send(err);
    }
})
app.get('/addres', async (req, res) => {
    restaurantModel.find({}).then(users => {
        res.send(users)

    })
});

app.get('/deltailsp/:id', async (req, res) => {
    const rest = await restaurantModel.findOne({ "recommend.postid": req.params.id }, { "recommend.$": 1 })
    if (rest) {
        res.json(rest.recommend[0]);
    } else {
        const recommend = await recommendModel.findById(req.params.id)
        if (recommend) {
            res.json(recommend);
        } else {
            const cart = await Cart.findOne({ "cartItem.cart._id": req.params.id }, { "cartItem.cart.$": 1 })
            if (cart) {
                res.json(cart.cartItem.cart[0]);
            }
            else {
                res.json("k thay")
            }
        }

    }

});

app.get('/cartitem/:id', async (req, res) => {
    const cart = await Cart.findOne({ "cartItem.cart._id": req.params.id }, { "cartItem.cart.$": 1 })
    if (cart) {
        res.json(cart.cartItem.cart[0]);
    }
    else {
        res.json("k thay")
    }
}

);


// oder --------------------------

app.get('/oder', async (req, res) => {
    const oder = await OderModel.find({});
    res.json(oder);
})

app.get('/oderid/:uid', async (req, res) => {
    const oder = await OderModel.find({"uID":req.params.uid});
    res.json(oder);
})

app.get('/oderiddetail/:id', async (req, res) => {
    const oder = await OderModel.findOne({ _id :req.params.id});
    res.json(oder.cart);
})




app.get('/oderdetail/:id', async (req, res) => {
    const oder = await OderModel.findOne({ "cart._id" :req.params.id});
    const cartItem = oder.cart.filter(item => item._id === req.params.id)[0];
    res.json(cartItem);
})




app.post('/oder', async (req, res) => {
    try {
        const oder = new OderModel(req.body);
        oder.save();
        res.json(oder);
    } catch (err) {
        res.status(500).send(err);
    }
})


app.get('/recommend/:id', async (req, res) => {
    const recommend = await recommendModel.findById(req.params.id)
    res.json(recommend);

})
app.post('/addres', async (req, res) => {
    try {
        const restaurant = new restaurantModel(req.body);
        restaurant.save();
        res.json(restaurant);
    } catch (err) {
        res.status(500).send(err);
    }
});


app.get('/timkiem', async (req, res) => {
    const restaurants = await restaurantModel.find({ "recommend.nameProduct": req.query.query });
    if (restaurants && restaurants.length > 0) {
        const recommends = restaurants.map(restaurant => restaurant.recommend.filter(rec => rec.nameProduct === req.query.query)).flat();
        res.json(recommends);
    }
    else {
        const rec = await recommendModel.find({ "nameProduct": req.query.query });
        if (rec) {
            res.json(rec.flat());
        }
    }
});
// like

app.post('/like', async (req, res) => {
    try {
        const like = new Like(req.body);
        like.save();
        res.json(like);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/like', async (req, res) => {
    Like.find({}).then(users => {
        res.send(users)

    })
});
app.get('/likedetail/:id', async (req, res) => {
    const like = await Like.findOne({ "postId": req.params.id }, { "recommend.$": 1 });
    if (like) {
        res.json(like.recommend);
    } else {

        res.json("ko thay");
    }

});

app.post('/xoalike/:postId', async (req, res) => {
    try {
        const like = await Like.findOne({ postId: req.params.postId }); // tìm đối tượng Like có postId tương ứng
        if (like) {
            await Like.findByIdAndDelete(like._id); // xóa đối tượng Like dựa trên giá trị của trường _id
            res.send('Xóa thành công');
        } else {
            res.status(404).send('Không tìm thấy đối tượng Like');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi xóa đối tượng Like'); // báo lỗi nếu có lỗi xảy ra
    }
});


function generateRandomString(length) {
    return crypto.randomBytes(length).toString('hex');
}

app.put('/addresupdate/:id', (req, res) => {
    try {
        const randomString = generateRandomString(24);
        console.log(randomString);
        restaurantModel.findOneAndUpdate({ _id: req.params.id }, { $push: { recommend: { ...req.body, postid: randomString } } }, { new: true }).then(
            post => {
                res.json(post);
            }
        );


    } catch (err) {
        res.status(500).send(err);
    }
});




// cartttttttttttt

app.post('/cart', (req, res) => {
    try {
        const { uId, cartId, cart } = req.body;
        const newCart = new Cart(req.body);

        newCart.save();
        res.json(newCart);
    } catch (err) {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving cart to database');
        }
    }

});
app.post('/deletecart', (req, res) => {
    Cart.deleteOne({ "cartItem.cart._id": req.body._id })
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        });

});

app.get('/cart', async (req, res) => {
    Cart.find({}).then(users => {
        res.send(users)

    })
});













function add(req, res) {
    const u = new userModel(req.body);
    try {
        u.save();
        res.json(
            {
                "msg": "ok",
            }
        );
        console.log("ok");
    } catch (err) {
        res.status(500).send(err);
    }
}
// GET LIST 
app.get('/list', (req, res) => {
    userModel.find({}).then(users => {
        res.send(users)
        //gui json len web 
        // res.send(users)
    })
})
// EDIT
app.post('/edit/:id', async (req, res) => {
    const user =  await userModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    res.json(user);
})
const update = async (req, res) => {
    await userModel.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true }).then(
        post => {
            res.redirect('/list')
        }
    );
}
// DELETE
app.get('/delete/:id', async (req, res) => {
    const user = await userModel.findByIdAndDelete(req.params.id)
    res.json(user);

})

app.get('/xoa/:id', async (req, res) => {
    try {
        const result = await userModel.findOneAndDelete(req.params.id);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("loi xoa user");
    }
});

app.post('/capnhat', async (req, res) => {
    try {
        const result = await userModel.findByIdAndUpdate(req.body.id, req.body, { new: true }).then(
            post => {
                res.send("cap nhat thanh cong");
            }
        );

    } catch (err) {
        console.error(err);
        res.status(500).send("loi cap nhat user");
    }
});







// FIND 
app.get('/find/ao', async (req, res) => {
    await userModel.find({ loaisp: "ao" }).then(users => {
        res.render('layout/result.hbs', {
            users: users.map(data => data.toJSON())
        })
        console.log(users);
    })
})


app.get('/find', async (req, res) => {
    var q = url.parse(req.url, true).query

    // tim 1 doi tuong theo ten

    // const user = await userModel.findOne({fullname : q.findname })
    // if(!user) alert("k tim thay");
    // else
    //     res.render("layout/result.hbs",{
    //         data : user.toJSON(),
    //     } )


    // tim nhieu doi tuong theo ten 
    await userModel.find({ tensp: q.findname } || { loaisp: q.findname }).then(users => {
        res.render('layout/result.hbs', {
            users: users.map(data => data.toJSON())
        })
        console.log(users);
    })



})




//nasa

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

app.get('/nasa', (req, res) => {
    NasaModel.find({}).then(data => {
        res.send(data)
        
    })
})

app.get('/nasaimg', (req, res) => {
    NasaModel.find({}).select('url').then(data => {
        res.send(data);
      });
})


app.get('/xoaimgnasa/:id', async (req, res) => {
    try {
        const result = await NasaModel.findOneAndDelete(req.params.id);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("loi xoa user");
    }
});

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

  app.get('/nasabase64', (req, res) => {
    UrlBase64.find({}).then(data => {
        res.send(data)
        
    })
})


module.exports = app;