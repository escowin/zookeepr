const router = require("express").Router();
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require("../../lib/animals");
const { animals } = require("../../data/animals.json");

router.get("/animals", (req, res) => {
    let results = animals;
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    res.json(results);
  });
  
// gets route for specific anaimls
router.get("/animals/:id", (req, res) => {
const result = findById(req.params.id, animals);
if (result) {
    // parse response into the json format
    res.json(result);
} else {
    res.send(404);
}
});

// listengs for post requests. allows for users to add data
router.post("/animals", (req, res) => {
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

module.exports = router;