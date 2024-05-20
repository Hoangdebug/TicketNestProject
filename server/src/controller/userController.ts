import { Request, Response } from "express"
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const User = require('../models/user')
const asyncHandler = require("express-async-handler")
const jwt = require('jsonwebtoken')

const register = asyncHandler( async (req: Request, res: Response) => {
    const { email, password, lastname, firstname, mobile } = req.body
    if(!email || !password || !firstname || !lastname || !mobile)
    return res.status(400).json({
        success: false,
        mes: "Missing input"
    })

    const user = await User.findOne({email, mobile})
    if(user)
        throw new Error('User has existed')
    else{
        const newUser = await User.create(req.body)
        return res.status(200).json({
            success: newUser ? true : false,
            mes: newUser ? 'Create successfully' : 'Invalid information'
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
        mes: "Missing input"
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
            accessToken,
            userData
        })
    }else{
        throw new Error('Invalid credential')
    }
})


module.exports = {
    register,
    login
}