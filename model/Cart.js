const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//This indicates the shape of the documents that will be entering the database
const cartSchema = new Schema({
   
    userid: {
      type:String,
      required: true
    },

    username:
    {
        type:String,
        required:true
    },

    useremail:
    {
        type:String,
        required:true
    },

    products:
    {
        type:Array,
        required:true
    },

    products_qty:
    {
        type: Array,
        required: true,
        default: 1
    },

    total_amount:
    {
        type:Number,
        default:0.00,
    },

    total_items:
    {
        type:Number,
        default: 0
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
   /*
  */

 const cartModel = mongoose.model('Cart', cartSchema);

 module.exports = cartModel; 
