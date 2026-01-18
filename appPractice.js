const express = require('express');
const fs = require('fs');

const app = express();

const port = 3000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'),
);

app.use((req, res, next) => {
  req.currentTime = new Date().toISOString();
  next();
});
app.use(express.json()); //converts body to json

// GET TOURS
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'success',
    reqTime: req.currentTime,
    data: {
      tours,
    },
  });
});

// ADD NEW TOUR
app.post(`/api/v1/tours`, (req, res) => {
  console.log(req.body);

  const id = tours.length + 1;
  const newTour = Object.assign({ id }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'fail',
          message: 'Error: could not add tour',
        });
      }

      res.status(201).json({
        status: 'success',
        message: 'Tour added successully',
        data: {
          tour: newTour,
        },
      });
    },
  );
});

// UPDATE TOUR
app.patch('/api/v1/tours/:id', (req, res) => {
  const id = +req.params.id;
  console.log(tours);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: `No tour found with id ${id}`,
    });
  }
});

app.listen(port);
