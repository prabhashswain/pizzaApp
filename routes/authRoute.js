const app = require('express');
const { login, register, postRegister, postLogin, logout } = require('../controllers/authController');
const { guest } = require('../middlewares/authMiddleware');
const { adminController } = require('../controllers/adminController')
const authRoute = app.Router();

authRoute.get('/login',guest,login)
authRoute.post('/login',postLogin)
authRoute.get('/register',guest,register)
authRoute.post('/register',postRegister)
authRoute.get('/logout',logout)


module.exports = authRoute;