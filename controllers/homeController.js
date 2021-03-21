const Menu = require('../models/menus');

const homeController = async (req,res)=>{
    const pizzas = await Menu.find();
    res.render('home',{'pizzas':pizzas})
}

module.exports = {
    homeController
}