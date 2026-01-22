const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  addUser,
  getSingleUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

//TODO: MIDDLEWARE
router.use((req, res, next) => {
  console.log('User level middleware');
  next();
});

//TODO: ROUTES
router.route('/').get(getAllUsers).post(addUser);
router.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = router;
