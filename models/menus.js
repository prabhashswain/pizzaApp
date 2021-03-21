const { Schema,model } = require('mongoose');

const menuSchema = new Schema({
    name : { type:String,required:true },
    image : { type:String,required:true },
    size : { type:String,required:true },
    price : { type:Number,required:true }

},{timestamps:true})

module.exports = model('menu',menuSchema)