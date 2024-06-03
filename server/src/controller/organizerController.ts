const organizer = require('../models/organizer');
const asyncHandler = require('express-async-handler');
import { Request, Response } from "express"; 

//function to creat organizer

const createOrganizer = asyncHandler(async(req: Request, res: Response) =>{
    if(Object.keys(req.body).length = 0) throw new Error("Missing input");
    const  newOrganizer = await organizer.create(req.body)
    return res.status(200).json({
        success : newOrganizer ? true : false,
        code: newOrganizer ? 200 :400,
        message : newOrganizer? 'Create': 'Fail',
        rs: newOrganizer ? newOrganizer : "Cannot create new seat"
    })
})

//function to get one organizer

const getOrganizer = asyncHandler(async (req: Request, res: Response) => {
    const { oid } = req.params
    const getseat = await organizer.findById(oid)
    return res.status(200).json({
        success: getOrganizer ? true : false,
        code: getOrganizer ? 200 : 400,
        message: getOrganizer ? 'Create' : 'Fail',
        rs: getOrganizer ? getOrganizer : 'Cannot read that organizer'
    })
})

// function to update one Seat

const updateOrganizer = asyncHandler(async (req: Request, res: Response) => {
    const { oid } = req.params
    const updateOrganizer = await organizer.findByIdAndUpdate(oid, req.body, { new: true })
    return res.status(200).json({
        success: updateOrganizer ? true : false,
        code: updateOrganizer ? 200 : 400,
        message: updateOrganizer ? 'Create' : 'Fail',
        rs: updateOrganizer ? updateOrganizer : 'Cannot update seat'
    })
})

module.exports ={
    createOrganizer,
    getOrganizer,
    updateOrganizer
}