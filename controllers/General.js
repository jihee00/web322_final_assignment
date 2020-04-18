/*********************GENERAL ROUTES***************************/
const express = require('express');
const router = express.Router();

const categoryModel = require("../model/Category");
const productModel = require("../model/Product");
const orderModel = require("../model/Order");

const isAuthenticated = require("../middleware/authentication");
const dashBoardLoader = require("../middleware/authorization");

/*GENERAL ROUTES*/
//Route to direct user to home page
router.get("/",(req,res)=>{

    //pull from the database , get the results that was returned and then inject that results into the list
    productModel.find({ bestseller: true })
    .then((products)=>{
    
    //Filter out the information that you want from the array of documents that was returned into a new array
    //Array 300 documents meaning that the array has 300 elements 
    
        const filteredProduct = products.map(product=>{
    
            return {
                        id: product._id,
                        name : product.name,
                        price : product.price,
                        description: product.description,
                        quantity : product.quantity,
                        category : product.category,
                        bestseller : product.bestseller,
                        createBy : product.createBy,
                        productPic : product.productPic
                    }
        });

        res.render("general/home",{
            title:"Home",
            categories: categoryModel.getAllCategories(),
            bestsellers: filteredProduct
        });
    
    })
    .catch(err=>console.log(`Error happened when pulling from the database :${err}`));
    
});


module.exports = router;