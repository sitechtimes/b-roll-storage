import express from 'express';
const mediaController = require('../controllers/mediaController')
const router = express.Router();

router.get(`/`, mediaController.index);
router.get(`/filter`, mediaController.getMedia);

module.exports = router;
