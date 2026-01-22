const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(morgan('dev')); // Morgan is just a request logger for Express
app.use(express.json()); // converts body to json()

app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next(); //tells Express: “I’m done here — move to the next middleware or route.”
});

app.use((req, res, next) => {
  req.currentTime = new Date().toISOString();
  next();
});

//TODO: ROUTE OPTIMIZATION 3 - USING EXPRESS.ROUTER()
// this makes router a mini express app which has its own middleware, own routes and can be mounted anywhere
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//TODO: ROUTE OPTIMIZATION 1
// //? GET ALL TOURS
// app.get('/api/v1/tours', getTours);
// //? GET SINGLE TOUR BASED ON ID
// app.get(`/api/v1/tours/:id`, getSingleTour);
// //? ADD NEW TOUR
// app.post('/api/v1/tours', addTour)
// //? UPDATE TOUR
// app.patch('/api/v1/tours/:id', updateTour);
// //? DELETE TOUR
// app.delete('/api/v1/tours/:id', deleteTour);

//TODO: ROUTE OPTIMIZATION 2
// now we will chain requests based on endpoints

// app.route('/api/v1/tours').get(getTours).post(addTour);

// app
//   .route('/api/v1/tours/:id')
//   .get(getSingleTour)
//   .patch(updateTour)
//   .delete(deleteTour);

// app.route('/api/v1/users').get(getAllUsers).post(addUser);

// app
//   .route('/api/v1/users/:id')
//   .get(getSingleUser)
//   .patch(updateUser)
//   .delete(deleteUser);

module.exports = app;
