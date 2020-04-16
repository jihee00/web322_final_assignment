/*********************USER ROUTES***************************/
const express = require('express');
const router = express.Router();
const userModel = require("../model/User");
const bcrypt = require('bcryptjs');
const isAuthenticated = require("../middleware/auth");
const dashBoardLoader = require("../middleware/authorization");

//Route to direct use to Registration form
router.get("/register",(req,res)=>{
        
    res.render("user/register",{
            title : "Customer Registration",
            headingInfo:"Create account"
    })
});

//Handle the post data
router.post("/register",(req,res)=>{

    userModel.findOne({email:req.body.email})
    .then(user=>{

    let errorFirstName = [];
    let errorLastName = [];
    let errorEmail = [];
    let errorPassword = [];
    let errorCpassword = [];
    let validCheck = true;

    //Check to see if the user's email exist in the database
    if(user!="")
    {
        errorEmail.push("This email has already been registered.");
        validCheck = false;
    }

    //valid ckeck
    if(req.body.firstName=="")
    {
        errorFirstName.push("You must enter your first name.");
        validCheck = false;
    }

    if(req.body.lastName=="")
    {
        errorLastName.push("You must enter your last name.");
        validCheck = false;
    }

    if(req.body.email=="")
    {
        errorEmail.push("You must enter an email address.");
        validCheck = false;
    }

    if(req.body.password=="")
    {
        errorPassword.push("You must enter a password.");
        validCheck = false;
    }

    else if(!req.body.password.match(/(?=.*\d)(?=.*[a-zA-Z]){6,12}/))
    {
        errorPassword.push("You must enter 6 to 12 characters(letters and numbers only).");
        validCheck = false;
    }
    
    if(req.body.cpassword=="")
    {
        errorCpassword.push("You must re-enter a password.");
        validCheck = false;
    }

    if(req.body.cpassword !== req.body.password)
    {
        errorCpassword.push("The password strings must match!");
        validCheck = false;
    }


    //If the user does not enter all the information
    if(!validCheck)
    {
            res.render("user/register",{
            title : "Customer Registration",
            errorFirstName: errorFirstName,
            errorLastName: errorLastName,
            errorEmail: errorEmail,
            errorPassword: errorPassword,
            errorCpassword: errorCpassword,
            firstNameValue: req.body.firstName,
            lastNameValue: req.body.lastName,
            emailValue: req.body.email,
            passwordValue: req.body.password,
            cpasswordValue: req.body.cpassword
            });
    }

    //If the user enters all the data and submit the form
    else
    {
        const newUser = 
        {
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            password:req.body.password
        }

        const user = new userModel(newUser);
        user.save()
        .then(()=>{
                const sgMail = require('@sendgrid/mail');
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);

                const { firstName, lastName, email } = req.body;
                const msg = {
                        to: `${email}`,
                        from: `warmgrey32@gmail.com`,
                        subject: 'Registration Form Submit',
                        html: `Hello, ${firstName} ${lastName} <br>
                        Your email address is ${email} <br>
                        Your password is ${password} <br> 
                        `,
                    };
        
                //Asynchornous operation (we don't know how long this will take to execute)
                sgMail.send(msg)
        
                        .then(() => {
                                req.session.userInfo = user;
                                res.redirect("/user/dashboard");
                            })
        
                        .catch(err => {
                                console.log(`Error ${err}`);
                            })
        
                })
        
        
        .catch(err=>console.log(`Error while inserting into the data ${err}`))
        
            }
        })
    
    .catch(err=>console.log (`Error ${err}`));
});

//Route to direct user to the login form
router.get("/login",(req,res)=>{
        
    res.render("user/login",{
            title : "Login Page",
            headingInfo:"Sign-in"
    })
});

//Handle the post data
router.post("/login",(req,res)=>{

    let errorEmail = [];
    let errorPassword = [];
    let validCheck = true;

    //validation
    if(req.body.email=="")
    {
        errorEmail.push("You must enter an email address.");
        validCheck = false;
    }

    if(req.body.password=="")
    {
        errorPassword.push("You must enter a password.");
        validCheck = false;
    }

    //If the user does not enter all the information
    if(!validCheck)
    {
            res.render("user/login",{
                    title : "Login Page",
                    errorEmail : errorEmail,
                    errorPassword: errorPassword,
                    emailValue: req.body.email,
                    passwordValue: req.body.password
            });
    }

    else 
    {
            /*const {emailLog,pswLog} = req.body;
            res.render("general/home",{
                    title : "Home",
                    headingInfo:"",
                    categories : categoryModel.getAllCategories(),
                    bestsellers : bestsellerModel.getAllBestSellers(),
                    emailLog : `${emailLog}`,
                    pswLog : `${pswLog}`
            });*/

        //Check to see if the user's email exist in the database
        const errors = [];

        userModel.findOne({email:req.body.email})
        .then((user)=>{
        
                //there was no matching email
                if(user==null)
                {
                        errors.push("Sorr your email was not found in our database");
                        res.render("user/login",{
                        errors
                        })
                }
                //There is a matching email
                else
                {
                        bcrypt.compare(req.body.password, user.password)
                        .then((isMatched)=>{

                                //password match
                                if(isMatched==true)
                                {
                                        req.session.userInfo = user;
                                        res.redirect("/user/dashboard")
                                }

                                //no match
                                else
                                {
                                        errors.push("Sorry your password was wrong!");
                                        res.render("user/login",{
                                        errors
                                        })
                                }
                        })
                        .catch(err=>console.log(`Error ${err}`));
                }
                    
            })
        
        .catch(err=>console.log(`Error ${err}`))
    }

});

router.get("/userDashboard",isAuthenticated, dashBoardLoader);

router.get("/logout",(req,res)=>{

        req.session.destroy();
        res.redirect("/user/login")
        
})

module.exports=router;