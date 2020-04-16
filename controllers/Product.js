/*********************PRODUCT ROUTES***************************/
const express = require('express');
const router = express.Router();
const path = require("path");
const isAuthenticated = require("../middleware/auth");
const dashBoardLoader = require("../middleware/authorization");

const productModel = require("../model/Product");
const userModel = require("../model/User");
//const orderModel = require("../model/Order");

//Route to direct use to Add Product Form
router.get("/add",(req,res)=>
{
    res.render("product/productAdd");
});

//Route to process user's request and data when the user submits the add task form
router.post("/add", isAuthenticated, (req,res)=>
{
        const newProduct = {
            name : req.body.name,
            price : req.body.price,
            description : req.body.description,
            quantity : req.body.quantity,
            category : req.body.category,
            bestseller : req.body.bestseller,
            createBy : req.body.createBy,
            productPic : req.files.productPic.name
        }

    /*
        Rules for inserting into a MongoDB database USING MONGOOSE is to do the following :
        1. YOu have to create an instance of the model, you must pass data that you want inserted
         in the form of an object(object literal)
        2. From the instance, you call the save method
     */

     const product =  new productModel(newProduct);
     product.save()
     .then((product)=>{

        // rename image
        req.files.productPic.name = `pro_pic_${user._id}${path.parse(req.files.productPic.name).ext}`;
        // move to my folder
        req.files.productPicPic.mv(`public/img/${req.files.productPic.name}`)

        .then(()=>{

            productModel.updateOne({_id:user._id},{
                productPic: req.files.productPic.name
            })
            .then(()=>{
                res.redirect(`/product/list/${user._id}`)
            })

        })
     })
     .catch(err=>console.log(`Error happened when inserting in the database :${err}`));
});

////Route to fetch all tasks
router.get("/list",(req,res)=>
{
    //pull from the database , get the results that was returned and then inject that results into
    //the taskDashboard

    productModel.find()
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
                    createBy : product.createBy,
                    productPic : product.productPic
                }
        });



        res.render("product/productDashboard",{
           data : filteredProduct
        });

    })
    .catch(err=>console.log(`Error happened when pulling from the database :${err}`));

    
  
});

//Route to direct user to the task profile page
router.get("/description",(req,res)=>{

    

})


router.get("/edit/:id",(req,res)=>{

    taskModel.findById(req.params.id)
    .then((product)=>{

        const {_id,name,price,description,quantity,category,bestseller,createBy,productPic} = product;
        res.render("product/productEdit",{
            _id,
            name,
            price,
            description,
            quantity,
            category,
            bestseller,
            createBy,
            productPic
        })

    })
    .catch(err=>console.log(`Error happened when pulling from the database :${err}`));


})

router.put("/update/:id",(req,res)=>{

    const product = {
        name : req.body.name,
        price : req.body.price,
        description : req.body.description,
        quantity : req.body.quantity,
        category : req.body.category,
        bestseller : req.body.bestseller,
        createBy : req.body.createBy,
        productPic : req.files.productPic.name
    }


    productModel.updateOne({_id:req.params.id}, product)
    .then(()=>{
        res.redirect("/product/list");
    })
    .catch(err=>console.log(`Error happened when updating data from the database :${err}`));


});


router.delete("/delete/:id",(req,res)=>{
    
    productModel.deleteOne({_id:req.params.id})
    .then(()=>{
        res.redirect("/product/list");
    })
    .catch(err=>console.log(`Error happened when updating data from the database :${err}`));

});





//Route to direct user to edit task form



//Route to update user data after they submit the form


//router to delete user


module.exports=router;
