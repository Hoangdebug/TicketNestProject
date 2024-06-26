import { Request, Response } from "express"
const { generateAccessToken, generateRefreshToken } = require('../config/jwt')
const User = require('../models/user')
const Organizer = require('../models/organizer')
const asyncHandler = require("express-async-handler")
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sendMail = require('../config/sendMail')

const register = asyncHandler( async (req: Request, res: Response) => {
    const { email, password, username, dob, phone } = req.body
    console.log(req.body);
    
    if(!email || !password || !dob || !username || !phone)
        return res.status(400).json({
        status: false,
        code: 400,
        message: 'Invalid input',
        result: "Missing input"
    })

    const user = await User.findOne({email, phone})
    if(user)
        throw new Error('User has existed')     
    else{
        const newUser = await User.create(req.body)
        return res.status(200).json({
            status: newUser ? true : false,
            code: newUser ? 200 : 400,
            message: newUser ? "Create successfully" : "Can not create user",
            result: newUser ? newUser : 'Invalid information'
        })
    }
})


// RefreshToken => cấp mới accessToken
// AccessToken => Xác thực người dùng
const login = asyncHandler( async (req: Request, res: Response) => {
    const { email, password } = req.body
    if(!email || !password)
    return res.status(400).json({
        status: false,
        code: 400,
        message: 'Invalid input',
        result: "Missing input"
    })

    const response = await User.findOne({ email })
    if(response && await response.isCorrectPassword(password)){
        //Tách password và role ra khỏi response
        const { password, role, refreshToken, ...userData } = response.toObject()
        //Tạo access Token
        const accessToken = generateAccessToken(response._id, role)
        //Tạo refresh token
        const newrefreshToken = generateRefreshToken(response._id)
        //Lưu refreshToken vào db
        await User.findByIdAndUpdate(response._id, {refreshToken: newrefreshToken} , {new: true})
        //Lưu refreshToken vào cookie
        res.cookie('refreshToken', newrefreshToken, {httpOnly: true, maxAge: 720000})
        return res.status(200).json({
            success: true,
            code: 200,
            accessToken,
            userData
        })
    }else{
        throw new Error('Invalid credential')
    }
})


const getCurrent = asyncHandler( async (req: Request, res: Response) => {
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password')
    return res.status(200).json({
        status: user ? true : false,
        code: user ? 200 : 400,
        message : user ? 'User found' : 'User not found',
        result: user ? user : 'User not found'
    })
})

const refreshAccessToken = asyncHandler(async(req: Request, res: Response) => {
    const cookie = req.cookies
    // const { _id } = req
    if( !cookie && cookie.refreshToken) throw new Error('No refresh Token in cookie')

    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        status: response ? true : false,
        code: response? 200 : 400,
        message: response? 'Refresh token valid' : 'Refresh token invalid',
        result: response ? generateAccessToken(response._id, response.role) : 'Refresh Token invalid'
    })
})

const logout = asyncHandler(async(req: Request, res: Response) => {
    const cookie = req.cookies
    if(!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    //Xóa refresh token ở db
    await User.findOneAndUpdate({refreshToken: cookie.refreshToken}, {refreshToken: ''}, {new: true})
    //Xóa refresh token ở trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        code: 200,
        message: 'Log out successfully',
        result: 'Log out successfully'
    })
})

//New format change
//Client gửi email
//Sever check email có hợp lệ hay không => Gửi mail và kèm theo link (password change token)
//Client check mail => click link
//Client gửi api kèm token
//Check token có giống với token mà sever gửi mail hay không
//Change password 

const forgotPassword = asyncHandler(async(req: Request, res: Response) => { 
    const { email } = req.query
    if( !email ) throw new Error('Missing email')
    const user = await User.findOne({ email })
    if(!user) throw new Error('User not found!! Invalid email')
    const resetToken = user.createPasswordChangeToken()
    await user.save()

    //Send mail
    const html = `
    <div style="font-family: Arial, sans-serif; padding: 48px;">
    <img style="width: 100%; height: 100%;" src="" alt="Logo" />
    <div style="padding: 10px; gap: 32px;">
        <h1 style="font-size: 45px; margin-bottom: 10px;">Hi ${user.username},</h1>
        <div style="font-size: 20px; line-height: 3; margin-bottom: 1rem;">
            <p>You have requested a password reset for your TicketNest account. Please click on the button below.</p>
        </div>
        <br>
        <br>
        <div style="text-align: center;">
            <a href="${process.env.URL_SERVER}/api/user/reset-password/${resetToken}" 
                style="display: inline-block; padding: 20px 45px; background-color: #396961; color: white; 
                border-radius: 10px; max-width: 400px; font-size: 20px; 
                text-decoration: none; text-align: center;">Reset Password</a>
        </div>
        <div style="font-size: 20px; line-height: 3; margin-bottom: 1rem;">
            <p>If you did not make this request, you can safely ignore this email.</p>
            <p>Best Regards, <br><strong style="color: #396961;">TicketNest team</strong></p>
        </div>
        <hr>
        <div style="text-align: center; margin-top: 20px;">
            <a href="https://www.facebook.com/your-facebook-page-url" target="_blank" style="text-decoration: none; margin: 0 10px;">
                <img src="" alt="Facebook" style="width: 60px; height: 60px;">
            </a>
            <a href="https://www.instagram.com/your-instagram-page-url" target="_blank" style="text-decoration: none; margin: 0 10px;">
                <img src="" alt="Instagram" style="width: 60px; height: 60px;">
            </a>
        </div>
        <hr>
        <div style="text-align: center;">
            <p>&copy; 2024 TicketNest. All rights reserved.</p>
            <br>
            <p>You are receiving this mail because you registered to join the TicketNest platform as a user or a creator. This also shows that you agree to our Terms of Use and Privacy Policies. If you no longer want to receive mails from us, click the unsubscribe link below to unsubscribe.</p>
            <p>
                <a href="#" style="color: black; text-decoration: none;">Privacy Policy</a> •
                <a href="#" style="color: black; text-decoration: none;">Terms of Service</a> •
                <a href="#" style="color: black; text-decoration: none;">Help Center</a> •
                <a href="#" style="color: black; text-decoration: none;">Unsubscribe</a>
            </p>
        </div>
    </div>
</div>`
 
    const data = {
        email,
        html
    }

    const rs = await sendMail(data)
    return res.status(200).json({
        status: true,
        code: 200,
        message: 'Send mail successfully',
        result: rs ? rs : "Failed to send mail"
    })
})

const resetPassword = asyncHandler(async(req: Request, res: Response) => {
    const { password, token } = req.body
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({passwordResetToken, passwordResetExpire: {$gt: Date.now()}})
    if(!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangedAt = Date.now()
    user.passwordResetExpire = undefined
    await user.save()
    return res.status(200).json({
        status: user ? true : false,
        code: user ? 200 : 400,
        message: user? 'Update password' : 'Something went wrong',
        result: user,
    })
})

//Lấy tất cả người dùng
const getAllUser = asyncHandler(async(req: Request, res: Response) => {
    const response = await User.find().select('-refreshToken -password -role')
    return res.status(200).json({
        status: response ? true : false,
        code: response ? 200 : 400, 
        message: response ? 'Get all users' : 'Can not get all users', 
        result: response
    })
})

//Xóa tài khoản
const deleteUser = asyncHandler(async(req: Request, res: Response) => {
    const {_id} = req.query
    if(!_id) throw new Error('Please modified Id!!!')
    const response = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        status: response ? true : false,
        code: response ? 200 : 400,
        message: response ? 'Delete user successfully' : 'User not found',
        result: response ? `User with email ${response.email} had been deleted` : 'User not found'
    })
})

//Cập nhập tài khoản người dùng hiện tại
const updateUser = asyncHandler(async(req: Request, res: Response) => {
    const {_id} = req.user
    if(!_id || Object.keys(req.body).length === 0) throw new Error('Please modified information!!!')
    const response = await User.findByIdAndUpdate(_id, req.body, {new: true}).select('-password -role')
    return res.status(200).json({
        status: response ? true : false,
        code: response ? 200 : 400,
        message: response ? `User with email ${response.email} had been updated` : 'Update user failed',
        result: response ? response : 'Something went wrong!!!!',
    })
})

//Cập nhập tài khoản người dùng bởi admin
const updateUserbyAdmin = asyncHandler(async(req: Request, res: Response) => {
    const { _id } = req.params
    if(Object.keys(req.body).length === 0) throw new Error('Please modified information!!!')
    const response = await User.findByIdAndUpdate(_id, req.body, {new: true}).select('-password -role -refreshToken')
    return res.status(200).json({
        status: response ? true : false,
        code: response ? 200 : 400,
        message: response ? `User with email ${response.email} had been updated` : 'Update user failed',
        result: response ? response : 'Something went wrong!!!!',
    })
})

//Cấm tài khoản người dùng bởi user
const banUserByAdmin = asyncHandler(async(req: Request, res: Response) => {
    const { _id } = req.params
    if(!_id) throw new Error('Please modified Id!!!')
    const response = await User.findByIdAndUpdate(_id, {isBlocked: true}, {new: true}).select('-password -role -refreshToken')
    return res.status(200).json({
        status: response ? true : false,
        code: response ? 200 : 400,
        message: response ? `User with email ${response.email} had been ban` : 'Ban user failed',
        result: response ? response : 'Something went wrong!!!!'
    })
})


const uploadImage= asyncHandler(async(req: Request, res: Response) => {
    const { _id } = req.params
    if(!req.files) throw new Error('Missing input files')
    const response = await User.findByIdAndUpdate(_id, {$push: {image: {$each: req.files.map((el: {path: string}) => el.path)}}}, {new: true})
    return res.status(200).json({
        status: response ? true : false,
        code: response ? 200 : 400,
        message: response ? 'Image uploaded successfully' : 'Can not upload image',
        result: response ? response : 'Can not upload file!!!!'
    })
})


const updateRolebyAdmin = asyncHandler(async(req: Request, res: Response) => {
    const { _id } = req.params
    if(!req.body.role) throw new Error('Please modified information!!!')
    const response = await User.findByIdAndUpdate(_id, {role: req.body.role}, {new: true}).select('-password -role -refreshToken')
    return res.status(200).json({
        status: response ? true : false,
        code: response ? 200 : 400,
        message: response ? 'Update role successfull' : 'Can not update role',
        result: response ? response : 'Something went wrong!!!!'
    })
})

const userRequestOrganizer = asyncHandler(async(req: Request, res: Response) => {
    const { _id } = req.user
    const { name, description, contact_email, contact_phone } = req.body;
    if(!name || !description) throw new Error('Missing information!!!')
    const user = await User.findById(_id)
    console.log(user)
    if(!user) throw new Error('User not found')
    
    // check user request exists

    if(user.organizerRequest == 'Processing' ) throw new Error(' You have already requested to become an organizer') 
    if(!req.body) throw new Error(`Please check your request ${req.body}`)
    user.organizerRequest = 'Processing'
    await user.save()
    const response = await Organizer.create({name: name, description: description, 
        contact_email: contact_email, contact_phone: contact_phone , sponsor_by: _id
    })
    console.log(response)
    return res.status(200).json({
        status: response ? true : false,
        code: response ? 200 : 400,
        message: response ? 'User request has been sent' : 'Can not send user request',
        result: response ? response : 'Something went wrong!!!!'
    })
})

const organizerPermitByAdmin = asyncHandler(async(req: Request, res: Response) => {
    const { uid } = req.params

    const { permit } = req.body;
    const response = await User.findById(uid)
    if(!response) throw new Error('User not found')
    
    if(response.organizerRequest = 'Processing'){
        if( permit == 'Accepted')
            response.role = "ROLE_ORGANIZER"
            response.type = "Organizer"
            response.organizerRequest = permit
            await response.save()
    }
    console.log(response.organizerRequest)

    return res.status(200).json({
        status: response ? true : false,
        code: response ? 200 : 400,
        message: response ? `User with email ${response.email} has been promoted to organizer.` : 'Can not send user request',
        result: response ? response : 'Something went wrong!!!!'
    })
})

module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getAllUser,
    deleteUser,
    updateUser,
    updateUserbyAdmin,
    banUserByAdmin,
    uploadImage,
    updateRolebyAdmin,
    userRequestOrganizer,
    organizerPermitByAdmin
}