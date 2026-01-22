const express = require('express');
const fs = require('fs');

const tours = JSON.parse(
  // parsing it as we need object not json
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'),
);

exports.checkID = (req, res, next, val) => {
  console.log(`id passed is:${val}`);
  if (val > tours.length)
    return res.status(404).json({
      status: 'fail',
      message: `No tour found with id ${val}`,
    });
  next();
};

exports.checkBody = (req, res, next) => {
  console.log("Checking request's body");
  console.log(req.body);
  if (!req.body.name || !req.body.price)
    return res.status(400).json({
      status: 'failed',
      message: 'incorrect payload passed, missing name or price',
    });
  next();
};

exports.getTours = (req, res) => {
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

exports.getSingleTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((t) => t.id === id);
  res.status(200).json({
    status: 'sucess',
    data: {
      tour,
    },
  });
};

exports.addTour = (req, res) => {
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
    },
  );
};

exports.updateTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((el) => el.id === id);
  Object.assign(tour, req.body);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
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
    },
  );
};

exports.deleteTour = (req, res) => {
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
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) console.log('Could not remove tour...');
      res.status(204).json({
        // on giving status 204 it does not give any json response
        status: 'sucess',
        data: null, // beacuse of 204
      });
    },
  );
};
