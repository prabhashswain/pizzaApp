const app = require('express');
const { cartController, addToCartController, orderController, customerOrderController, orderTrackerController } = require('../controllers/customerController');
const { auth } = require('../middlewares/authMiddleware');

const customerRoute = app.Router();

customerRoute.get('/cart',cartController)
customerRoute.post('/addToCart',addToCartController)
customerRoute.post('/order',auth,orderController)
customerRoute.get('/order/:id',orderTrackerController)
customerRoute.get('/orders',auth,customerOrderController)

module.exports = customerRoute;