const fs = require('fs');
const path = require('path');
const express = require('express');
const { animals } = require('./data/animals.json');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// port set up for heroku or localhost
const PORT = process.env.PORT || 3001;

// instantiates the server
const app = express();

// middleware | .use method tells the express app to intercept POST requests before it gets to the callback function. data will first be run through a couple of functions to take the raw data trasferred over http and convert it to a json object
// - express.urlencoded method takes incoming POST data, and converts it into key-value pairs that can be accessed in the req.body. extended true option inside the method informs server that there may be sub-array data nested in it as well, so it needs to look deep into the POST data to correctly parse all data.
app.use(express.urlencoded({ extended: true}));
// - express.json method takes incoming POST data foratted as json and parses it into the req.body javascript object
app.use(express.json());
// - express.static method allows the frontend html to run its scripts by making /public files readily available.
app.use(express.static('public'));

// ::routing middleware::
// **moved animal functions into ./lib/animals.js
// **moved routing functions into ./routes/ & its sub directories
app.use('/api', apiRoutes); // <host>/api router uses apiRoutes 
app.use('/', htmlRoutes); // <host>/ router uses htmlRoutes



// listens for requests. conventiionally placed at the end, must be placed after app declaration.
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`);
});