const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const bcrypt = require('bcrypt');

function init(passport){
    passport.use(new LocalStrategy({ usernameField:'email' },async (email,password,done)=>{
        const user = await User.findOne({ email:email })
        if (!user) {
            return done(null,false,{message:'Email id not registered'})
        }
        const match = await bcrypt.compare(password,user.password)
        if (match) {
            return done(null,user,{message:'Login Success'})
        }
        return done(null,false,{message:'Invalid Credentials'})
    
    }))

    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
    passport.deserializeUser((id,done)=>{
        User.findById({_id:id},(err,user)=>{
            done(err,user)
        })
    })
}
module.exports = init;