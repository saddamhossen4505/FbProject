


// SessionData Use-Middlewares by locals variables.
const localsMiddlewares = ( req, res, next ) => {

    res.locals.message = req.session.message;
    delete req.session.message;
    res.locals.user = req.session.user;
    next();

};


// Exports-middlewares.
module.exports = localsMiddlewares;