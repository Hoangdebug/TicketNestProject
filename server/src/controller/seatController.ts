const seat = require('../models/seat');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify')
import { Request, Response } from "express"


// function to creat Seat

const createSeat = asyncHandler(async (req: Request, res: Response) => {
    if (Object.keys(req.body).length = 0) throw new Error("Missing inputs")
    const newSeat = await seat.create(req.body)
    return res.status(200).json({
        success: newSeat ? true : false,
        code: newSeat ? 200 : 400,
        message: newSeat ? 'Create' : 'Fail',
        rs: newSeat ? newSeat : 'Cannot create new seat'
    })})

// function to get one Seat
const getSeat = asyncHandler(async (req: Request, res: Response) => {
    const { sid } = req.params
    const getseat = await seat.findById(sid)
    return res.status(200).json({
        success: getseat ? true : false,
        code: getseat ? 200 : 400,
        message: getseat ? 'Create' : 'Fail',
        rs: getseat ? getseat : 'Cannot read that seat'
    })
})


// function to update one Seat

const updateSeat = asyncHandler(async (req: Request, res: Response) => {
    const { sid } = req.params
    const updatedSeat = await seat.findByIdAndUpdate(sid, req.body, { new: true })
    return res.status(200).json({
        success: updatedSeat ? true : false,
        code: updatedSeat ? 200 : 400,
        message: updatedSeat ? 'Create' : 'Fail',
        rs: updatedSeat ? updatedSeat : 'Cannot create new seat'
    })
})

module.exports = {
    createSeat,
    getSeat,
    updateSeat
}