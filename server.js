//imports
const express= require("express");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');


//This loads all our environment variables from the keys.env
require('dotenv').config({path:"./config/keys.env"});

//import your router objects
const userRoutes = require("./controllers/User");
const productRoutes = require("./controllers/Product");
const generalRoutes = require("./controllers/General");

//creation of app object
const app = express();

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))

//loading static assests middleware
app.use(express.static("public"));

//handlebars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//MAPs EXPRESS TO ALL OUR  ROUTER OBJECTS
app.use("/",generalRoutes);
app.use("/user",userRoutes);
app.use("/product",productRoutes);
app.use("/",(req,res)=>{
    res.render("general/404");
});

const PORT= process.env.PORT;
//This creates an Express Web Server that listens to HTTP Reuqest on port 3000
app.listen(PORT,()=>{
    console.log(`Web Server Started`);
});