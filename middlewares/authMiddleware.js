const validationMsg = require("../utility/validation");

// AuthMiddlewares.
const authMiddleware = ( req, res, next ) => {

    const token = req.cookies.authToken;

    if( token ){
        validationMsg("You are already loggedin", "/user", req, res );
    }else{
        next();
    };

};


// Exports- authMiddleware.
module.exports = authMiddleware;