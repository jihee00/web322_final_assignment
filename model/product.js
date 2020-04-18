const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//This indicates the shape of the documents that will be entering the database
const productSchema = new Schema({
   
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

    category:
    {
      type:String,
      required:true
    },

    bestseller:
    {
      type:String,
      required:true
    },

    productPic:
    {
      type: String,
      required:true
    },

    link:
    {
        type:String,
        default: `#`
    },

    dateCreated:
    {
        type:Date,
        default:Date.now()
    }

  });

  /*
    For every Schema you create(Create a schema per collection), you must also create a model object. 
    The model will allow you to perform CRUD operations on a given collection!!! 
  */

 const productModel = mongoose.model('Product', productSchema);

 module.exports = productModel; 





























