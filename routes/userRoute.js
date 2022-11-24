const express = require('express');
const { verify } = require('jsonwebtoken');

const { showProfilePage, showRegisterPage, showLoginPage, userRegister, loginUser, logoutUser, verifyUser, showProfilePhotoPage, passwordChange, updatePassword, editPage, editData, profile_photoUpload, showGalleryPhotoPage, galleryPhotoUpload, showForgetPasswordPage, forgoetPasswordEmailCheck, resetPassword, resetPasswordUpdate, forgetPassword, findFriends, showSindFriendInfo, followUser, unFollowUser } = require('../controllers/userController');

const authMiddleware = require('../middlewares/authMiddleware');
const profileAccessMiddleware = require('../middlewares/profileAccessMiddleware');
const multer = require('multer');
const path = require('path');


// Init Multer.
const storage = multer.diskStorage({
    destination : (req, file, cb ) => {

        if( file.fieldname == "profile" ){
            cb(null, path.join(__dirname, '../public/images/userPhoto/'));
        }

        if( file.fieldname == "gallery"){
            cb(null, path.join(__dirname, '../public/images/galleryPhoto/'));
        }
    },
    filename : ( req, file, cb ) => {

        cb(null, Date.now() + '_' + Math.floor( Math.random() * 1000000 ) + '_' + file.originalname );
    }
});

// Profile_photo middleware.
const profilePhotoMulter = multer({
    storage
}).single('profile');



// Gallery_photo middleware.
const galleryPhotoMulter = multer({
    storage
}).array('gallery');


// Init-Router.
const router = express.Router();



// User_Routes.
router.route('/').get( profileAccessMiddleware, showProfilePage );
router.route('/register').get( authMiddleware, showRegisterPage ).post( userRegister );
router.route('/login').get( authMiddleware, showLoginPage ).post( loginUser );
router.route('/logout').get( logoutUser );
router.route('/verify/:token').get( verifyUser );


router.route('/forget_password').get( showForgetPasswordPage );
router.route('/forget_password').post( forgoetPasswordEmailCheck );
router.route('/resetPassword').get( forgetPassword );
router.route('/resetPassword/:token').get( resetPassword );
router.route('/resetPassword').post( resetPasswordUpdate );


router.route('/profile_photo').get( profileAccessMiddleware, showProfilePhotoPage );
router.route('/profile_photo').post( profileAccessMiddleware, profilePhotoMulter, profile_photoUpload );


router.route('/gallery_photo').get( profileAccessMiddleware, profilePhotoMulter, showGalleryPhotoPage );
router.route('/gallery_photo').post( profileAccessMiddleware, galleryPhotoMulter, galleryPhotoUpload );


router.route('/passwordChange').get( profileAccessMiddleware, passwordChange );
router.route('/passwordChange').post( profileAccessMiddleware, updatePassword );


router.route('/edit').get( profileAccessMiddleware, editPage );
router.route('/edit').post( profileAccessMiddleware, editData );



router.route('/follow/:id').get( profileAccessMiddleware, followUser );
router.route('/unfollow/:id').get( profileAccessMiddleware, unFollowUser );




router.route('/find_friends').get( profileAccessMiddleware, findFriends );
router.route('/find_friends/:id').get( profileAccessMiddleware, showSindFriendInfo );




// Exports Router.
module.exports = router;