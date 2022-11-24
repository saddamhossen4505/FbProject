const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const expressLayouts = require('express-ejs-layouts');
const userRoute = require('./routes/userRoute');
const mongoDbConnection = require('./config/db');
const session = require('express-session');
const localsMiddlewares = require('./middlewares/localmiddlewares');
const cookieParser = require('cookie-parser');



// Init-Express.
const app = express();

// Init-Environment-Variables.
dotenv.config();
const PORT = process.env.PORT || 4000;


// Static-Folder.
app.use(express.static('public'));


// Data-Manage.
app.use(express.json());
app.use(express.urlencoded({ extended : false }));


// Init-EJS.
app.set("view engine", "ejs");
app.set("layout", "layouts/app");
app.use(expressLayouts);



// Init-Cookie_Memory.
app.use(cookieParser());


// Init-Session Memory.
app.use(session({

    secret : "I Love Bangladesh",
    saveUninitialized : true,
    resave : false

}));


// Use sessionData by LocalsMiddlewares.
app.use(localsMiddlewares);



// Connect-Router.
app.use('/user', userRoute );



// Create Server.
app.listen(PORT, () => {
    mongoDbConnection();
    console.log(`Server is running on port ${PORT}`.bgMagenta.black);
});