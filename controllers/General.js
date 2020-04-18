/*********************GENERAL ROUTES***************************/
const express = require('express');
const router = express.Router();

const categoryModel = require("../model/Category");
const productModel = require("../model/Product");
const cartModel = require("../model/Cart");

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
                        productPic : product.productPic,
                        link : product.link
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

router.get("/dashboard", isAuthenticated,dashBoardLoader);

router.post("/dashboard", isAuthenticated, (req,res) => {

    if (req.body.category == "all") {
        //pull from the database , get the results that was returned and then inject that results into the list
        productModel.find()
        .then((product)=>{
    
            //Filter out the information that you want from the array of documents that was returned into a new array
            //Array 300 documents meaning that the array has 300 elements 
    
            const filteredProduct =   product.map(product=>{
    
                    return {
                        id: product._id,
                        name : product.name,
                        price : product.price,
                        description: product.description,
                        quantity : product.quantity,
                        category : product.category,
                        bestseller : product.bestseller,
                        productPic : product.productPic,
                        link : product.link
                    }
            });
    
            res.render("user/adminDashboard",{
               data : filteredProduct
            });
    
        })
        .catch(err=>console.log(`Error happened when pulling from the database :${err}`));
      }
        else {

            productModel.find({category: req.body.category})
            .then((product)=>{
                //Filter out the information that you want from the array of documents that was returned into
                //a new array
                //Array 300 documents meaning that the array has 300 elements 
                const filteredProduct =   product.map(product=>{
    
                    return {
                        id: product._id,
                        name : product.name,
                        price : product.price,
                        description: product.description,
                        quantity : product.quantity,
                        category : product.category,
                        bestseller : product.bestseller,
                        productPic : product.productPic,
                        link : product.link
                    }
                });
        
                res.render("user/adminDashboard",{
                    data : filteredProduct
                 });
        
            })
            .catch(err=>console.log(`Error happened when pulling from the database :${err}`));
        }
});

router.put("/cart/:id", isAuthenticated, (req,res) => {

    if(!req.session.cart) {
        
        productModel.findById(req.params.id)
        .then((product)=>{
            product.price = (product.price * Number(req.body.quantity)).toFixed(2);

            let newCart = {
                products: [],
                products_qty: [],
                userid: req.session.userInfo._id,
                username : req.session.userInfo.name,
                useremail: req.session.userInfo.email,
                total_amount: product.price.toFixed(2),
                total_items: Number(req.body.quantity) ,
            };

            newCart.products.push(product);
            newCart.products_qty.push(Number(req.body.quantity));
            const cartObj = new cartModel(newCart);

            cartObj.save()
            .then(()=> {
                req.session.cart=cartObj;
                res.redirect("/cart");
            })
            .catch(err => {
                console.log(`Error on saving to database: ${err}`);
            });
        })
        .catch(err=>console.log(`Error happened when pulling from the database :${err}\n\n`));
    }
    
    // Update existing cart
    else {
        let quantity_added_to_cart = Number(req.body.quantity);
        let total_price_on_the_cart = 0.00;
        let total_items_on_the_cart = 0.00;
        productsModel.findById(req.params.id)
        .then((product)=>{
            let product_price = product.price.toFixed(2);

            product.price = (product_price * Number(req.body.quantity)).toFixed(2);

            cartModel.findById(req.session.cart._id)
            .then((cart) => {
                total_items_on_the_cart = cart.total_items;
                total_items_on_the_cart += quantity_added_to_cart;
                total_price_on_the_cart = cart.total_amount;
                total_price_on_the_cart += product_price * quantity_added_to_cart;
                total_price_on_the_cart = total_price_on_the_cart.toFixed(2);
                cartModel.updateOne({_id:req.session.cart._id}, { 
                    $set: {  total_items: total_items_on_the_cart, total_amount: total_price_on_the_cart },
                    $push: { products: product, products_qty:quantity_added_to_cart}
                })
                .then(()=>{
                    res.redirect("/cart");
                })
                .catch(err=>console.log(`Error happened when updating data from the database :${err}`));
            }).catch(err=>console.log(`Error happened when pulling from the database :${err}`));
           
        })
        .catch(err=>console.log(`Error happened when pulling from the database :${err}`));
    }
});

router.get("/cart", isAuthenticated, (req,res) => {
    if(!req.session.cart || req.session.cart == null || req.session.cart == undefined) {
        const err = "Your cart is empty";
        res.render("cart", {
            err
        });
    }
    else {
        cartModel.findOne({userid: req.session.userInfo._id})
        .then((cart)=>{
            let {products, products_qty, total_items, total_amount } = cart;
            res.render("cart", {
                products, products_qty, total_items, total_amount
            });
        })
        .catch(err=>console.log(`Error happened when pulling from the database :${err}`));
    }
    
});

// Place Order
router.post("/checkout", isAuthenticated,(req,res) => {

    // Get items in the current cart
    cartModel.findOne({userid: req.session.userInfo._id})
    .then((cart)=>{

        let {products, products_qty, total_items, total_amount } = cart;
        
       // Compose html
        let html = "<h3>Your Order Summary</h3><br><br>";
        products.forEach((item,i)=> {
            html += "Product Name: " + item.name + "<br>";
            html +="Quantity: " + products_qty[i] + "<br>";
            html +="Total Price: $" + item.price + "<br><br>";
        });
        html +="<b>Total Items: " + total_items + "</b><br>";
        html +="<b>Order Total: $" + total_amount + "</b><br>";

        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

        const msg = {
            to: req.session.userInfo.email,
            from: 'warmgrey32@gmail.com',
            subject: 'Order confirmation',
            text: 'Order confirmation',
            html: html
        };

        sgMail.send(msg)
        .then ( ()=> {
                // Cleanup cart
                cartModel.deleteMany({userid: req.session.userInfo._id})
                .then ( () => {
                    req.session.cart = null;
                    req.session.save();
                })
                .catch(err=>console.log(`Error happened when deleting data from the database :${err}`));;

                res.render("checkout", {success: "Thank you for shopping with us. An email has been sent with order details"});
        })
        .catch(err => {
            console.log(`Error on sending email: ${err}`);
        })         
        })
        .catch(err=>console.log(`Error happened when pulling from the database :${err}`));
    
});

router.get("/checkout", isAuthenticated, (req,res) => {
    res.render("checkout");
});

module.exports = router;