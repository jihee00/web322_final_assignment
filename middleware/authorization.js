const dashBoardLoader = (req,res)=>{

    if(req.session.userInfo.type=="Admin")
    {
        res.render("user/adminDashBoard");
    }
    
    else
    {
        res.render("user/userDashboard");
    }

}

module.exports = dashBoardLoader;