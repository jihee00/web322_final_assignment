const productModel = require("../model/product");
const bestsellers =
{
    fakeDB:[],
    init() {},
    getAllBestSellers()
    {
       let allproducts = []
       allproducts = productModel.getAllproducts();
        for(let i=0;i<allproducts.length;i++){
            if(allproducts[i].bestseller)
            {
               this.fakeDB.push(allproducts[i]);
            }
        }
        return this.fakeDB;
    },
}
bestsellers.init();
module.exports = bestsellers;