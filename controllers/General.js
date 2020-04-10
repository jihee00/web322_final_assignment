/*********************GENERAL ROUTES***************************/
const express = require('express');
const router = express.Router();
const categoryModel = require("../model/category");
const bestsellerModel = require("../model/bestseller");

/*GENERAL ROUTES*/
//Route to direct user to home page
router.get("/",(req,res)=>{
        
    res.render("general/home",{
            title : "Home",
            headingInfo:"",
            categories : categoryModel.getAllCategories(),
            bestsellers : bestsellerModel.getAllBestSellers()
    })
});

module.exports=router;