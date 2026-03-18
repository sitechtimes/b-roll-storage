import express from 'express';
const mediasRoutes = require('./medias')
const usersRoutes = require('./users')
const authRoutes = require('./auth')
const router = express.Router()

router.use('/medias', mediasRoutes)
router.use('/users', usersRoutes)
router.use('/auth', authRoutes)

module.exports = router;
