const fs = require("fs");
const path = require("path");
const { query } = require("express");
const express = require("express");
const { animals } = require("./data/animals.json");
const { create } = require("domain");

const PORT = process.env.PORT || 3001;
// instantiates the server
const app = express();

// express middleware | server needs both methods to accept POST data
// - method.parses incoming string or array data
app.use(express.urlencoded({ extended: true }));
// - method.parses incoming json data
app.use(express.json());
// - method.provides the /public file path location in the app, and instructs the server to make the .css & .js as available static resources. this allows font-end code to be accessed without the need for specific endpoint creation.
app.use(express.static('public'));

function filterByQuery(query, animalsArray) {
  let personalityTraitArray = [];
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    // if traits is a string, place & save it to a new array
    if (typeof query.personalityTraits === "string") {
      personalityTraitArray = [query.personalityTraits];
    } else {
      personalityTraitArray = query.personalityTraits;
    }
  }

  // loops through each trait in the array
  personalityTraitArray.forEach((trait) => {
    // checks the trait against each animal in the array. this copy of [animalsArray] is being updated by the .forEach(trait) loop. the .filter(trait) targets each trait. this results in filteredResults containing only animals w/ filtered trait when the .forEach(trait) loop is done.
    filteredResults = filteredResults.filter(
      (animal) => animal.personalityTraits.indexOf(trait) !== -1
    );
  });
  if (query.diet) {
    filteredResults = filteredResults.filter(
      (animal) => animal.diet === query.diet
    );
  }
  if (query.species) {
    filteredResults = filteredResults.filter(
      (animal) => animal.species === query.species
    );
  }
  if (query.name) {
    filteredResults = filteredResults.filter(
      (animal) => animal.name === query.name
    );
  }
  // returns filtered results
  return filteredResults;
}

function findById(id, animalsArray) {
  const result = animalsArray.filter((animal) => animal.id === id)[0];
  return result;
}

// logic | accepts post route's req.body & animals array to add new data into
function createNewAnimal(body, animalsArray) {
  const animal = body;
  animalsArray.push(animal);
  // synchronous version of fs.writeFile doesn't require a callback function. works for small files
  fs.writeFileSync(
    path.join(__dirname, "./data/animals.json"),
    // formatting data | null, prevents editing existing data; 2, creates white space for readability
    JSON.stringify({ animals: animalsArray }, null, 2)
  );

  return animal;
}

// validate user input
function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false
  }
  return true;
}

app.get("/api/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

// gets route for specific anaimls
app.get("/api/animals/:id", (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    // parse response into the json format
    res.json(result);
  } else {
    res.send(404);
  }
});

// routes to /animals
app.get("/animals", (req, res) => {
  res.sendFile(path.join(__dirname, './public/animals.html'));
});

// this route gets the index.html to be served from Express server
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// listengs for post requests. allows for users to add data
app.post("/api/animals", (req, res) => {
  // req.body | where incoming content will be
  // sets id based on what the next index of the array will be. length is always 1 number ahead of last index, which prevents duplicate values (if data is not removed from animals.json)
  req.body.id = animals.length.toString();

  // if any data in req.body is incorrect, send back 400 error
  if (!validateAnimal(req.body)) {
    res.status(400).send('the animal is not properly formatted');
  } else {
    // adds animal to animals.json and animals array
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});

// routes to /zookeeper
app.get("/zookeepers", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/zookeepers.html"));
});

// deals with wildcard routes. this route should come last.
app.get("*", (req, res) => {
  res.sendFile(__dirname, './public/index.html')
})

// this route must be last
app.listen(PORT, () => {
  console.log(`api server now on port ${PORT}`);
});
