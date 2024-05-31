
import { Request, Response } from 'express';
const asyncHandler = require("express-async-handler")
const Event = require('../models/event')

//Create Event
const createEvent = asyncHandler( async (req: Request, res: Response) => {
    try {
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
        res.status(200).json({ message: 'Event created successfully', event });
    } catch (error) {
        res.status(400).json({ message: 'Failed to create event', error });
    }
})

//Read Event
const readEvent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const event = await Event.findById(id);

    return res.status(200).json({
        success: event ? true : false,
        code: event ? 200 : 404,
        rs: event ? event : 'Event not found'
    });
})

//Update Event
const updateEvent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    const event = await Event.findByIdAndUpdate(id, updates, { new: true });

    return res.status(200).json({
        success: event ? true : false,
        code: event ? 200 : 400,
        rs: event ? event : 'Event not found',
    });
})

module.exports = {
    createEvent,
    readEvent,
    updateEvent
}