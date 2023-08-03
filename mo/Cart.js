const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    uId: {
        type: String
    },
    cartItem: {
        cartId: {
            type: String
        },
        cart: [{

            // cứ cho " type: 'Object'" là cho trường dữ liệu gì ở trong cũng được 
            type: 'Object'

        }]
    }
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;