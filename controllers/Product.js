/*********************PRODUCT ROUTES***************************/
const express = require('express');
const router = express.Router();
const productModel = require("../model/product");

router.get("/list",(req,res)=>{
        
    res.render("product/productList",{
            title : "Products Page",
            headingInfo:"Products list", 
            products : productModel.getAllproducts()
    })
});

module.exports=router;
