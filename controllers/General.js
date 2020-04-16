/*********************GENERAL ROUTES***************************/
const express = require('express');
const router = express.Router();
const isAuthenticated = require("../middleware/auth");
const dashBoardLoader = require("../middleware/authorization");


/*GENERAL ROUTES*/
//Route to direct user to home page
router.get("/",(req,res)=>{
        
    res.render("general/home",{
            title : "Home",
            headingInfo:"",
    })
});



router.get("/userDashboard", isAuthenticated, dashBoardLoader);

module.exports=router;