const Order = require('../models/orders');
const moment = require('moment');

const cartController = (req,res)=>{
    res.render('customers/cart')
}
const addToCartController = (req,res)=>{
    if (!req.session.cart) {
        req.session.cart = {
            items:{},
            totalQty:0,
            totalPrice:0
        }
    }
    let cart = req.session.cart;
    if (!cart.items[req.body._id]) {
        cart.items[req.body._id] = {
            item:req.body,
            qty:1
        }
        cart.totalQty = cart.totalQty + 1
        cart.totalPrice = cart.totalPrice + req.body.price;
    } else {
        cart.items[req.body._id].qty = cart.items[req.body._id].qty +1
        cart.totalQty = cart.totalQty + 1
        cart.totalPrice = cart.totalPrice + req.body.price;
    }
    res.json({totalQty:req.session.cart.totalQty})
}

const orderController = (req,res)=>{
    const { phone,address } = req.body
    if (!phone || !address) {
        req.flash('error','All fields required')
        res.redirect('/cart')
    }
    const order = new Order({
        customerId:req.user._id,
        items:req.session.cart.items,
        phone:phone,
        address:address
    })
    order.save().then(result=>{
        req.flash('success','order placed successfully !!!')
        delete req.session.cart
        return res.redirect('/orders')
    }).catch(err=>{
        console.log(err);
        req.flash('error','something went wrong')
        return res.redirect('/cart')
    })

}
const customerOrderController = async (req,res)=>{
    const orders = await Order.find({ customerId:req.user._id },
        null,{sort:{'createdAt':-1}})
    res.render('customers/order',{orders:orders,moment:moment})
}
const orderTrackerController = async (req,res)=>{
    const order = await Order.findById(req.params.id)
    return res.render('customers/tracker',{order:order})
}
module.exports = {
    cartController,
    addToCartController,
    orderController,
    customerOrderController,
    orderTrackerController
}