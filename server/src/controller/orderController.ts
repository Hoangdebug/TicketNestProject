import { Request, Response } from 'express'
const asyncHandler = require ("express-async-handler")
const Order = require ('../models/order')

// Create Order
const createOrder = asyncHandler(async (req: Request, res: Response) => {
    const { status, seatcode, totalmoney, settime } = req.body
    const order = new Order({
        status,
        seatcode,
        totalmoney,
        settime,
    })

    if (!seatcode || !totalmoney || !settime) {
        return res.status(400).json({
            status: false,
            code: 400,
            result: 'All fields are required'
        })
    }    
    
    await order.save()
    return res.status(200).json({
        status: order ? true : false,
        code: order ? 200 : 400,
        message: order ? 'Order created successfully' : 'Failed to create order',
        result: order
    })
})

// Read Order
const getOrder = asyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('seatcode')
    
    return res.status(200).json({
        status: true ? true : false,
        code: order ? 200 : 400,
        message: order? 'Order found' : 'Order not found',
        result: order
    })    
})

// Update Order
const updateOrder = asyncHandler(async (req: Request, res: Response) => {
    const {_id } = req.params
    const { status, seatcode, totalmoney, settime } = req.body

    if(!status && !seatcode && !totalmoney && !settime) throw new Error('Please provide information to update!')    
    
    const updateData: any = {}
    if (status) updateData.status = status
    if (seatcode) updateData.seatcode = seatcode
    if (totalmoney) updateData.totalmoney = totalmoney
    if (settime) updateData.settime = settime

    const response = await Order.findByIdAndUpdate(_id, updateData, { new: true })
    
    return res.status(200).json({
        status: response ? true : false,
        code: response ? 200 : 400,
        message: response ? 'Update order successful' : 'Order not found',
        result: response
    })
})

// Delete Order
const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
    const {_id} = req.query
    if(!_id) throw new Error('Order not found')
    const response = await Order.findByIdAndDelete(_id)
    
    return res.status(200).json({
        status: response ? true : false,
        code: response ? 200 : 400,
        message: response ? 'Order had been deleted' : 'Order not found', 
        result: response 
    })    
})

module.exports = { 
    createOrder, 
    getOrder, 
    updateOrder, 
    deleteOrder
}