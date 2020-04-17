const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//This indicates the shape of the documents that will be entering the database
const orderSchema = new Schema({
   
    name:
    {
      type:String,
      required:true
    },

    price:
    {
      type:Number,
      required:true
    },

    description: 
    {
        type:String,
        required:true
    },

    quantity:
    {
      type:Number,
      required:true
    },

    productPic:
    {
      type: String
    },

    dateCreated:
    {
        type:Date,
        default:Date.now()
    },

    createBy:
    {
      type:String,
      required:true
    }

  });

  /*
    For every Schema you create(Create a schema per collection), you must also create a model object. 
    The model will allow you to perform CRUD operations on a given collection!!! 
  */

 const orderModel = mongoose.model('Order', orderSchema);

 module.exports = orderModel; 
