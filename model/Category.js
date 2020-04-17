const categories =
{
    categoryDB:[],
    init()
    {
        this.categoryDB.push({image:`/img/cate1.jpg`, category:`Shop Valentine's Day gifts`});
        this.categoryDB.push({image:`/img/cate2.jpg`, category:`Cleaning supplies`});
        this.categoryDB.push({image:`/img/cate3.jpg`, category:`Shop deals in Tools`});
        this.categoryDB.push({image:`/img/cate4.jpg`, category:`Smart home`});
    },
    getAllCategories()
    {
        return this.categoryDB;
    }
}
categories.init();
module.exports = categories;