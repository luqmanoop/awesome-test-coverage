const express = require('express');
const catRouter = express.Router();
const CatsController = require('../controllers');
const validateCat = require('../middlewares');

catRouter
  .route('/cats')
  .get(CatsController.findAll)
  .post(validateCat, CatsController.create);

catRouter.route('/cats/:id').get(CatsController.findOne);

module.exports = catRouter;
