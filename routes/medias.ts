import express from 'express';
const mediaController = require('../controllers/mediaController')
const router = express.Router();

router.get(`/`, mediaController.index);
router.get(`/filter`, mediaController.getMedia);
router.post('/', mediaController.createMedia)

module.exports = router;
