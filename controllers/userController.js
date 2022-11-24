


const users = require('../models/User');
const hashPassword = require('../utility/hashPassword');
const validationMsg = require('../utility/validation');
const bcrypt = require('bcryptjs');
const createJwt = require('../utility/jwt');
const mailSend = require('../utility/mail');
const verifyToken = require('../utility/tokenVerify');
const resetPasswordMail = require('../utility/resetPasswordMail');
const fs = require('fs');
const path = require('path');



/**
 *  Show ProfilePage Controller.
 */
const showProfilePage = ( req, res ) => {

    res.render('profile');

};



/**
 *  showRegisterPage Controller.
 */
 const showRegisterPage = ( req, res ) => {

    res.render('register');

};


/**
 *  showLoginPage Controller.
 */
 const showLoginPage = ( req, res ) => {

    res.render('login');

};



/**
 *  Register-User Controller.
 */
const userRegister = async ( req, res ) => {

    try {
        
        // Get form_Data.
        const { name, email, password } = req.body;
        
        // Validation Here.
        if( !name || !email || !password ){

            validationMsg("All fields are required", "/user/register", req, res );

        } else{

            //If email already exits on DB.
            const isEmailExits = await users.findOne().where('email').equals(email);

            if( isEmailExits ){
                validationMsg("Email already exits Please try another email address.", "/user/register", req, res );
            }else {

                const user = await users.create({ name, email, password : hashPassword(password)});
                validationMsg("User register successfull. Please verify your account", "/user/login", req, res );

                // Create_UserToken.
                const token = createJwt({ id : user._id }, ( 1000*60*60*24*15 ));

                // Create verify_Link.
                const verifyLink = `${process.env.APP_URL}:${process.env.PORT}/user/verify/${token}`

                await mailSend(email, {
                    name : name,
                    link : verifyLink
                });
            };
            
        };

    } catch (error) {
        validationMsg(`${error.message}`, "/user/register", req, res );
    }

};



/**
 *  LoginUser-Controller.
 */
 const loginUser = async ( req, res ) => {

    try {
        
        // Get form_Data.
        const { email, password } = req.body;
        
        // Validation Here.
        if( !email || !password ){

            validationMsg("All fields are required", "/user/login", req, res );

        } else{

            // Check User.
            const exitsUser = await users.findOne().where('email').equals(email);

            if( !exitsUser ){
                validationMsg("Invalid email", "/user/login", req, res );
            } else{

                if( !exitsUser.isVerify ){
                    validationMsg("Please verify your account", "/user/login", req, res );
                } else {
                    // Check-Password.
                    isPassword = bcrypt.compareSync(password, exitsUser.password );

                    if( !isPassword ){
                        validationMsg("Invalid Password", "/user/login", req, res );
                    }else {
                        const token = createJwt({ id : exitsUser._id }, ( 1000*60*60*24*365 ));
                        res.cookie("authToken", token);
                        req.session.user = exitsUser;
                        validationMsg("User login successful", "/user", req, res );
                    };
                };

            };
        };


    } catch (error) {
        validationMsg(`${error.message}`, "/user/login", req, res );
    }

};



/**
 *  logoutUser-Controller.
 */
const logoutUser = ( req, res ) => {

    res.clearCookie("authToken");
    delete req.session.user;
    validationMsg("User logout successful. Login now.", "/user/login", req, res );

};



/**
 *  verifyUser-Controller.
 */
 const verifyUser = async ( req, res ) => {

    try {
        
        // Get token.
        const { token } = req.params;

        // Verify-token.
        const token_verify = verifyToken(token);

        if( !token_verify ){
            validationMsg("Invalid activation link", "/user/login", req, res );
        }else {

            // Get user 
            const user = await users.findById( token_verify.id );

            if( user.isVerify ){
                validationMsg( "Account already activated", "/user/login", req, res );
            }else {

                await users.findByIdAndUpdate( token_verify.id, {
                    isVerify : true,
                });

                validationMsg( "Account activation successful", "/user/login", req, res );

            };

        };

    } catch (error) {
        validationMsg(`${error.message}`, "/user/login", req, res );
    };

};




/**
 *  Show ProfilePhotoPage.
 */
const showProfilePhotoPage = (req, res ) => {

    res.render('photo');

};


/**
 *  Show passwordChangePage.
 */
 const passwordChange = (req, res ) => {

    res.render('password');

};



