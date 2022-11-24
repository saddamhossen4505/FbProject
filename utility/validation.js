

// Validation Message.
const validationMsg = ( message, redirect, req, res ) => {

    req.session.message = message;
    res.redirect(redirect);

};


// Exports-validationMsg.
module.exports = validationMsg;