const User = require('../models/users');
const bcrypt = require('bcrypt');
const passport = require('passport')

const register = (req,res)=>{
    res.render('auth/register')
}
const login = (req,res)=>{
    res.render('auth/login')
}
const postLogin = (req,res,next)=>{
    const { email,password } = req.body;
    if (!email || !password) {
        req.flash('error','Email and Password Required')
        res.redirect('/login')
    }
    passport.authenticate('local',(err,user,info)=>{
        if (err) {
            req.flash('error',info.message)
            return next(err)
        }
        if (!user) {
            req.flash('error',info.message)
            return res.redirect('/login')
        }
        req.logIn(user,(err)=>{
            if (err) {
                req.flash('error',info.message)
                return next(err)
            }
            return res.redirect(req.user.role === "admin" ? '/admin' : '/orders')
        })
    })(req,res,next)
}
const postRegister = async (req,res)=>{
    const { name,email,password } = req.body;
    if (!name || !email || !password) {
        req.flash('error','All fields are required')
        req.flash('name',name)
        req.flash('email',email)
        return res.redirect('/register')
    }
    User.exists({email},(err,result)=>{
        if (result) {
            req.flash('error','Email already taken')
            req.flash('name',name)
            req.flash('email',email)
            return res.redirect('/register')
        }
    })
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt)
    const user = new User({
        name,
        email,
        password:hashPassword
    })
    user.save().then(user=>{
        res.redirect('/login')
    }).catch(err=>{
        req.flash('error','something went wrong')
        res.redirect('/register')
    })

}
const logout = (req,res)=>{
    req.logout()
    return res.redirect('/login')
}

module.exports = {
    register,
    login,
    postRegister,
    postLogin,
    logout
}