/**
 *  updatePassword Controller.
 */
const updatePassword = async ( req, res ) => {

    try {
        
        // GetLogin User.
        const user = req.session.user;
        // Get formData.
        const { oldPassword, newPassword, confirmPassword } = req.body;

        // Check OldPassword.
        const isPassword = bcrypt.compareSync(oldPassword, user.password )

        if( !isPassword ){
            validationMsg("Invalid password", "/user/passwordChange", req, res );
        }else {

            // Match newPassword and confirmPassword.
            const newpass = ( newPassword === confirmPassword );

            if( !newpass ){
                validationMsg("Match your new password and confirm password", "/user/passwordChange", req, res );
            }else {
                
                updatePass = hashPassword(newPassword);
                await users.findByIdAndUpdate(user._id, {
                    password : updatePass
                });
                
                res.clearCookie("authToken");
                delete req.session.user
                validationMsg( 'Password change successful', "/user/login", req, res );

            };

        };


    } catch (error) {
        validationMsg(`${error.message}`, "/user/passwordChange", req, res );
    };

};



/**
 *  Show editPage.
 */
 const editPage = async (req, res ) => {

    try {
        // Get loginUser.
        const loginUser = await users.findById(req.session.user._id);

        res.render('edit', {
            name : loginUser.name,
            email : loginUser.email,
            cell : loginUser.cell,
            location : loginUser.location,
            gender : loginUser.gender,
            skill : loginUser.skill,
        });
    } catch (error) {
        validationMsg( error.message, "/user/edit", req, res );
    };
};




/**
 *  EditData Controller.
 */
const editData = async (req, res) => {

    try {
        

        // Get formData.
        const { name, email, cell, location, gender, skill } = req.body;

        // Get UpdateUser.
        const updateUser = await users.findByIdAndUpdate( req.session.user._id, { name, email, cell, location, gender, skill });

        req.session.user.name = name
        req.session.user.email = email
        req.session.user.cell = cell
        req.session.user.location = location
        req.session.user.gender = gender
        req.session.user.skill = skill

        validationMsg( "UserData update successful", "/user/edit", req, res );

    } catch (error) {
        validationMsg( error.message, "/user/edit", req, res );
    };

};




/**
 *  Upload Profile_Photo Controller.
 */
const profile_photoUpload = async ( req, res ) => {

    try {
        // Get user and push photo key to req.file.
        const profile_photo = await users.findByIdAndUpdate( req.session.user._id, {
            photo : req.file.filename
        });

        if( profile_photo.photo ){
            fs.unlinkSync(path.join(__dirname, (`../public/images/userPhoto/${profile_photo.photo}`)))
        }

        req.session.user.photo = req.file.filename;
        validationMsg("Profile photo update successful", "/user/profile_photo", req, res );

    } catch (error) {
        validationMsg( error.message, "/user/profile_photo", req, res );
    }
    
};



/**
 *  ShowGalleryPhotoPage Controller.
 */
const showGalleryPhotoPage = (req, res ) => {

    res.render('gallery')

};





/**
 *  uploadGalleryPhoto Controller.
 */
const galleryPhotoUpload = async ( req, res ) => {

    try {
        
        let gall = [];
        req.files.forEach(items => {
            gall.push(items.filename);
            req.session.user.gallery.push(items.filename)
        });
        userGall = await users.findByIdAndUpdate(req.session.user._id, {
            $push : {
                gallery : { $each : gall }
            }
        });

        validationMsg( "Gallery photo upload successful", "/user/gallery_photo", req, res );

    } catch (error) {
        validationMsg( error.message, "/user/gallery_photo", req, res );
    };

};




/**
 *  Show ForgotPasswordController.
 */
const showForgetPasswordPage = ( req, res ) => {
    res.render('forgetPassword');
};





/**
 *  ForgoetPasswordEmailCheck Controller.
 */
const forgoetPasswordEmailCheck = async ( req, res ) => {

    try {

        // Get formData.
        const { email } = req.body;
        // CheckUser.
        const isExitsUser = await users.findOne().where('email').equals(email);

        if( !isExitsUser ){
            validationMsg( "Invalid email", "/user/forget_password", req, res );
        }else {

            // Create token.
            const token = createJwt({ id : isExitsUser._id }, ( 1000 * 60 * 10 ));
            
            // Create resetPasswordLink.
            const resetPasswordLink = `${process.env.APP_URL}:${process.env.PORT}/user/resetPassword/${token}`

            // Send ResetPasswordMail.
            resetPasswordMail( email, {
                link : resetPasswordLink
            });

            validationMsg( "Verify your email", "/user/forget_password", req, res );
            
        };

    } catch (error) {
        validationMsg( error.message, "/user/forget_password", req, res );
    };

};


