/*********************GENERAL ROUTES***************************/
const express = require('express');
const router = express.Router();
const categoryModel = require("../model/category");
const productModel = require("../model/Product");

const isAuthenticated = require("../middleware/auth");
const dashBoardLoader = require("../middleware/authorization");

/*GENERAL ROUTES*/
//Route to direct user to home page
router.get("/",(req,res)=>{

    //pull from the database , get the results that was returned and then inject that results into the list
    productModel.find()
    .then((product)=>{
    
    //Filter out the information that you want from the array of documents that was returned into a new array
    //Array 300 documents meaning that the array has 300 elements 
    
        const bestProduct = product.map(product=>{
    
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
                bestsellers: bestProduct,
                categories: categoryModel.getAllCategories()
    
        })
        .catch(err=>console.log(`Error happened when pulling from the database :${err}`));

    })
    
});

// Handle dashboard only if authenticated
router.get("/userDashboard",isAuthenticated,dashBoardLoader);

module.exports = router;