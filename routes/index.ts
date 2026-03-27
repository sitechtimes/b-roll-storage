import express from 'express';
const mediasRoutes = require('./medias')
const router = express.Router()

router.use('/medias', mediasRoutes)

module.exports = router;