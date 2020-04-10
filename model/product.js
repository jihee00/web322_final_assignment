const products =
{
    fakeDB:[],

    init()
    {
        this.fakeDB.push({image:`/img/p1.jpg`, title:`LIGHTING`, price:`CDN$ 19.99`, category:`smart home`, bestseller:false});
        this.fakeDB.push({image:`/img/p2.jpg`, title:`PC`, price:`CDN$ 1999.98`, category:`smart home`, bestseller:false});
        this.fakeDB.push({image:`/img/p3.jpg`, title:`CAMERAS`, price:`CDN$ 1599.99`, category:`smart home`, bestseller:true});
        this.fakeDB.push({image:`/img/p4.jpg`, title:`DOOR LOCKS`,price:`CDN$ 185.66`, category:`smart home`, bestseller:true});
        this.fakeDB.push({image:`/img/p5.jpg`, title:`THERMOSTATS`,price:`CDN$ 88.88`, category:`smart home`, bestseller:true});
        this.fakeDB.push({image:`/img/p6.jpg`, title:`TELEVISIONS`,price:`CDN$ 3000.99`, category:`smart home`, bestseller:true});
    },
    getAllproducts()
    {
        return this.fakeDB;
    },
}

products.init();
module.exports = products;
