import { Application } from "express"

const userRouter = require("./userRouter")
const { notFound, errHandler } = require('../middlewares/errorHandler')

const initRoutes = (app: Application) => {
    //user Router
    app.use('/api/user', userRouter)
    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRoutes