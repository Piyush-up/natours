const express = require('express');
const {
  getTours,
  getSingleTour,
  updateTour,
  addTour,
  deleteTour,
  checkID,
  checkBody,
} = require('../controllers/tourController');

const router = express.Router();

//TODO: MIDDLEWARE
router.use((req, res, next) => {
  console.log('Tour level middleware');
  next();
});
//TODO: PARAM MIDDLEWARE
//? helpful in putting check in between, avoiding the same at controller level
router.param('id', checkID);

//TODO: ROUTES
router.route('/').get(getTours).post(checkBody, addTour);
router.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

module.exports = router;
