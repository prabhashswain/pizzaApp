const app = require('express');
const { homeController } = require('../controllers/homeController');

const homeRoute = app.Router();

homeRoute.get('/',homeController)

module.exports = homeRoute;