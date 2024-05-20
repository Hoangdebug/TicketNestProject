import { NextFunction, Request, Response } from "express"

const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Route ${req.originalUrl} is not found`)

    res.status(404)
    next(error)
}

const errHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    return res.status(statusCode).json({
        success: false,
        mes: error?.message
    })
}

module.exports = {
    notFound,
    errHandler
}