import express from 'express';
const placeholderController = require('../controllers/placeholderController')
const router = express.Router();

router.get(`/`, placeholderController.getHelloWorld);

router.get(`/article/:title`, placeholderController.getArticleByTitle);

router.post(`/login`, placeholderController.login); 

module.exports = router;
