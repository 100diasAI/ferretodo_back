const { Router } = require("express");
const { isAuthenticated } = require("../controllers/user.controller.js");
const {ProductosFav , Usuario} = require("../db.js");
const {Op} = require('sequelize')

const router = Router();

router.post('/', isAuthenticated, async(req, res,next) => {
    const {userId , productId} = req.body;
    try{
        let fav = await ProductosFav.create({
            productId
        });
        console.log('userId')
        let user = await  Usuario.findOne({
            where:{
                id:userId
            }
        })        
        if (fav) {
            console.log('entramos')
            await user.addProductosFavs(fav)
        }
        res.status(200).json({
            id: productId
        });
    } catch (error){
        next(error)
    }
})


module.exports = router;