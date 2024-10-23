const { Router } = require("express");
const { Producto, Categoria } = require("../db.js");
const {Op} = require('sequelize')

const router = Router();

router.get('/', async(req, res) => {
    const {name} = req.query
    let page = 1;
    page = parseInt(page)
    const paginated = 500;

    if(page <= 0 || !page) return res.status(400).send({Error: 'Las páginas deben ser números que empiezan desde el 1.'})

    let productsSearch

    const query = {include: [Categoria], offset: paginated*(page-1), limit: paginated, distinct: true, order: ['id']}

    if(!name) productsSearch = await Producto.findAndCountAll(query);
    else productsSearch = await Producto.findAndCountAll({
        ...query,
        where:{
            nombre:{
                [Op.iLike]: `%${name}%`,
            }
        },
    });

    const totalProductsForQuery = productsSearch.count
    const numberOfPages =  Math.ceil( totalProductsForQuery / paginated)

    const productos = productsSearch.rows.map(p => p.dataValues)

    const paginatedOnPage = productos.length

    const paginateInfo = {currentPage: page, lastPage: numberOfPages, paginated: paginatedOnPage}

    if(page > numberOfPages) return res.redirect('./' + numberOfPages)

    res.status(200).send({productos, paginateInfo})
})

module.exports = router;
