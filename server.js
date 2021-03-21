const express = require('express');
const path = require('path');
const Emitter = require('events');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('express-flash');
const connect = require('./config/db');
const expressLayout = require('express-ejs-layouts');
const authRoute = require('./routes/authRoute');
const customerRoute = require('./routes/customerRoute');
const homeRoute = require('./routes/homeRoute');
const passport = require('passport');
const passportInit = require('./config/passport');
const adminRoute = require('./routes/adminRoute');
require('dotenv').config();

const app = express()

//connect database
connect();
//json data
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//set staticfiles
app.use(express.static(path.join(__dirname+'/public')))
//set view enginee
app.use(expressLayout)
app.set('view engine','ejs')
//connect mongodb session
const Store = new MongoDBStore({
    uri: process.env.DB,
    collection: 'session'
  });
//session config
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge:7*24*60*60*1000
     },
     store:Store
  }))

//express flash
app.use(flash());

//passport config
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())
//global middleware
app.use((req,res,next)=>{
  res.locals.session = req.session
  res.locals.user = req.user
  next()
})
//route config
app.use(homeRoute)
app.use(authRoute)
app.use(customerRoute)
app.use(adminRoute)

//run server
const server = app.listen(process.env.PORT,()=>{
    console.log(`Server started on ${process.env.PORT}`);
})

//event emiiter config
const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)

//socket config
const io = require('socket.io')(server)
//socket join
io.on('connection',(socket)=>{
  socket.on('join',(roomName)=>{
    socket.join(roomName)
  })
})

eventEmitter.on('orderUpdated',(data)=>{
  io.to(`order_${data.id}`).emit('orderUpdated',data)
})