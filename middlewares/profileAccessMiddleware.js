
const users = require('../models/User');
const verifyToken = require('../utility/tokenVerify');
const validationMsg = require('../utility/validation')

// Create profileAccessMiddleware.
const profileAccessMiddleware = async ( req, res, next ) => {

    try {
        
        const token = req.cookies.authToken;
    
        if( token ){

            // verify-token.
            const userToken = verifyToken(token);

            // CheckUser_token.
            if( userToken ){

                // Check UserInfo on DB.
                const userData = await users.findById(userToken.id);

                if( userData ){
                    next();
                } else {
                    delete req.session.user; 
                    res.clearCookie('authToken');
                    validationMsg("You are not authorized.", "/user/login", req, res );
                };
            };

        } else {
            delete req.session.user; 
            res.clearCookie('authToken');
            validationMsg("Please login-first", "/user/login", req, res );
        };

    } catch (error) {
        delete req.session.user; 
        res.clearCookie('authToken');
        validationMsg("You are not authorized.", "/user/login", req, res );
    };

};


// Exports-profileAccessMiddleware.
module.exports = profileAccessMiddleware;