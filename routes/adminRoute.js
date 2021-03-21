const app = require('express');
const { adminController, adminStatusController } = require('../controllers/adminController');
const { admin } = require('../middlewares/authMiddleware');

const adminRoute = app.Router();

adminRoute.get('/admin',admin,adminController)
adminRoute.post('/admin/status',adminStatusController)

module.exports = adminRoute;