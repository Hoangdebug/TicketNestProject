import express from 'express'
const router = express.Router()
const orderRouter = require('../controller/orderController')

router.post('/orders', orderRouter.createOrder);
router.get('/orders/:id', orderRouter.getOrder);
router.put('/orders/:id', orderRouter.updateOrder); 
router.delete('/orders/:id', orderRouter.deleteOrde);

module.exports = router