const seat = require('../models/seat');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify')
import { Request, Response } from "express"


// function to creat Seat

const createSeat = asyncHandler(async(req: Request, res: Response) => {
    if(Object.keys(req.body).length = 0) throw new Error("Missing inputs")
    const newSeat = await seat.create(req.body)
    return res.status(200).json({
        success: newSeat ? true : false,
        createSeat: newSeat ? newSeat : 'Cannot create new seat'
    })
})

// function to get one Seat
const getSeat = asyncHandler(async(req: Request, res: Response) => {
    const {sid} = req.params
    const getseat = await seat.findById(sid)
    return res.status(200).json({
        success: getseat ? true : false,
        seatData: getseat ? getseat : 'Cannot get seat'
    })
})

// function to update one Seat

const updateSeat = asyncHandler(async(req: Request, res: Response) => {
    const {sid} = req.params
    const updatedSeat = await seat.findByIdAndUpdate(sid,req.body, {new: true})
    return res.status(200).json({
        success: updatedSeat ? true : false,
        updateData: updatedSeat ? updatedSeat : 'Cannot update seat'
    })
})

module.exports = {
    createSeat,
    getSeat,
    updateSeat
}