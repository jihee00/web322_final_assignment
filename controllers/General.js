/*********************GENERAL ROUTES***************************/
const express = require('express');
const router = express.Router();


/*GENERAL ROUTES*/
//Route to direct user to home page
router.get("/",(req,res)=>{
        
    res.render("general/home",{
            title : "Home",
            headingInfo:"",
    })
});

module.exports=router;