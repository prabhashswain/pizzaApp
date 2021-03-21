const Order = require('../models/orders');
const moment = require('moment');


const adminController = async (req,res)=>{
    const orders = await Order.find({status:{$ne:'completed'}},null,{
        sort:{createdAt:-1}}).populate('customerId','-password')
    return res.render('admin/admin',{orders:orders,moment:moment})
}
const adminStatusController = (req,res)=>{
    Order.updateOne({_id:req.body.orderId},{status:req.body.status},(err,data)=>{
        const eventEmitter = req.app.get('eventEmitter')
        eventEmitter.emit('orderUpdated',{id:req.body.orderId,status:req.body.status})
        return res.redirect('/admin')
    })
}
module.exports = {
    adminController,
    adminStatusController
}