/**
 *  forgetPassword
 */
const forgetPassword = (req, res ) => {

    res.render('resetPassword')

};



/**
 *  ShowResetPassword Page Controller.
 */
const resetPassword = ( req, res ) => {

    try {
        // Get token.
        const { token } = req.params;
        // token Verify.
        const verify_Token = verifyToken(token);

        if( !verify_Token ){

            validationMsg( "Invalid token", "/user/forget_password", req, res );

        }else {

            req.session.userId = verify_Token.id;
            validationMsg( "Please set your password", "/user/resetPassword", req, res );

        };

    } catch (error) {
        validationMsg( error.message, "/user/forget_password", req, res );
    }

};



/**
 *  ResetPassword Controller.
 */
const resetPasswordUpdate = async ( req, res ) => {

    try {
        // Get formData.
        const { newPassword, confirmPassword } = req.body;

        // Match password.
        const newPass = newPassword === confirmPassword

        if( !newPass ){

            validationMsg( "Match your new password and confirm password", "/user/resetPassword", req, res );
            
        }else {
            
            // Create HashPassword.
            const hash_Password = hashPassword(newPassword);

            // Get User.
            const user = await users.findByIdAndUpdate( req.session.userId, {
                password : hash_Password
            })

            delete req.session.userId;
            validationMsg( "Login Now", "/user/login", req, res );
        };
    } catch (error) {
        
    }

};



/**
 *  FindFriends Controller.
 */
const findFriends = async ( req, res ) => {

    try {
        const allFriends = await ( users.find().where('email')).ne(req.session.user.email);

        res.render('friends', {
            allFriends,
        });
    } catch (error) {}

};



/**
 *  ShowSindFriendInfo Controller.
 */
const showSindFriendInfo = async ( req, res ) => {

    try {

        // Get singleFriends ID.
        const { id } = req.params;

        // Get singleFriends Profile.
        const singleFriendProfile = await users.findById(id);

        res.render('singleFriend', {
            singleFriendProfile
        });

    } catch (error) {
        
    }

};



/**
 *  Follow A User Controller.
 */
const followUser = async ( req, res ) => {

    try {
        
        // Get followUser Id.
        const { id } = req.params;

        // Now Store FollowUser ID in LoginUser Data.
        const followUserID = await users.findByIdAndUpdate( req.session.user._id, {
            $push : {
                following : id
            }
        });


        await users.findByIdAndUpdate( id, {
            $push : {
                follower : req.session.user._id
            }
        });

        req.session.user.following.push(id);
        validationMsg( "Following Successful", "/user/find_friends", req, res );

    } catch (error) {}

};




/**
 *  UnFollow A User Controller.
 */
 const unFollowUser = async ( req, res ) => {

    try {
        
        // Get followUser Id.
        const { id } = req.params;

        // Now Store FollowUser ID in LoginUser Data.
        const unfollowUserID = await users.findByIdAndUpdate( req.session.user._id, {
            $pull : {
                following : id
            }
        });

        await users.findByIdAndUpdate( id, {
            $pull : {
                follower : req.session.user._id
            }
        });

        let updateFollower = req.session.user.following.filter( data => data != id );
        req.session.user.following = updateFollower;
        validationMsg( "UnFollow Successful", "/user/find_friends", req, res );

    } catch (error) {}

};



// Exports-Controllers.
module.exports = {
    showProfilePage,
    showRegisterPage,
    showLoginPage,
    userRegister,
    loginUser,
    logoutUser,
    verifyUser,
    showProfilePhotoPage,
    passwordChange,
    editPage,
    profile_photoUpload,
    showGalleryPhotoPage,
    galleryPhotoUpload,
    updatePassword,
    editData,
    showForgetPasswordPage,
    forgoetPasswordEmailCheck,
    resetPassword,
    resetPasswordUpdate,
    forgetPassword,
    findFriends,
    showSindFriendInfo,
    followUser,
    unFollowUser
};