import { Request, Response } from 'express';
const asyncHandler = require("express-async-handler")
const Event = require('../models/event')
const Order = require('../models/order');
const Organize = require('../models/organizer');
const mongoose = require('mongoose'); 

//Create Event
const createEvent = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, image, time, ticket_number, price, place, status } = req.body;
    const event = new Event({
        name,
        description,
        image,
        time,
        ticket_number,
        price,
        place,
        status
    });    
    await event.save();
    return res.status(200).json({
        status: event ? true : false ,
        code: event ? 200 : 400,
        message: event ? 'Event created successfully' : 'Failed to create event',
        result: event
    });
})

//Read Event
const readEvent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const event = await Event.findById(id);

    return res.status(200).json({
        status: event ? true : false,
        code: event ? 200 : 404,
        message: event ? 'Get event information successfully' : 'Event not found', 
        result: event
    });
})

//Update Event
const updateEvent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    const event = await Event.findByIdAndUpdate(id, updates, { new: true });

    return res.status(200).json({
        status: event ? true : false,
        code: event ? 200 : 400,
        message: event ? 'Update event successfully' : 'Event not found', 
        result: event
    });
})

//Static Event By Month
const staticEventFollowByMonth = asyncHandler(async (req: Request, res: Response) => {
    const events = await Event.aggregate([
        {
            $group: {
                _id: { $month: "$time" },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { "_id": 1 }
        }
    ]);

    return res.status(200).json({
        status: events ? true : false,
        code: events ? 200 : 400,
        message: events ? 'Get event statistics successfully' : 'Failed to get event statistics',
        result: events
    });
})

//Total order by Month role Organizer

module.exports = {
    createEvent,
    readEvent,
    updateEvent,
    staticEventFollowByMonth
}