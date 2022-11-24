

const bcrypt = require('bcryptjs');


// Make HashPassword.
const hashPassword = (password) => {

    const salt = bcrypt.genSaltSync(10);
    hash = bcrypt.hashSync(password, salt);
    return hash;

};


// Exports hashPassword.
module.exports = hashPassword;