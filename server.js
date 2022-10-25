const fs = require("fs");
const path = require("path");
const express = require("express");
const { query } = require("express");
const { create } = require("domain");
const { animals } = require("./data/animals.json");
const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");

const PORT = process.env.PORT || 3001;
// instantiates the server
const app = express();

// express middleware | server needs both methods to accept POST data
// - method.parses incoming string or array data
app.use(express.urlencoded({ extended: true }));
// - method.parses incoming json data
app.use(express.json());
// - method.provides the /public file path location in the app, and instructs the server to make the .css & .js as available static resources. this allows font-end code to be accessed without the need for specific endpoint creation.
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);
app.use(express.static('public'));

// this route must be last
app.listen(PORT, () => {
  console.log(`api server now on port ${PORT}`);
});