import { count } from 'console';
import { Request, Response } from 'express';
import moment from 'moment';
const asyncHandler = require("express-async-handler")
const Event = require('../models/event')
const Order = require('../models/order');
const Organize = require('../models/organizer');
const mongoose = require('mongoose');

//  static event by month for systems role Admin
const staticEventByAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { date } = req.query;

    // Parse the date to get the start and end of the month
    const startDate = date ? moment(date as string, "MM-YYYY").startOf("month").toDate() : moment().startOf("month").toDate();
    const endDate = date ? moment(date as string, "MM-YYYY").endOf("month").toDate() : moment().endOf("month").toDate();

    const events = await Event.find({
        time: {
            $gte: startDate,
            $lte: endDate
        }
    });

    return res.status(200).json({
        status: true,
        code: 200,
        message: 'Get event statistics successfully',
        result: events.length
    });
});

const totalPriceOrderInMonth = asyncHandler(async (req: Request, res: Response) => {
    const { date } = req.query;

    const startDate = date ? moment(date as string, "MM-YYYY").startOf("month").toDate() : moment().startOf("month").toDate();
    const endDate = date ? moment(date as string, "MM-YYYY").endOf("month").toDate() : moment().endOf("month").toDate();

    const orders = await Order.find({
        settime: {
            $gte: startDate,
            $lte: endDate
        }
    });

    const totalPrice = orders.reduce((acc: number, curr: any) => acc + curr.totalmoney, 0);

    return res.status(200).json({
        status: true,
        code: 200,
        message: 'Get event statistics successfully',
        result: totalPrice
    });
});


export { staticEventByAdmin, totalPriceOrderInMonth }