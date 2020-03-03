const categories =
{
    fakeDB:[],
    init()
    {
        this.fakeDB.push({image:`/img/cate1.jpg`, category:`Shop Valentine's Day gifts`});
        this.fakeDB.push({image:`/img/cate2.jpg`, category:`smart home`});
        this.fakeDB.push({image:`/img/cate3.jpg`, category:`Shop deals in Tools`});
        this.fakeDB.push({image:`/img/cate4.jpg`, category:`smart home`});
    },
    getAllCategories()
    {
        return this.fakeDB;
    }
}
categories.init();
module.exports = categories;