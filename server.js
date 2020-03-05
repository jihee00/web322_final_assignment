//imports
const express= require("express");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
const productModel = require("./model/product");
const categoryModel = require("./model/category");
const bestsellerModel = require("./model/bestseller");
require('dotenv').config({path:"./config/keys.env"});

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

app.get("/login",(req,res)=>{
        
        res.render("login",{
                title : "Login Page",
                headingInfo:"Sign-in"
        })
});

//Handle the post data
app.post("/login",(req,res)=>{

        const errorMessagesL1 = [];
        const errorMessagesL2 = [];

        //validation
        if(req.body.emailLog=="")
        {
                errorMessagesL1.push("You must enter an email address.");
        }

        if(req.body.pswLog=="")
        {
                errorMessagesL2.push("You must enter a password.");
        }

        //If the user does not enter all the information
        if(errorMessagesL1.length >0 || errorMessagesL2.length >0 )
        {
                const {emailLog,pswLog} = req.body;
                res.render("login",{
                        title : "Login Page",
                        errorsL1 : errorMessagesL1,
                        errorsL2 : errorMessagesL2,
                        emailLog : `${emailLog}`,
                        pswLog : `${pswLog}`
                });
        }

        else 
        {
                const {emailLog,pswLog} = req.body;
                res.render("home",{
                        title : "Home",
                        headingInfo:"",
                        categories : categoryModel.getAllCategories(),
                        bestsellers : bestsellerModel.getAllBestSellers(),
                        emailLog : `${emailLog}`,
                        pswLog : `${pswLog}`
                });
        }
        

});

app.get("/register",(req,res)=>{
        
        res.render("register",{
                title : "Customer Registration",
                headingInfo:"Create account"
        })
});

//Handle the post data
app.post("/register",(req,res)=>{

        const errorMessages1 = [];
        const errorMessages2 = [];
        const errorMessages3 = [];
        const errorMessages4 = [];
        const errorMessages5 = [];
        const charac=/^[a-zA-Z0-9]{6-12}$/;

        //validation
        if(req.body.firstName=="")
        {
                errorMessages1.push("You must enter your first name.");
        }

        if(req.body.lastName=="")
        {
                errorMessages2.push("You must enter your last name.");
        }

        if(req.body.Email=="")
        {
                errorMessages3.push("You must enter an email address.");
        }

        if(req.body.psw=="")
        {
                errorMessages4.push("You must enter a password.");
        }

        else if(req.body.psw.length < 6 || req.body.psw.length > 12)
        {
                errorMessages4.push("You must enter 6 to 12 characters.");
        }

        else if(!charac.test(req.body.psw))
        {
                errorMessages4.push("You must enter letters or numbers.");
        }
        
        if(req.body.psw !== req.body.psw2)
        {
                errorMessages5.push("The password strings must match!");
        }


        //If the user does not enter all the information
        if(errorMessages1.length >0 || errorMessages2.length >0 || errorMessages3.length >0|| errorMessages4.length >0|| errorMessages5.length >0)
        {
                const {custName,Email,psw,psw2} = req.body;
                res.render("register",{
                title : "Customer Registration",
                errors1: errorMessages1,
                errors2: errorMessages2,
                errors3: errorMessages3,
                errors4: errorMessages4,
                errors5: errorMessages5,
                custName : `${custName}`,
                Email : `${Email}`,
                psw : `${psw}`,
                psw2 : `${psw2}`
                });
        }

        //If the user enters all the data and submit the form
        else
        {
                const {firstName,Email,psw} = req.body;
                // using Twilio SendGrid's v3 Node.js Library
                // https://github.com/sendgrid/sendgrid-nodejs
                const sgMail = require('@sendgrid/mail');
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = {
                to: `warmgrey32@gmail.com`,
                from: `${Email}`,
                subject: 'Registration Form Submit',
                html: 
                `
                User's Name ${firstName} <br>
                User's Email Address ${Email} <br>
                User's password ${psw} <br>
                `,
                };
                //Asynchornous operation (we don't know how long this will take to execute)
                sgMail.send(msg)
                .then(()=>{
                res.render("home", {
                        title : "Home",
                        headingInfo:"",
                        categories : categoryModel.getAllCategories(),
                        bestsellers : bestsellerModel.getAllBestSellers(),
                        emailLog : req.body.emailLog,
                        pswLog : req.body.pswLog
                })
                })
                .catch(err=>{
                console.log(`Error ${err}`);
                });
        }

});

const PORT= process.env.PORT||3000;
//This creates an Express Web Server that listens to HTTP Reuqest on port 3000
app.listen(PORT,()=>{
    console.log(`Web Server Started`);
});