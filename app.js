const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

//_____________________________________________________________________

const app = express();
//_____________________________________________________________________

//TODO:  MIDDLEWARE
//? MIDDLEWARE always needs to be consumed inside app.use()
//? which further expects a fxn inside

app.use(morgan('dev')); // Morgan is just a request logger for Express
app.use(express.json()); // converts body to json()

//TODO: CUSTOM MIDDLEWARE 1
//? Express treats any function with 3 arguments as middleware.

app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next(); //tells Express: “I’m done here — move to the next middleware or route.”
});

app.use((req, res, next) => {
  req.currentTime = new Date().toISOString();
  next();
});
//_____________________________________________________________________

const port = 3000;
//_____________________________________________________________________

//TODO: ROUTE HANDLERS
//read data once as top level code is execute only once in the beginning
const tours = JSON.parse(
  // parsing it as we need object not json
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

const getTours = (req, res) => {
  console.log(req.currentTime);
  res.status(200).json({
    message: 'sucess',
    reqTime: req.currentTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getSingleTour = (req, res) => {
  // console.log(req.params); // route params from the URL

  const id = +req.params.id;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    console.log('Tour not found!');
    return res.status(404).json({
      status: 'failed',
      message: `invalid ID:${id}`,
    });
  }
  res.status(200).json({
    status: 'sucess',
    data: {
      tour,
    },
  });
};

const addTour = (req, res) => {
  //* without middleware 👇 gives undefined => app.use(express.json());
  console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  // GET THE TRIGGERED ID
  const id = +req.params.id;

  // GET TOUR BASED ON THAT
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: `No tour found with id ${id}`,
    });
  }

  // Mutates the object inside tours array
  Object.assign(tour, req.body);

  // Persist updated tours list
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: 'Failed to update tour',
        });
      }

      console.log('Tour patched...');
      res.status(200).json({
        status: 'success',
        data: {
          tour,
        },
      });
    }
  );
};

const deleteTour = (req, res) => {
  const id = +req.params.id;

  // GET INDEX OF TOUR TO DELETE
  const index = tours.findIndex((el) => el.id === id);
  console.log(id);
  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      message: `No tour found with id ${id}`,
    });
  }

  // DELETE TOUR USING SPLICE
  console.log('Deleted tour');
  tours.splice(index, 1);

  // UPDATING THE REMAINING TOURS
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) console.log('Could not remove tour...');
      res.status(204).json({
        // on giving status 204 it does not give any json response
        status: 'sucess',
        data: null, // beacuse of 204
      });
    }
  );
};

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'route yet to be implemented',
  });
};

const getSingleUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'route yet to be implemented',
  });
};
const updateUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'route yet to be implemented',
  });
};
const addUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'route yet to be implemented',
  });
};
const deleteUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'route yet to be implemented',
  });
};
//_____________________________________________________________________
//TODO: ROUTES

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

//TODO: ROUTE OPTIMIZATION 3 - USING EXPRESS.ROUTER()
// this makes router a mini express app which has its own middleware, own routes and can be mounted anywhere
//* 1.ROUTER (TOUR/USER)
const tourRouter = express.Router();
const userRouter = express.Router();

//* 2.Router-level middleware
tourRouter.use((req, res, next) => {
  console.log('Tour level middleware');
  next();
});
userRouter.use((req, res, next) => {
  console.log('User level middleware');
  next();
});

//* 3.Routes RELATIVE to mount path
tourRouter.route('/').get(getTours).post(addTour);
tourRouter
  .route('/:id')
  .get(getSingleTour)
  .patch(updateTour)
  .delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(addUser);
userRouter
  .route('/:id')
  .get(getSingleUser)
  .patch(updateUser)
  .delete(deleteUser);

//* 4.Mount router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//_____________________________________________________________________

//TODO: START SERVER
//? LISTENING TO API's
app.listen(port, () => {
  console.log(`listening at port ${port}...`);
});
