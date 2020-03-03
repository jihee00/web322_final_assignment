//imports
const express= require("express");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
const productModel = require("./model/product");
const categoryModel = require("./model/category");
const bestsellerModel = require("./model/bestseller");

//creation of app object
const app = express();

//handlebars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))

//loading static assests middleware
app.use(express.static("public"));

//define my routes
app.get("/",(req,res)=>{
        
        res.render("home",{
                title : "Home",
                headingInfo:"",
                categories : categoryModel.getAllCategories(),
                bestsellers : bestsellerModel.getAllBestSellers()
        })
});

app.get("/product",(req,res)=>{
        
        res.render("product",{
                title : "Products Page",
                headingInfo:"Products list", 
                products : productModel.getAllproducts(),
        })
});

app.get("/register",(req,res)=>{
        
        res.render("register",{
                title : "Customer Registration",
                headingInfo:"Create account"
        })
});

//Handle the post data
app.post("/register",(req,res)=>{

        const errorMessages = [];

        //validation
        if(req.body.custName=="")
        {
                errorMessages.push("You must enter your name");
        }

        if(req.body.email=="")
        {
                errorMessages.push("You must enter an email address");
        }

        if(req.body.psw=="")
        {
                errorMessages.push("You must enter a password");
        }

        if(req.body.psw=="")
        {
                errorMessages.push("You must enter a password");
        }

        //If the user does not enter all the information
        if(errorMessages.length >0 )
        {
                res.render("register",{
                title : "Customer Registration",
                errors : errorMessages
                });
        }

        //If the user enters all the data and submit the form
        else
        {
                res.render("login",{
                        title : "Login Page",
                        successMessage :`Thank you ${req.body.custName},
                        we received your information`
                });
        }
});

app.get("/login",(req,res)=>{
        
        res.render("login",{
                title : "Login Page",
                headingInfo:"Sign-in"
        })
});

//Handle the post data
app.post("/login",(req,res)=>{

        const errorMessages = [];

        //validation
        if(req.body.email=="")
        {
                errorMessages.push("You must enter an email address");
        }

        if(req.body.psw=="")
        {
                errorMessages.push("You must enter a password");
        }

        //If the user does not enter all the information
        if(errorMessages.length >0 )
        {
                res.render("login",{
                        title : "Login Page",
                        errors : errorMessages
                });
        }

});

const PORT= process.env.PORT||3000;
//This creates an Express Web Server that listens to HTTP Reuqest on port 3000
app.listen(PORT,()=>{
    console.log(`Web Server Started`);
});