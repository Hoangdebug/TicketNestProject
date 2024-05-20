import express from "express"
const ctrls = require('../controller/userController')
const router = express.Router()

router.post('/register', ctrls.register)
router.post('/login', ctrls.login)

module.exports = router