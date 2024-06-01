import { Request, Response } from "express"
const { generateAccessToken, generateRefreshToken } = require('../config/jwt')
const User = require('../models/user')
const asyncHandler = require("express-async-handler")
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sendMail = require('../config/sendMail')

const register = asyncHandler( async (req: Request, res: Response) => {
    const { email, password, username, dob, phone } = req.body
    console.log(req.body);
    
    if(!email || !password || !dob || !username || !phone)
    return res.status(400).json({
        success: false,
        code: 400,
        rs: "Missing input"
    })

    const user = await User.findOne({email, phone})
    if(user)
        throw new Error('User has existed')
    else{
        const newUser = await User.create(req.body)
        return res.status(200).json({
            success: newUser ? true : false,
            code: newUser ? 200 : 400,
            mes: newUser ? "Create successfully" : "Can not create user",
            rs: newUser ? newUser : 'Invalid information'
        })
    }
})


// RefreshToken => cấp mới accessToken
// AccessToken => Xác thực người dùng
const login = asyncHandler( async (req: Request, res: Response) => {
    const { email, password } = req.body
    if(!email || !password)
    return res.status(400).json({
        success: false,
        code: 400,
        rs: "Missing input"
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
        success: user ? true : false,
        code: user ? 200 : 400,
        mess : user ? 'User found' : 'User not found',
        rs: user ? user : 'User not found'
    })
})

const refreshAccessToken = asyncHandler(async(req: Request, res: Response) => {
    const cookie = req.cookies
    // const { _id } = req
    if( !cookie && cookie.refreshToken) throw new Error('No refresh Token in cookie')

    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        code: response? 200 : 400,
        rs: response ? generateAccessToken(response._id, response.role) : 'Refresh Token invalid'
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
        rs: "Log out successfully"
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
    const html = `Please click on below link to change your password!! Link will expired in 15 minutes from now 
        <br> <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here!!!</a>`
 
    const data = {
        email,
        html
    }

    const rs = await sendMail(data)
    return res.status(200).json({
        success: true,
        rs
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
        success: user ? true : false,
        code: user ? 200 : 400,
        mes: user? 'Update password' : 'Something went wrong',
        rs: user,
    })
})

//Lấy tất cả người dùng
const getAllUser = asyncHandler(async(req: Request, res: Response) => {
    const response = await User.find().select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        code: response ? 200 : 400, 
        mes: response ? 'Get all users' : 'Can not get all users', 
        rs: response
    })
})

//Xóa tài khoản
const deleteUser = asyncHandler(async(req: Request, res: Response) => {
    const {_id} = req.query
    if(!_id) throw new Error('Please modified Id!!!')
    const response = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        success: response ? true : false,
        code: response ? 200 : 400,
        rs: response ? `User with email ${response.email} had been deleted` : 'User not found'
    })
})

//Cập nhập tài khoản người dùng hiện tại
const updateUser = asyncHandler(async(req: Request, res: Response) => {
    const {_id} = req.user
    if(!_id || Object.keys(req.body).length === 0) throw new Error('Please modified information!!!')
    const response = await User.findByIdAndUpdate(_id, req.body, {new: true}).select('-password -role')
    return res.status(200).json({
        success: response ? true : false,
        code: response ? 200 : 400,
        mes: response ? `User with email ${response.email} had been updated` : 'Update user failed',
        rs: response ? response : 'Something went wrong!!!!',
    })
})

//Cập nhập tài khoản người dùng bởi admin
const updateUserbyAdmin = asyncHandler(async(req: Request, res: Response) => {
    const { _id } = req.params
    if(Object.keys(req.body).length === 0) throw new Error('Please modified information!!!')
    const response = await User.findByIdAndUpdate(_id, req.body, {new: true}).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        code: response ? 200 : 400,
        mes: response ? `User with email ${response.email} had been updated` : 'Update user failed',
        rs: response ? response : 'Something went wrong!!!!',
    })
})

//Cấm tài khoản người dùng bởi user
const banUserByAdmin = asyncHandler(async(req: Request, res: Response) => {
    const { _id } = req.params
    if(!_id) throw new Error('Please modified Id!!!')
    const response = await User.findByIdAndUpdate(_id, {isBlocked: true}, {new: true}).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        code: response ? 200 : 400,
        mes: response ? `User with email ${response.email} had been ban` : 'Ban user failed',
        rs: response ? response : 'Something went wrong!!!!'
    })
})


const uploadImage= asyncHandler(async(req: Request, res: Response) => {
    const { _id } = req.params
    if(!req.files) throw new Error('Missing input files')
    const response = await User.findByIdAndUpdate(_id, {$push: {image: {$each: req.files.map((el: {path: string}) => el.path)}}}, {new: true})
    return res.status(200).json({
        status: response ? true : false,
        code: response ? 200 : 400,
        mes: response ? 'Image uploaded successfully' : 'Can not upload image',
        rs: response ? response : 'Can not upload file!!!!'
    })
})

const updateAddress = asyncHandler(async(req: Request, res: Response) => {
    const { _id } = req.user
    if(!req.body.address) throw new Error('Please modified information!!!')
    const response = await User.findByIdAndUpdate(_id, {$push: {address: req.body.address}}, {new: true}).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        code: response ? 200 : 400,
        mes: response ? 'Update address successfull' : 'Can not update address',
        rs: response ? response : 'Something went wrong!!!!'
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
    updateAddress,
    banUserByAdmin,
    uploadImage
}