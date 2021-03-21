const guest = (req,res,next)=>{
    if (!req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/')
}
const auth = (req,res,next)=>{
    if (req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/login')
}
const admin = (req,res,next)=>{
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next()
    }
    return res.redirect('/')
}
module.exports = {
    guest,
    auth,
    admin
}