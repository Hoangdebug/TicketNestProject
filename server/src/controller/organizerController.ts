const organizer = require('../models/organizer');
const asyncHandler = require('express-async-handler');
import { Request, Response } from "express"; 

//function to creat organizer

const createOrganizer = asyncHandler(async(req: Request, res: Response) =>{
    if(Object.keys(req.body).length = 0) throw new Error("Missing input");
    const  newOrganizer = await organizer.create(req.body)
    return res.status(200).json({
        status: newOrganizer ? true : false,
        code: newOrganizer ? 200 : 400,
        message: newOrganizer ? "Create organizer successfully" : "Can not create organizer",
        result: newOrganizer ? newOrganizer : 'Invalid information'
    })
})

//function to get one organizer

const getOrganizer = asyncHandler(async (req: Request, res: Response) => {
    const { oid } = req.params
    const getOrganizer = await organizer.findById(oid)
    return res.status(200).json({
        status: getOrganizer ? true : false,
        code: getOrganizer ? 200 : 400,
        message: getOrganizer ? "Get organizer successfully" : "Can not get organizer",
        result: getOrganizer ? getOrganizer : 'Invalid information'
    })
})

// function to update one Seat

const updateOrganizer = asyncHandler(async (req: Request, res: Response) => {
    const { oid } = req.params
    const updateOrganizer = await organizer.findByIdAndUpdate(oid, req.body, { new: true })
    return res.status(200).json({
        status: updateOrganizer ? true : false,
        code: updateOrganizer ? 200 : 400,
        message: updateOrganizer ? "Update organizer successfully" : "Can not update organizer",
        result: updateOrganizer ? updateOrganizer : 'Invalid information'
    })
})

module.exports ={
    createOrganizer,
    getOrganizer,
    updateOrganizer
}