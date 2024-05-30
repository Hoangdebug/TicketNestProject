import { Application } from "express"

const userRouter = require("./userRouter")
const seatRouter = require("./seat")
const { notFound, errHandler } = require('../middlewares/errorHandler')

const initRoutes = (app: Application) => {
    //user Router
    app.use('/api/user', userRouter)
    app.use('/api/seat',seatRouter)
    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRoutes