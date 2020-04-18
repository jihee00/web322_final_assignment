const productModel = require("../model/Product");
const dashBoardLoader = (req,res)=>{

    if(req.session.userInfo.type=="Admin")
    {
        productModel.find()
        .then((product)=>{
            //Filter out the information that you want from the array of documents that was returned into
            //a new array
            //Array 300 documents meaning that the array has 300 elements 
            const filteredProduct =  product.map(product=>{
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
    else
    {
        res.render("user/dashboard");
    }

}

module.exports = dashBoardLoader;