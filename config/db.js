require('dotenv').config()
const mongoose = require('mongoose');

const connect = async ()=>{
    try {
        const res = await mongoose.connect(process.env.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
          });
          console.log('connected');
    } catch (error) {
        console.log(error);
    }
}
module.exports = connect;