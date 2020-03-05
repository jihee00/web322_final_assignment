const productModel = require("../model/product");
const bestsellers =
{

    init() {},
    getAllBestSellers()
    {
       let fake = []
       let allproducts = []
       allproducts = productModel.getAllproducts();
        for(let i=0;i<allproducts.length;i++){
            if(allproducts[i].bestseller)
            {
               fake.push(allproducts[i]);
            }
        }
        return fake;
    },
}
bestsellers.init();
module.exports = bestsellers;