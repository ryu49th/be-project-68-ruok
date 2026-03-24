const { response } = require('express');
const User = require('../models/User');

const sendTokenResponse = (user,statusCode,res)=>{
    const token = user.getSignedJwtToken();

    const options = {
        expires:new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production'){
        options.secure=true;
    }
    res.status(statusCode).cookie('token',token,options).json({
        success: true,
        token
    })
}

//@desc Register user
//@route POST /api/v1/auth/register
//@access Public
exports.register = async (req,res,next) => {
    try{
        const {name, tel, email, password, role} = req.body;

        const user = await User.create({
            name,
            tel,
            email,
            password,
            role
        });

        // const token = user.getSignedJwtToken();
        // res.status(200).json({success: true,token});

        sendTokenResponse(user,201,res);

    } catch(err){
        res.status(400).json({success:false});
        console.log(err.stack);
    }
      
};

exports.login=async (req,res,next) => {
    try{
    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({success:false,
            msg:'Please provide an email and password'
        });
    }

    const user = await User.findOne({email}).select('+password');

    if(!user){
        return res.status(400).json({success:false,
            msg:'Invalid credentials'
        });
    }

    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return res.status(401).json({success:false,
            msg:'Invalid credentials'
        });
    }

        // const token=user.getSignedJwtToken();
        // res.status(200).json({success:true,token});
        sendTokenResponse(user,200,res);
    }catch(err){
        return res.status(401).json({success:false,msg:'Cannot convert email or password to string'});
    }
};

//@desc Get current Logged in user
//@route POST /api/v1/auth/me
//@access Private
exports.getMe=async(req,res,next)=>{
    const user=await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        data:user
    });
};

//@desc      Update password
//@route     PUT /api/v1/auth/updatepassword
//@access    Private
exports.updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Please provide current and new password' });
        }

        const user = await User.findById(req.user.id).select('+password');

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Could not update password' });
    }
};

//@desc      Update user details
//@route     PUT /api/v1/auth/updatedetails
//@access    Private
exports.updateDetails = async (req, res, next) => {
    try {
        const { name, email, tel } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email, tel },
            { returnDocument: 'after' }
        );

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ success: false, message: err.message || 'Could not update profile' });
    }
};

//@desc      Log user out / clear cookie
//@route     GET /api/v1/auth/logout
//@access    Private
exports.logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
};