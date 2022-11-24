
const jwt = require('jsonwebtoken');

// Make JWT_TOKEN.
const createJwt = ( data, exp ) => {

    const token = jwt.sign( data, process.env.JWT_SECRET, {
        expiresIn : exp
    });
    
    return token;
};


// Exports-createJwt.
module.exports = createJwt;