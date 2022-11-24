

const jwt = require('jsonwebtoken');


// TokenVarify.
const verifyToken = ( token ) => {

    return jwt.verify( token, process.env.JWT_SECRET )

};


// Exports-verifyToken.
module.exports = verifyToken;