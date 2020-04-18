/*********************PRODUCT ROUTES***************************/
const express = require('express');
const router = express.Router();
const path = require("path");
const isAuthenticated = require("../middleware/authentication");

const productModel = require("../model/Product");

router.get("/list",(req,res)=>
{
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

        res.render("product/productDashboard",{
           data : filteredProduct
        });

    })
    .catch(err=>console.log(`Error happened when pulling from the database :${err}`));
  
});

router.post("/list",(req,res)=>
{
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

        res.render("product/productDashboard",{
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
    
            res.render("product/productDashboard",{
                data : filteredProduct
             });
    
        })
        .catch(err=>console.log(`Error happened when pulling from the database :${err}`));
    }
});

//Route to direct use to Add Product Form
router.get("/add",isAuthenticated,(req,res)=>
{
    if(req.session.userInfo.type=="Admin")
    {
        res.render("product/productAdd");
    }
    
    else
    {
        res.redirect("list");
    }
});

//Route to process user's request and data when the user submits the add product form
router.post("/add",isAuthenticated,(req,res)=>
{
        const newProduct = {
            name : req.body.name,
            price : req.body.price,
            description : req.body.description,
            quantity : req.body.quantity,
            category : req.body.category,
            bestseller : req.body.bestseller,
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
        req.files.productPic.name = `pro_pic_${product._id}${path.parse(req.files.productPic.name).ext}`;
        // move to my folder
        req.files.productPicPic.mv(`./public/upload/${req.files.productPic.name}`)

        .then(()=>{

            productModel.updateOne({_id:product._id},{
                productPic: req.files.productPic.name
            })

            .then(()=>{
                res.redirect(`/product/list`)
            })
            .catch(err=>console.log(`Update to database failed :${err}`));
        })
     })
     .catch(err=>console.log(`Error happened when inserting in the database :${err}`));
});

//Route to direct user to edit product form
router.get("/edit/:id",(req,res)=>{

    productModel.findById(req.params.id)
    .then((product)=>{

        const {_id,name,price,description,quantity,category,bestseller,productPic,link} = product;
        res.render("product/productEdit",{
            _id,
            name,
            price,
            description,
            quantity,
            category,
            bestseller,
            productPic,
            link
        })

    })
    .catch(err=>console.log(`Error happened when pulling from the database :${err}`));
})

router.put("/edit/:id",(req,res)=>{

    const product = {
        name : req.body.name,
        price : req.body.price,
        description : req.body.description,
        quantity : req.body.quantity,
        category : req.body.category,
        bestseller : req.body.bestseller,
        productPic : req.files.productPic.name
    }


    productModel.updateOne({_id:req.params.id}, product)
    .then(()=>{
        res.redirect("/dashboard");
    })
    .catch(err=>console.log(`Error happened when updating data from the database :${err}`));


});


router.get("/detail/:id",(req,res)=>{

    productModel.findById(req.params.id)
    .then((product)=>{

        const {_id,name,price,description,quantity,category,bestseller,productPic,link} = product;

        res.render("product/productDetail",{
            _id,
            name,
            price,
            description,
            quantity,
            category,
            bestseller,
            productPic,
            link
        })

    })
    .catch(err=>console.log(`Error happened when pulling from the database :${err}`));


})

//router to delete
router.delete("/delete/:id",(req,res)=>{
    
    productModel.deleteOne({_id:req.params.id})
    .then(()=>{
        res.redirect("/dashboard");
    })
    .catch(err=>console.log(`Error happened when updating data from the database :${err}`));

});


module.exports=router;
